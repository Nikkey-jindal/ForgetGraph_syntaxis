"""FastAPI wrapper around the frozen FORGETGRAPH backend (PS09/forgetgraph).

The React frontend must call this API for every number it displays.
No backend logic is reimplemented here — everything is read from the
SQLite database (DB_PATH) or computed by pipeline_core / verify.

Run:  cd PS09 && python -m uvicorn api:app --port 8000
"""

from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from forgetgraph import DB_PATH, FEATURE_COLUMNS, N_USERS, RIDGE_ALPHA, SEED, TARGET_COLUMN
from forgetgraph.pipeline_core import (
    FEATURE_NAMES,
    PIPELINE_STEPS,
    delete_user,
    get_connection,
    ingest_user,
    load_training_data,
    train_model,
)

app = FastAPI(
    title="FORGETGRAPH API",
    description="Dependency-aware data deletion verification (PS09) — all data served live from SQLite + Ridge model.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB = os.environ.get("FORGETGRAPH_DB", DB_PATH)


class IngestRequest(BaseModel):
    id: int
    age: float
    account_balance: float
    num_transactions: float
    tenure_days: float
    risk_score: float


def _count(conn, table: str, where: str = "", params: tuple = ()) -> int:
    return conn.execute(f"SELECT COUNT(*) FROM {table} {where}", params).fetchone()[0]


@app.get("/stats")
def get_stats() -> dict[str, Any]:
    """Live KPIs: user/tombstone/log counts plus the current model config."""
    conn = get_connection(DB)
    try:
        users = _count(conn, "users")
        tombstones = _count(conn, "tombstones")
        logs = _count(conn, "deletion_log")
        features = _count(conn, "features")
        predictions = _count(conn, "predictions")
        passes = _count(conn, "deletion_log", "WHERE step_name = 'verification_run' AND status = 'pass'")
        fails = _count(conn, "deletion_log", "WHERE step_name = 'verification_run' AND status = 'fail'")
        blocked = _count(conn, "deletion_log", "WHERE step_name = 'reingestion_blocked'")
    finally:
        conn.close()
    return {
        "total_users_seeded": N_USERS,
        "active_users": users,
        "tombstoned_users": tombstones,
        "deleted_users": tombstones,
        "feature_rows": features,
        "cached_predictions": predictions,
        "deletion_log_events": logs,
        "verification_passed": passes,
        "verification_failed": fails,
        "reingestion_blocked": blocked,
        "model": {
            "name": "Risk Prediction Model",
            "type": f"Ridge Regression (L2, alpha={RIDGE_ALPHA})",
            "features": FEATURE_NAMES,
            "raw_feature_columns": FEATURE_COLUMNS,
            "target": TARGET_COLUMN,
            "seed": SEED,
            "ridge_alpha": RIDGE_ALPHA,
            "status": "Healthy",
        },
        "pipeline_steps": PIPELINE_STEPS,
    }


@app.post("/delete")
def post_delete(payload: dict[str, Any]) -> dict[str, Any]:
    """Run the full 6-step deletion pipeline for a user id."""
    if "user_id" not in payload:
        raise HTTPException(status_code=422, detail="user_id is required")
    user_id = int(payload["user_id"])
    result = delete_user(user_id, db_path=DB)
    verification = result.get("verification")
    return {
        "status": result["status"],
        "user_id": user_id,
        "steps": PIPELINE_STEPS if result["status"] == "deleted" else [],
        "verification": (
            {
                "passed": verification["passed"],
                "deleted_user_absent": verification["deleted_user_absent"],
                "coefficients_match": verification["coefficients_match"],
                "intercept_match": verification["intercept_match"],
                "reference_coef": [float(c) for c in verification["reference_coef"]],
                "reference_intercept": float(verification["reference_intercept"]),
            }
            if verification
            else None
        ),
        "replacement_model": (
            {
                "coef": [float(c) for c in result["replacement_model"].coef_],
                "intercept": float(result["replacement_model"].intercept_),
            }
            if result.get("replacement_model") is not None
            else None
        ),
    }


@app.post("/ingest")
def post_ingest(user: IngestRequest) -> dict[str, Any]:
    """Re-ingest a user; tombstoned or duplicate ids are blocked by the backend."""
    conn = get_connection(DB)
    try:
        outcome = ingest_user(conn, user.model_dump())
    finally:
        conn.close()
    return {"outcome": outcome, "user_id": user.id}


@app.get("/log")
def get_log(limit: int = 200) -> dict[str, Any]:
    """Deletion log, newest first."""
    conn = get_connection(DB)
    try:
        rows = conn.execute(
            "SELECT id, user_id, step_name, status, timestamp FROM deletion_log "
            "ORDER BY id DESC LIMIT ?",
            (limit,),
        ).fetchall()
    finally:
        conn.close()
    return {
        "events": [
            {
                "id": r["id"],
                "userId": r["user_id"],
                "stepName": r["step_name"],
                "status": r["status"].upper(),
                "timestamp": r["timestamp"],
                "details": f"{r['step_name']} -> {r['status']}",
            }
            for r in rows
        ]
    }


@app.get("/tombstones")
def get_tombstones() -> dict[str, Any]:
    conn = get_connection(DB)
    try:
        rows = conn.execute(
            "SELECT t.user_id, t.deleted_at, "
            "(SELECT COUNT(*) FROM deletion_log l WHERE l.user_id = t.user_id "
            " AND l.step_name = 'reingestion_blocked') AS attempts_blocked "
            "FROM tombstones t ORDER BY t.deleted_at DESC"
        ).fetchall()
    finally:
        conn.close()
    return {
        "tombstones": [
            {
                "userId": r["user_id"],
                "deletedAt": r["deleted_at"],
                "attemptsBlocked": r["attempts_blocked"],
            }
            for r in rows
        ]
    }


@app.get("/verification")
def get_verification() -> dict[str, Any]:
    """Current (replacement) model coefficients + intercept, retrained live from DB,
    together with the persisted original model's coefficients for comparison."""
    conn = get_connection(DB)
    try:
        X, y, user_ids = load_training_data(conn)
    finally:
        conn.close()

    current_model = train_model(X, y)

    original_coef = None
    original_intercept = None
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "original_model.pkl")
    if os.path.exists(model_path):
        import pickle

        with open(model_path, "rb") as f:
            original_model = pickle.load(f)
        original_coef = [float(c) for c in original_model.coef_]
        original_intercept = float(original_model.intercept_)

    return {
        "feature_names": FEATURE_NAMES,
        "trained_on": len(user_ids),
        "seed": SEED,
        "ridge_alpha": RIDGE_ALPHA,
        "current_model": {
            "coef": [float(c) for c in current_model.coef_],
            "intercept": float(current_model.intercept_),
        },
        "original_model": (
            {"coef": original_coef, "intercept": original_intercept}
            if original_coef is not None
            else None
        ),
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    raise SystemExit(uvicorn.run(app, host="127.0.0.1", port=8000))
