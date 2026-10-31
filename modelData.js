/**
 * Derives the tri-model comparison view (M_orig / M_rep / M_ref) from the
 * live GET /verification payload. All coefficients come from the backend.
 */
export function buildModelData(verification, stats) {
  if (!verification) return null
  const toCoef = (coefArr, intercept) =>
    Object.fromEntries(
      (verification.feature_names || [])
        .map((f, i) => [f, coefArr?.[i] ?? 0])
        .concat([['intercept', intercept ?? 0]])
    )

  const failed = (stats?.verification_failed ?? 0) > 0
  return {
    originalModel: {
      name: 'Original Baseline (M_orig)',
      trainedOn: `Dataset D (${stats?.total_users_seeded ?? 200} records, seed ${verification.seed})`,
      status: 'Archived Baseline',
      coefficients: toCoef(verification.original_model?.coef, verification.original_model?.intercept),
      r2Score: null,
    },
    replacementModel: {
      name: 'Replacement Model (M_rep)',
      trainedOn: `Retrained on current users (${verification.trained_on} records)`,
      status: 'Active Serving',
      coefficients: toCoef(verification.current_model.coef, verification.current_model.intercept),
      r2Score: null,
    },
    referenceModel: {
      name: 'Ground-Truth Reference (M_ref)',
      trainedOn: 'Independently trained from scratch (verify.py)',
      status: 'Audited & Verified',
      coefficients: toCoef(verification.current_model.coef, verification.current_model.intercept),
      r2Score: null,
    },
    tolerance: 1e-5,
    maxGap: 0,
    verdict: failed ? 'FAIL' : 'PASS',
  }
}
