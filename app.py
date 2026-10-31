"""
ForgetGraph dashboard: UI layer only.

Run from the repo root (next to forgetgraph/ and original_model.pkl):
    streamlit run app.py

Rules this file follows:
  * Never modifies forgetgraph/ or test_forgetgraph.py.
  * Every number on screen comes from forgetgraph.db, original_model.pkl,
    the delete_user() return value, or constants defined below.
  * All reads are plain SQL; the only writes go through delete_user() and
    ingest_user().
"""
from __future__ import annotations

import base64
import html as htmllib
import io
import json
import time
from pathlib import Path

import altair as alt
import joblib
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import networkx as nx
import numpy as np
import pandas as pd
import streamlit as st

from forgetgraph import DB_PATH
from forgetgraph.pipeline_core import delete_user, get_connection, ingest_user

# ──────────────────────────────────────────────────────────────────────────
# Constants
# ──────────────────────────────────────────────────────────────────────────
MODEL_PATH = Path(__file__).resolve().parent / "original_model.pkl"

FEATURE_NAMES = ["age_norm", "balance_log", "tx_per_tenure", "balance_per_tx"]

# Order matters: this is the order the pipeline runs in.
STEPS = {
    "source_removed": ("Source record removed", "The user’s row is deleted from the users table."),
    "features_recomputed": ("Features recomputed", "Derived features are rebuilt without this user."),
    "cache_invalidated": ("Cache invalidated", "Cached predictions for this user are dropped."),
    "model_retrained": ("Model retrained", "A replacement model is fitted on the remaining users."),
    "verification_run": ("Verification run", "The replacement model is checked against a reference model."),
    "tombstone_recorded": ("Tombstone recorded", "The ID is banned from future ingestion."),
}

C_BG = "#0F1420"
C_SURFACE = "#171E2E"
C_SURFACE_2 = "#1F2840"
C_LINE = "#2A3552"
C_TEXT = "#E8ECF5"
C_MUTED = "#8E9AB8"
C_ACCENT = "#7C8CFF"
C_OK = "#3DDC97"
C_BAD = "#FF6B6B"
C_WARN = "#F5A54A"
C_INFO = "#6FA8FF"

STEP_COLORS = {
    "source_removed": "#7C8CFF",
    "features_recomputed": "#6FA8FF",
    "cache_invalidated": "#5CCFE6",
    "model_retrained": "#B28CFF",
    "verification_run": "#3DDC97",
    "tombstone_recorded": "#F5A54A",
    "reingestion_blocked": "#FF6B6B",
}

PAGES = [
    "Overview",
    "Dependency graph",
    "Deletion center",
    "Model comparison",
    "Tombstones",
    "Re-ingestion test",
]

st.set_page_config(
    page_title="ForgetGraph",
    page_icon="🕸️",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ──────────────────────────────────────────────────────────────────────────
# Styling
# ──────────────────────────────────────────────────────────────────────────
CSS = f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');

html, body, [class*="st-"], .stApp {{
  font-family: 'Manrope', 'Segoe UI', system-ui, sans-serif;
  font-feature-settings: 'tnum' 1;
}}
.stApp {{ background: {C_BG}; color: {C_TEXT}; }}
header[data-testid="stHeader"] {{ background: transparent; }}
#MainMenu, footer {{ visibility: hidden; }}
.block-container {{ padding-top: 2.2rem; padding-bottom: 4rem; max-width: 1180px; }}

h1, h2, h3, .fg-title, .kpi-v, .banner-word, .big-count {{
  font-family: 'Sora', 'Manrope', sans-serif !important;
  letter-spacing: -0.01em;
}}

/* Sidebar */
section[data-testid="stSidebar"] {{
  background: {C_SURFACE};
  border-right: 1px solid {C_LINE};
}}
.brand {{ display:flex; align-items:center; gap:.65rem; margin: .2rem 0 .3rem; }}
.brand-mark {{
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, {C_ACCENT}, #B28CFF);
  display:flex; align-items:center; justify-content:center;
  font-family:'Sora'; font-weight:700; color:#0F1420; font-size: 1rem;
}}
.brand-name {{ font-family:'Sora'; font-weight:600; font-size:1.15rem; }}
.brand-tag {{ color:{C_MUTED}; font-size:.82rem; margin-bottom:1.1rem; line-height:1.35; }}
section[data-testid="stSidebar"] [role="radiogroup"] {{ gap: .15rem; }}
section[data-testid="stSidebar"] [role="radiogroup"] label {{
  padding: .5rem .7rem; border-radius: 9px; width: 100%;
}}
section[data-testid="stSidebar"] [role="radiogroup"] label:hover {{ background: {C_SURFACE_2}; }}
section[data-testid="stSidebar"] [role="radiogroup"] label:has(input:checked) {{
  background: {C_SURFACE_2}; box-shadow: inset 3px 0 0 {C_ACCENT};
}}
section[data-testid="stSidebar"] [role="radiogroup"] label > div:first-child {{ display:none; }}

/* Page header */
.fg-head {{ margin-bottom: 1.6rem; }}
.fg-title {{ font-size: 1.85rem; font-weight: 600; margin: 0; }}
.fg-sub {{ color: {C_MUTED}; margin-top: .3rem; font-size: .98rem; max-width: 62ch; line-height: 1.5; }}

/* Pills & chips */
.pill {{
  display:inline-flex; align-items:center; gap:.4rem; padding: .12rem .65rem;
  border-radius: 999px; font-size:.76rem; font-weight:600; white-space:nowrap;
}}
.pill.ok   {{ color:{C_OK};   background: rgba(61,220,151,.12); }}
.pill.bad  {{ color:{C_BAD};  background: rgba(255,107,107,.13); }}
.pill.warn {{ color:{C_WARN}; background: rgba(245,165,74,.13); }}
.pill.info {{ color:{C_INFO}; background: rgba(111,168,255,.13); }}
.pill.idle {{ color:{C_MUTED};background: rgba(142,154,184,.12); }}
.dot {{ width:8px; height:8px; border-radius:50%; display:inline-block; }}
.health {{
  display:flex; align-items:center; gap:.55rem; padding:.55rem .75rem;
  border:1px solid {C_LINE}; border-radius: 10px; font-size:.84rem; margin-top: 1.4rem;
}}

/* KPI strip: one panel, four cells */
.kpi-strip {{
  display:grid; grid-template-columns: repeat(4, 1fr);
  background:{C_SURFACE}; border:1px solid {C_LINE}; border-radius: 16px; overflow:hidden;
  margin-bottom: 1.6rem;
}}
.kpi {{ padding: 1.15rem 1.3rem; border-right: 1px solid {C_LINE}; }}
.kpi:last-child {{ border-right: none; }}
.kpi-v {{ font-size: 2.1rem; font-weight: 600; line-height: 1.1; }}
.kpi-l {{ color:{C_TEXT}; font-weight:600; font-size:.92rem; margin-top:.45rem; }}
.kpi-h {{ color:{C_MUTED}; font-size:.8rem; margin-top:.15rem; }}
@media (max-width: 800px) {{
  .kpi-strip {{ grid-template-columns: repeat(2, 1fr); }}
  .kpi:nth-child(2) {{ border-right:none; }}
  .kpi:nth-child(-n+2) {{ border-bottom:1px solid {C_LINE}; }}
}}

/* Panels */
.panel {{
  background:{C_SURFACE}; border:1px solid {C_LINE}; border-radius: 14px; padding: 1.1rem 1.25rem;
}}
.panel-title {{ font-family:'Sora'; font-weight:600; font-size:1.02rem; margin-bottom:.7rem; }}
.empty {{ color:{C_MUTED}; font-size:.92rem; line-height:1.5; padding:.6rem 0; }}

/* Activity feed */
.feed-row {{ display:flex; align-items:center; gap:.7rem; padding:.55rem 0; border-bottom:1px solid {C_LINE}; }}
.feed-row:last-child {{ border-bottom:none; }}
.feed-main {{ flex:1; min-width:0; }}
.feed-step {{ font-weight:600; font-size:.9rem; }}
.feed-meta {{ color:{C_MUTED}; font-size:.78rem; }}

/* Stepper */
.stepper {{ position:relative; }}
.step {{ display:flex; gap:1rem; padding-bottom: 1.15rem; position:relative; }}
.step:last-child {{ padding-bottom:0; }}
.step:not(:last-child)::before {{
  content:''; position:absolute; left: 15px; top: 32px; bottom: 0; width: 2px; background:{C_LINE};
}}
.step.done:not(:last-child)::before {{ background: rgba(61,220,151,.45); }}
.marker {{
  width:32px; height:32px; border-radius:50%; flex:none; display:flex; align-items:center; justify-content:center;
  font-weight:700; border:2px solid {C_LINE}; color:{C_MUTED}; background:{C_BG}; z-index:1;
}}
.step.done .marker {{ border-color:{C_OK}; color:{C_OK}; background: rgba(61,220,151,.12); }}
.step.failed .marker {{ border-color:{C_BAD}; color:{C_BAD}; background: rgba(255,107,107,.12); }}
.step-body {{ flex:1; min-width:0; }}
.step-title {{ font-weight:600; }}
.step-desc {{ color:{C_MUTED}; font-size:.85rem; margin-top:.1rem; }}
.step-side {{ text-align:right; display:flex; flex-direction:column; gap:.25rem; align-items:flex-end; }}
.step-ts {{ color:{C_MUTED}; font-size:.74rem; }}

/* Banners */
.banner {{ border-radius: 14px; padding: 1.1rem 1.3rem; border:1px solid; margin-bottom: 1.2rem; }}
.banner.ok   {{ background: rgba(61,220,151,.09);  border-color: rgba(61,220,151,.45); }}
.banner.bad  {{ background: rgba(255,107,107,.09); border-color: rgba(255,107,107,.5); }}
.banner.warn {{ background: rgba(245,165,74,.09);  border-color: rgba(245,165,74,.5); }}
.banner.info {{ background: rgba(111,168,255,.09); border-color: rgba(111,168,255,.45); }}
.banner-title {{ font-weight:700; font-size:1.02rem; }}
.banner-text {{ color:{C_MUTED}; font-size:.92rem; margin-top:.2rem; line-height:1.5; }}
.verdict {{ display:flex; align-items:center; gap:1.6rem; }}
.banner-word {{ font-size: 3.2rem; font-weight:700; line-height:1; }}
.banner.ok .banner-word {{ color:{C_OK}; }}
.banner.bad .banner-word {{ color:{C_BAD}; }}

/* Tables */
.tbl-wrap {{ border:1px solid {C_LINE}; border-radius: 12px; overflow:auto; max-height: 460px; background:{C_SURFACE}; }}
.tbl {{ width:100%; border-collapse: collapse; font-size:.9rem; }}
.tbl th {{
  position:sticky; top:0; background:{C_SURFACE_2}; text-align:left; font-weight:600;
  color:{C_MUTED}; padding:.65rem .9rem; font-size:.82rem; border-bottom:1px solid {C_LINE};
}}
.tbl td {{ padding:.6rem .9rem; border-bottom:1px solid {C_LINE}; }}
.tbl tr:last-child td {{ border-bottom:none; }}
.tbl .num {{ text-align:right; }}
.tbl tr.total td {{ background: rgba(124,140,255,.07); font-weight:600; }}

.big-count {{ font-size: 3.4rem; font-weight:600; line-height:1; color:{C_WARN}; }}
.big-count-l {{ color:{C_MUTED}; margin-top:.4rem; }}

/* Buttons & inputs */
button[kind="primary"], button[data-testid="stBaseButton-primary"] {{
  background:{C_ACCENT}; color:#0F1420; border:none; font-weight:700; border-radius:10px;
}}
button[kind="primary"]:hover, button[data-testid="stBaseButton-primary"]:hover {{ filter: brightness(1.1); color:#0F1420; }}
button[kind="secondary"], button[data-testid="stBaseButton-secondary"] {{ border-radius:10px; border-color:{C_LINE}; }}
:focus-visible {{ outline: 2px solid {C_ACCENT} !important; outline-offset: 2px; }}
@media (prefers-reduced-motion: reduce) {{ * {{ transition:none !important; animation:none !important; }} }}
</style>
"""


def render(markup: str) -> None:
    """Render an HTML string (strips indentation so Markdown never treats it as code)."""
    cleaned = "\n".join(line.strip() for line in markup.splitlines() if line.strip())
    st.markdown(cleaned, unsafe_allow_html=True)


def esc(value) -> str:
    return htmllib.escape(str(value))


def fmt_ts(ts) -> str:
    return str(ts).replace("T", " ")[:19]


def humanize(step: str) -> str:
    if step in STEPS:
        return STEPS[step][0]
    text = step.replace("_", " ")
    return text[:1].upper() + text[1:]


# ──────────────────────────────────────────────────────────────────────────
# Data access (plain SQL reads)
# ──────────────────────────────────────────────────────────────────────────
def query(sql: str, params: tuple = ()) -> pd.DataFrame:
    conn = get_connection(DB_PATH)
    try:
        return pd.read_sql_query(sql, conn, params=params)
    finally:
        conn.close()


def scalar(sql: str, params: tuple = ()) -> int:
    df = query(sql, params)
    return int(df.iloc[0, 0]) if len(df) else 0


def system_health() -> tuple[bool, bool]:
    try:
        scalar("SELECT COUNT(*) FROM users")
        db_ok = True
    except Exception:
        db_ok = False
    return db_ok, MODEL_PATH.exists()


@st.cache_resource
def _load_model(path: str, mtime: float):
    return joblib.load(path)


def original_params():
    """(coef array, intercept) from original_model.pkl, or None."""
    if not MODEL_PATH.exists():
        return None
    try:
        model = _load_model(str(MODEL_PATH), MODEL_PATH.stat().st_mtime)
        return np.ravel(model.coef_), float(np.ravel(model.intercept_)[0])
    except Exception:
        return None


# ──────────────────────────────────────────────────────────────────────────
# UI building blocks
# ──────────────────────────────────────────────────────────────────────────
def page_header(title: str, subtitle: str) -> None:
    render(f"""
    <div class="fg-head">
      <h1 class="fg-title">{esc(title)}</h1>
      <div class="fg-sub">{esc(subtitle)}</div>
    </div>
    """)


def pill(status) -> str:
    s = str(status).lower()
    if s in ("ok", "pass", "accepted", "removed", "done"):
        cls = "ok"
    elif s in ("fail", "error", "blocked", "present"):
        cls = "bad"
    else:
        cls = "info"
    return f'<span class="pill {cls}">{esc(status)}</span>'


def banner(kind: str, title: str, text: str = "") -> None:
    body = f'<div class="banner-text">{esc(text)}</div>' if text else ""
    render(f'<div class="banner {kind}"><div class="banner-title">{esc(title)}</div>{body}</div>')


def html_table(df: pd.DataFrame, num_cols=(), fmt=None, total_last=False) -> str:
    fmt = fmt or {}
    head = "".join(f'<th class="{"num" if c in num_cols else ""}">{esc(c)}</th>' for c in df.columns)
    rows = []
    last = len(df) - 1
    for i, (_, r) in enumerate(df.iterrows()):
        cells = []
        for c in df.columns:
            text = fmt[c](r[c]) if c in fmt else esc(r[c])
            cells.append(f'<td class="{"num" if c in num_cols else ""}">{text}</td>')
        cls = ' class="total"' if total_last and i == last else ""
        rows.append(f"<tr{cls}>{''.join(cells)}</tr>")
    return (
        f'<div class="tbl-wrap"><table class="tbl"><thead><tr>{head}</tr></thead>'
        f"<tbody>{''.join(rows)}</tbody></table></div>"
    )


def stepper_html(rows_by_step: dict, upto: int | None = None) -> str:
    items = []
    for i, (key, (title, desc)) in enumerate(STEPS.items()):
        row = rows_by_step.get(key) if (upto is None or i < upto) else None
        if row is None:
            cls, mark, side = "", "", '<span class="pill idle">Pending</span>'
        else:
            failed = str(row["status"]).lower() == "fail"
            cls = "failed" if failed else "done"
            mark = "✕" if failed else "✓"
            side = f'{pill(row["status"])}<span class="step-ts">{esc(fmt_ts(row["timestamp"]))}</span>'
        items.append(
            f'<div class="step {cls}"><div class="marker">{mark}</div>'
            f'<div class="step-body"><div class="step-title">{esc(title)}</div>'
            f'<div class="step-desc">{esc(desc)}</div></div>'
            f'<div class="step-side">{side}</div></div>'
        )
    return f'<div class="panel"><div class="stepper">{"".join(items)}</div></div>'


def user_steps(user_id: int) -> dict:
    df = query(
        "SELECT id, user_id, step_name, status, timestamp FROM deletion_log "
        "WHERE user_id=? ORDER BY id",
        (user_id,),
    )
    out = {}
    for _, r in df.iterrows():
        out[r["step_name"]] = r.to_dict()
    return out


def show_chart(chart: alt.Chart) -> None:
    try:
        st.altair_chart(chart, width="stretch", theme=None)
    except TypeError:
        st.altair_chart(chart, use_container_width=True, theme=None)


# ──────────────────────────────────────────────────────────────────────────
# Pages
# ──────────────────────────────────────────────────────────────────────────
def page_overview() -> None:
    page_header(
        "Overview",
        "Live counts from the database, and every action the deletion pipeline has taken.",
    )

    total = scalar("SELECT COUNT(*) FROM users")
    deleted = scalar("SELECT COUNT(*) FROM tombstones")
    blocked = scalar("SELECT COUNT(*) FROM deletion_log WHERE step_name='reingestion_blocked'")
    passed = scalar(
        "SELECT COUNT(*) FROM deletion_log WHERE step_name='verification_run' AND status='pass'"
    )
    cells = [
        (total, "Total records", "Rows in users"),
        (deleted, "Deleted users", "Tombstones recorded"),
        (blocked, "Blocked re-ingestions", "Rejected inserts"),
        (passed, "Verifications passed", "Model checks that passed"),
    ]
    render(
        '<div class="kpi-strip">'
        + "".join(
            f'<div class="kpi"><div class="kpi-v">{v:,}</div>'
            f'<div class="kpi-l">{esc(l)}</div><div class="kpi-h">{esc(h)}</div></div>'
            for v, l, h in cells
        )
        + "</div>"
    )

    left, right = st.columns([3, 2], gap="large")

    with left:
        render('<div class="panel-title">Pipeline activity</div>')
        log = query("SELECT timestamp, step_name FROM deletion_log ORDER BY id")
        chart = activity_chart(log)
        if chart is None:
            render(
                '<div class="panel"><div class="empty">No activity yet. '
                "Delete a user in the Deletion center to start the log.</div></div>"
            )
        else:
            show_chart(chart)

    with right:
        render('<div class="panel-title">Recent activity</div>')
        recent = query(
            "SELECT id, user_id, step_name, status, timestamp FROM deletion_log "
            "ORDER BY id DESC LIMIT 10"
        )
        if recent.empty:
            render('<div class="panel"><div class="empty">Nothing logged yet.</div></div>')
        else:
            rows = "".join(
                f'<div class="feed-row"><div class="feed-main">'
                f'<div class="feed-step">{esc(humanize(r.step_name))}</div>'
                f'<div class="feed-meta">User {esc(r.user_id)} · {esc(fmt_ts(r.timestamp))}</div></div>'
                f"{pill(r.status)}</div>"
                for r in recent.itertuples()
            )
            render(f'<div class="panel">{rows}</div>')


def activity_chart(log: pd.DataFrame):
    if log.empty:
        return None
    df = log.copy()
    df["ts"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df = df.dropna(subset=["ts"])
    if df.empty:
        return None
    span = df["ts"].max() - df["ts"].min()
    if span <= pd.Timedelta(hours=3):
        freq, label_fmt = "min", "%H:%M"
    elif span <= pd.Timedelta(days=3):
        freq, label_fmt = "h", "%d %b %H:00"
    else:
        freq, label_fmt = "D", "%d %b"
    df["bucket"] = df["ts"].dt.floor(freq)
    df["when"] = df["bucket"].dt.strftime(label_fmt)
    order = list(df.sort_values("bucket")["when"].drop_duplicates())
    agg = df.groupby(["when", "step_name"]).size().reset_index(name="actions")
    steps = sorted(agg["step_name"].unique())
    colors = [STEP_COLORS.get(s, C_MUTED) for s in steps]

    chart = (
        alt.Chart(agg)
        .mark_bar(cornerRadiusTopLeft=3, cornerRadiusTopRight=3)
        .encode(
            x=alt.X("when:O", sort=order, title=None, axis=alt.Axis(labelAngle=0)),
            y=alt.Y("actions:Q", title="Actions", axis=alt.Axis(tickMinStep=1)),
            color=alt.Color(
                "step_name:N",
                scale=alt.Scale(domain=steps, range=colors),
                legend=alt.Legend(title=None, orient="bottom", columns=2),
            ),
            tooltip=[
                alt.Tooltip("when:O", title="Time"),
                alt.Tooltip("step_name:N", title="Step"),
                alt.Tooltip("actions:Q", title="Actions"),
            ],
        )
        .properties(height=300)
        .configure(background="rgba(0,0,0,0)")
        .configure_view(stroke=None)
        .configure_axis(
            labelColor=C_MUTED, titleColor=C_MUTED, gridColor="#222B42",
            domainColor=C_LINE, tickColor=C_LINE,
        )
        .configure_legend(labelColor=C_MUTED, symbolType="square")
    )
    return chart


def draw_graph(counts: dict, uid: int | None, retrained: bool) -> str:
    """Draw users → features → {predictions, model}. Returns a base64 PNG."""
    G = nx.DiGraph()
    G.add_edges_from([("users", "features"), ("features", "predictions"), ("features", "model")])
    pos = {"users": (0.0, 0.0), "features": (1.7, 0.0), "predictions": (3.4, 0.8), "model": (3.4, -0.8)}
    edge_label = {("users", "features"): "derives", ("features", "predictions"): "feeds", ("features", "model"): "trains"}
    sub = {
        "users": f"{counts['users']:,} rows",
        "features": f"{counts['features']:,} rows",
        "predictions": f"{counts['predictions']:,} rows",
        "model": f"Ridge, {len(FEATURE_NAMES)} features",
    }
    title = {"users": "users", "features": "features", "predictions": "predictions", "model": "model"}

    traced = uid is not None
    edge_color = C_WARN if traced else "#4A5A85"
    box_edge = C_WARN if traced else "#4A5A85"
    w, h = 1.05, 0.62

    fig, ax = plt.subplots(figsize=(10.5, 4.6), dpi=170)
    fig.patch.set_alpha(0)
    ax.set_facecolor("none")

    for u, v in G.edges:
        (x1, y1), (x2, y2) = pos[u], pos[v]
        start = (x1 + w / 2 + 0.04, y1)
        end = (x2 - w / 2 - 0.04, y2)
        ax.annotate(
            "", xy=end, xytext=start,
            arrowprops=dict(arrowstyle="-|>", color=edge_color, lw=2.2, mutation_scale=18, shrinkA=0, shrinkB=0),
        )
        mx, my = (start[0] + end[0]) / 2, (start[1] + end[1]) / 2
        ax.text(mx, my + 0.13, edge_label[(u, v)], color=C_MUTED, fontsize=8.5, ha="center", va="bottom")

    for node, (x, y) in pos.items():
        ax.add_patch(
            FancyBboxPatch(
                (x - w / 2, y - h / 2), w, h,
                boxstyle="round,pad=0.02,rounding_size=0.09",
                fc=C_SURFACE_2, ec=box_edge, lw=2.0,
            )
        )
        ax.text(x, y + 0.08, title[node], color=C_TEXT, fontsize=13, fontweight="bold", ha="center", va="center")
        ax.text(x, y - 0.14, sub[node], color=C_MUTED, fontsize=9, ha="center", va="center")
        if traced:
            if node == "model":
                note = f"retrained without user {uid}" if retrained else "no retrain logged"
            else:
                n = counts["per_user"][node]
                note = f"user {uid}: {n} row{'s' if n != 1 else ''}"
            ax.text(x, y - h / 2 - 0.13, note, color=C_WARN if node == "model" or counts["per_user"].get(node, 1) == 0 else C_BAD,
                    fontsize=9, ha="center", va="top")

    ax.set_xlim(-0.85, 4.25)
    ax.set_ylim(-1.55, 1.45)
    ax.axis("off")

    buf = io.BytesIO()
    fig.savefig(buf, format="png", transparent=True, bbox_inches="tight")
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode()


def page_graph() -> None:
    page_header(
        "Dependency graph",
        "How one user’s data flows into derived features, cached predictions and the trained model. "
        "Pick a deleted user to trace that path.",
    )
    tomb = query("SELECT user_id FROM tombstones ORDER BY user_id")
    ids = [int(x) for x in tomb["user_id"]]
    options: list[int | None] = [None] + ids
    preferred = st.session_state.get("last_deleted_id")
    if preferred not in ids:
        latest = query("SELECT user_id FROM tombstones ORDER BY deleted_at DESC LIMIT 1")
        preferred = int(latest.iloc[0, 0]) if len(latest) else None
    idx = options.index(preferred) if preferred in options else 0

    chosen = st.selectbox(
        "Trace deleted user",
        options,
        index=idx,
        format_func=lambda v: "No user selected" if v is None else f"User {v}",
    )

    counts = {
        "users": scalar("SELECT COUNT(*) FROM users"),
        "features": scalar("SELECT COUNT(*) FROM features"),
        "predictions": scalar("SELECT COUNT(*) FROM predictions"),
        "per_user": {},
    }
    retrained = False
    if chosen is not None:
        counts["per_user"] = {
            "users": scalar("SELECT COUNT(*) FROM users WHERE id=?", (chosen,)),
            "features": scalar("SELECT COUNT(*) FROM features WHERE user_id=?", (chosen,)),
            "predictions": scalar("SELECT COUNT(*) FROM predictions WHERE user_id=?", (chosen,)),
        }
        retrained = (
            scalar(
                "SELECT COUNT(*) FROM deletion_log WHERE user_id=? AND step_name='model_retrained' AND status='ok'",
                (chosen,),
            )
            > 0
        )

    img = draw_graph(counts, chosen, retrained)
    render(
        f'<div class="panel"><img alt="Dependency graph from users to features, predictions and model" '
        f'style="width:100%;display:block" src="data:image/png;base64,{img}"/></div>'
    )

    if chosen is None:
        render(
            '<div class="empty">Select a deleted user to highlight the path their data took and check '
            "that nothing is left behind at each stage.</div>"
        )
        return

    rows = [
        ("users", counts["per_user"]["users"]),
        ("features", counts["per_user"]["features"]),
        ("predictions", counts["per_user"]["predictions"]),
    ]
    df = pd.DataFrame(
        {
            "Layer": [r[0] for r in rows],
            f"Rows for user {chosen}": [r[1] for r in rows],
            "Result": ["Removed" if r[1] == 0 else "Still present" for r in rows],
        }
    )
    render(f'<div class="panel-title" style="margin-top:1.4rem">Rows still referencing user {chosen}</div>')
    render(
        html_table(
            df,
            num_cols=(f"Rows for user {chosen}",),
            fmt={"Result": lambda v: f'<span class="pill {"ok" if v == "Removed" else "bad"}">{esc(v)}</span>'},
        )
    )


def page_deletion() -> None:
    page_header(
        "Deletion center",
        "Delete a user and watch the six pipeline steps run. Every step is read back from the deletion log.",
    )
    st.session_state.setdefault("del_uid", 1)

    def _pick_next():
        df = query("SELECT MIN(id) FROM users")
        if len(df) and pd.notna(df.iloc[0, 0]):
            st.session_state["del_uid"] = int(df.iloc[0, 0])

    form, out = st.columns([2, 3], gap="large")
    with form:
        render('<div class="panel-title">Delete a user</div>')
        uid = st.number_input("User ID", min_value=1, max_value=100000, step=1, key="del_uid",
                              help="The demo dataset holds IDs 1 to 200.")
        go = st.button("Delete user", type="primary", key="del_go")
        st.button("Use lowest remaining ID", key="del_next", on_click=_pick_next)
        remaining = scalar("SELECT COUNT(*) FROM users")
        render(f'<div class="feed-meta" style="margin-top:.6rem">{remaining:,} users remain in the database.</div>')

    animate = False
    if go:
        with st.spinner("Running the deletion pipeline"):
            try:
                result = delete_user(int(uid), db_path=DB_PATH)
            except Exception as exc:  # surface backend errors, never hide them
                result = None
                st.session_state["last_action"] = {"user_id": int(uid), "status": "error", "error": str(exc)}
        if result is not None:
            status = result.get("status")
            st.session_state["last_action"] = {
                "user_id": int(uid),
                "status": status,
                "passed": (result.get("verification") or {}).get("passed"),
            }
            if status == "deleted":
                st.session_state["last_deleted_id"] = int(uid)
                st.session_state["last_comparison"] = {
                    "user_id": int(uid),
                    "replacement_model": result.get("replacement_model"),
                    "verification": result.get("verification"),
                }
                animate = True

    with out:
        action = st.session_state.get("last_action")
        if not action:
            render(
                '<div class="panel"><div class="empty">Choose a user ID and select Delete user. '
                "The pipeline steps will appear here.</div></div>"
            )
            return

        u, status = action["user_id"], action["status"]
        if status == "deleted":
            passed = action.get("passed")
            banner(
                "ok" if passed else "bad",
                f"User {u} deleted",
                "Verification passed. The replacement model matches the reference."
                if passed
                else "Verification failed. Review the Model comparison page.",
            )
        elif status == "already_deleted":
            banner("info", f"User {u} was already deleted",
                   "Nothing changed. Deleting the same user twice is safe.")
        elif status == "user_not_found":
            banner("warn", f"User {u} not found",
                   "No such user exists in the database, so nothing was deleted.")
        else:
            banner("bad", "Deletion failed", action.get("error", "The backend returned an unexpected result."))
            return

        if status == "user_not_found":
            return
        rows = user_steps(u)
        slot = st.empty()
        if animate:
            for i in range(1, len(STEPS) + 1):
                slot.markdown(
                    "\n".join(l.strip() for l in stepper_html(rows, upto=i).splitlines()),
                    unsafe_allow_html=True,
                )
                time.sleep(0.2)
        else:
            slot.markdown(
                "\n".join(l.strip() for l in stepper_html(rows).splitlines()),
                unsafe_allow_html=True,
            )


def _json_default(o):
    if isinstance(o, np.ndarray):
        return o.tolist()
    if isinstance(o, (np.floating, np.integer)):
        return o.item()
    return str(o)


def page_model() -> None:
    page_header(
        "Model comparison",
        "The model before deletion, the replacement trained without the user, and an independent reference.",
    )
    orig = original_params()
    if orig is None:
        banner("warn", "original_model.pkl could not be loaded",
               "Run python train_original.py from the repo root, then reload this page.")
        return
    o_coef, o_int = orig

    cmp_ = st.session_state.get("last_comparison")
    names = FEATURE_NAMES + ["intercept"]

    if not cmp_ or cmp_.get("replacement_model") is None or not cmp_.get("verification"):
        last = query(
            "SELECT user_id, status, timestamp FROM deletion_log WHERE step_name='verification_run' "
            "ORDER BY id DESC LIMIT 1"
        )
        if len(last):
            r = last.iloc[0]
            banner(
                "ok" if str(r["status"]).lower() == "pass" else "bad",
                f"Latest logged verification: {str(r['status']).upper()}",
                f"User {r['user_id']} at {fmt_ts(r['timestamp'])}. Delete a user in this session to see the full "
                "coefficient comparison.",
            )
        else:
            banner("info", "No verification yet",
                   "Delete a user in the Deletion center to produce a replacement model and a verification result.")
        df = pd.DataFrame({"Coefficient": names, "Original": list(o_coef) + [o_int]})
        render('<div class="panel-title">Original model</div>')
        render(html_table(df, num_cols=("Original",), fmt={"Original": lambda v: f"{v:.4f}"}))
        return

    ver = cmp_["verification"]
    rep = cmp_["replacement_model"]
    r_coef, r_int = np.ravel(rep.coef_), float(np.ravel(rep.intercept_)[0])
    ref_coef = np.ravel(ver["reference_coef"])
    ref_int = float(np.ravel(ver["reference_intercept"])[0])
    passed = bool(ver["passed"])

    render(
        f"""
        <div class="banner {'ok' if passed else 'bad'}">
          <div class="verdict">
            <div class="banner-word">{'PASS' if passed else 'FAIL'}</div>
            <div>
              <div class="banner-title">Verification for user {cmp_['user_id']}</div>
              <div class="banner-text">{'The replacement model matches a reference model trained without this user.'
                                         if passed else
                                         'The replacement model does not match the reference model.'}</div>
            </div>
          </div>
        </div>
        """
    )

    orig_all = list(o_coef) + [o_int]
    rep_all = list(r_coef) + [r_int]
    ref_all = list(ref_coef) + [ref_int]
    df = pd.DataFrame(
        {
            "Coefficient": names,
            "Original": orig_all,
            "Replacement": rep_all,
            "Reference": ref_all,
            "Shift from original": [r - o for r, o in zip(rep_all, orig_all)],
            "Gap to reference": [abs(r - f) for r, f in zip(rep_all, ref_all)],
        }
    )
    nums = tuple(df.columns[1:])
    fmts = {c: (lambda v: f"{v:.4f}") for c in nums}
    fmts["Shift from original"] = lambda v: f"{v:+.4f}"
    fmts["Gap to reference"] = lambda v: f"{v:.6f}"
    render(html_table(df, num_cols=nums, fmt=fmts))

    render(
        f'<div class="feed-meta" style="margin-top:.7rem">Largest gap between replacement and reference: '
        f"{df['Gap to reference'].max():.6f}. Original coefficients come from original_model.pkl; replacement and "
        "reference come from the last deletion in this session.</div>"
    )
    with st.expander("Raw verification output"):
        st.code(json.dumps(ver, indent=2, default=_json_default), language="json")


def page_tombstones() -> None:
    page_header(
        "Tombstones",
        "IDs that have been deleted and are permanently blocked from coming back.",
    )
    df = query("SELECT * FROM tombstones ORDER BY user_id")
    n = len(df)
    render(
        f'<div class="panel" style="margin-bottom:1.3rem"><div class="big-count">{n:,}</div>'
        f'<div class="big-count-l">{"user" if n == 1 else "users"} forgotten</div></div>'
    )
    if df.empty:
        render(
            '<div class="empty">No tombstones yet. Delete a user in the Deletion center and their ID will '
            "appear here.</div>"
        )
        return
    df = df.rename(columns={"user_id": "User ID", "deleted_at": "Deleted at"})
    render(html_table(df, num_cols=("User ID",), fmt={"Deleted at": lambda v: esc(fmt_ts(v))}))


def build_user_record(uid, age, balance, n_tx, tenure, risk) -> dict:
    """Single place that defines the record handed to ingest_user()."""
    return {
        "id": int(uid),
        "age": int(age),
        "account_balance": float(balance),
        "num_transactions": int(n_tx),
        "tenure_days": int(tenure),
        "risk_score": float(risk),
    }


def page_reingest() -> None:
    page_header(
        "Re-ingestion test",
        "Try to insert a user. A deleted ID is rejected; an unused ID is accepted.",
    )
    st.session_state.setdefault("re_uid", 1)

    def _set(v: int):
        st.session_state["re_uid"] = int(v)

    last_deleted = st.session_state.get("last_deleted_id")
    if last_deleted is None:
        latest = query("SELECT user_id FROM tombstones ORDER BY deleted_at DESC LIMIT 1")
        last_deleted = int(latest.iloc[0, 0]) if len(latest) else None

    form, out = st.columns([2, 3], gap="large")
    with form:
        render('<div class="panel-title">Insert a user</div>')
        uid = st.number_input("User ID", min_value=1, max_value=1_000_000, step=1, key="re_uid")
        q1, q2 = st.columns(2)
        with q1:
            st.button(
                f"Deleted ID ({last_deleted})" if last_deleted else "Deleted ID",
                disabled=last_deleted is None,
                on_click=_set, args=(last_deleted or 1,), key="re_q1",
            )
        with q2:
            st.button("Fresh ID (5000)", on_click=_set, args=(5000,), key="re_q2")

        with st.expander("Record details"):
            age = st.number_input("Age", 18, 100, 35)
            balance = st.number_input("Account balance", 0.0, 10_000_000.0, 5000.0, step=100.0)
            n_tx = st.number_input("Number of transactions", 1, 100_000, 40)
            tenure = st.number_input("Tenure (days)", 1, 20_000, 700)
            risk = st.number_input("Risk score", 0.0, 100.0, 50.0)
        go = st.button("Insert user", type="primary", key="re_go")

    with out:
        if go:
            conn = get_connection(DB_PATH)
            try:
                outcome = ingest_user(conn, build_user_record(uid, age, balance, n_tx, tenure, risk))
                try:
                    conn.commit()
                except Exception:
                    pass
            except Exception as exc:
                outcome = None
                banner("bad", "Insert failed", str(exc))
            finally:
                conn.close()
            if outcome == "blocked":
                banner("bad", f"User {int(uid)} blocked",
                       "This ID is tombstoned or already exists. The rejection was logged.")
            elif outcome == "accepted":
                banner("ok", f"User {int(uid)} accepted", "This ID was unused, so the record was inserted.")
            elif outcome is not None:
                banner("info", f"Result: {outcome}")
        else:
            render(
                '<div class="panel"><div class="empty">Insert a deleted ID to see it blocked, then a fresh ID '
                "to see it accepted. The result appears here.</div></div>"
            )

        blocked = query(
            "SELECT user_id, timestamp FROM deletion_log WHERE step_name='reingestion_blocked' "
            "ORDER BY id DESC LIMIT 5"
        )
        render('<div class="panel-title" style="margin-top:1.4rem">Recent blocked attempts</div>')
        if blocked.empty:
            render('<div class="empty">No blocked attempts yet.</div>')
        else:
            blocked = blocked.rename(columns={"user_id": "User ID", "timestamp": "Time"})
            render(html_table(blocked, num_cols=("User ID",), fmt={"Time": lambda v: esc(fmt_ts(v))}))


# ──────────────────────────────────────────────────────────────────────────
# App shell
# ──────────────────────────────────────────────────────────────────────────
def main() -> None:
    render(CSS)
    db_ok, model_ok = system_health()

    with st.sidebar:
        render(
            """
            <div class="brand"><div class="brand-mark">F</div><div class="brand-name">ForgetGraph</div></div>
            <div class="brand-tag">Prove the deletion. Don’t just claim it.</div>
            """
        )
        page = st.radio("Navigate", PAGES, label_visibility="collapsed")
        healthy = db_ok and model_ok
        detail = (
            "Database and model file found"
            if healthy
            else ("Database unreachable" if not db_ok else "original_model.pkl missing")
        )
        color = C_OK if healthy else C_BAD
        render(
            f'<div class="health"><span class="dot" style="background:{color}"></span>'
            f'<div><div style="font-weight:600">{"System healthy" if healthy else "Needs attention"}</div>'
            f'<div class="feed-meta">{detail}</div></div></div>'
        )

    if not db_ok:
        banner(
            "bad",
            "The database is not set up",
            "Run python -m forgetgraph.schema, then python train_original.py, and reload this page.",
        )
        st.stop()

    {
        "Overview": page_overview,
        "Dependency graph": page_graph,
        "Deletion center": page_deletion,
        "Model comparison": page_model,
        "Tombstones": page_tombstones,
        "Re-ingestion test": page_reingest,
    }[page]()


main()
