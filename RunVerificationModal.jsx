import React, { useState } from 'react'
import { X, ShieldCheck, Scale, CheckCircle2, AlertOctagon, RefreshCw, Sliders, ArrowRight } from 'lucide-react'
import { INITIAL_MODEL_STATUS, MODEL_COEFFICIENT_NAMES } from '../../data/forgetGraphData'

export default function RunVerificationModal({ isOpen, onClose }) {
  const [tolerance, setTolerance] = useState(0.00001)
  const [injectNoise, setInjectNoise] = useState(false)
  const [isAuditing, setIsAuditing] = useState(false)
  const [lastAuditedAt, setLastAuditedAt] = useState('Just now')

  if (!isOpen) return null

  const handleRunAudit = () => {
    setIsAuditing(true)
    setTimeout(() => {
      setIsAuditing(false)
      setLastAuditedAt('Just now')
    }, 600)
  }

  // Base coefficients
  const orig = INITIAL_MODEL_STATUS.originalModel.coefficients
  const ref = INITIAL_MODEL_STATUS.referenceModel.coefficients

  // Injected discrepancy on balance_log if noise enabled
  const rep = {
    ...INITIAL_MODEL_STATUS.replacementModel.coefficients,
    balance_log: injectNoise
      ? INITIAL_MODEL_STATUS.replacementModel.coefficients.balance_log + 0.04821
      : INITIAL_MODEL_STATUS.replacementModel.coefficients.balance_log,
  }

  // Compute gaps
  let maxGap = 0
  MODEL_COEFFICIENT_NAMES.forEach((param) => {
    const gap = Math.abs(rep[param] - ref[param])
    if (gap > maxGap) maxGap = gap
  })

  const isPassed = maxGap <= tolerance

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl rounded-xl bg-[#0E1626] border border-[#1A2744] p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1A2744]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-heading">
                Dual-Train Verification Audit Engine
              </h3>
              <p className="text-xs text-slate-400">
                Mathematically proving zero data retention residue across all retrained model weights.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#142036] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verdict Banner */}
        <div className="mt-5">
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isPassed
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                {isPassed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertOctagon className="w-6 h-6 text-rose-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white font-sans">
                    {isPassed ? 'VERIFICATION PASSED' : 'VERIFICATION REJECTED: MEMORIZATION DETECTED'}
                  </h4>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-900 font-bold">
                    {isPassed ? 'CERTIFIED' : 'UNLEARNING FAILURE'}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {isPassed
                    ? 'The replacement model coefficients exactly match an independent reference model trained on D \\ {u}.'
                    : 'Discrepancy exceeds tolerance threshold. Target customer residue remains encoded in feature weights.'}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[11px] font-mono text-zinc-400">Max Delta |ΔW|</div>
              <div className={`text-xl font-bold font-mono ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {maxGap.toFixed(6)}
              </div>
            </div>
          </div>
        </div>

        {/* Math & Controls bar */}
        <div className="mt-4 p-3.5 rounded-xl bg-zinc-950/70 border border-[#2A3552] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-zinc-300">
            <span className="text-indigo-400 font-bold">Verification Invariant:</span>
            <span>max_i |w_(rep, i) - w_(ref, i)| ≤ τ (1.0e-5)</span>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={injectNoise}
                onChange={(e) => setInjectNoise(e.target.checked)}
                className="rounded border-zinc-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-[11px] font-mono text-amber-300">Inject Synthetic Residue</span>
            </label>

            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>Re-Run Audit</span>
            </button>
          </div>
        </div>

        {/* Coefficient Matrix Table */}
        <div className="mt-4 rounded-xl border border-[#2A3552] overflow-hidden bg-zinc-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1F2840] text-zinc-400 font-mono text-[11px] border-b border-[#2A3552]">
              <tr>
                <th className="px-4 py-2.5">Model Parameter</th>
                <th className="px-4 py-2.5 text-right">Original (M_orig)</th>
                <th className="px-4 py-2.5 text-right">Replacement (M_rep)</th>
                <th className="px-4 py-2.5 text-right">Reference (M_ref)</th>
                <th className="px-4 py-2.5 text-right">Shift from Orig</th>
                <th className="px-4 py-2.5 text-right">Gap to Ref (|ΔW|)</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3552]/60 font-mono">
              {MODEL_COEFFICIENT_NAMES.map((param) => {
                const oVal = orig[param]
                const rVal = rep[param]
                const refVal = ref[param]
                const shift = rVal - oVal
                const gap = Math.abs(rVal - refVal)
                const isViolation = gap > tolerance

                return (
                  <tr
                    key={param}
                    className={`hover:bg-[#1F2840]/40 transition-colors ${
                      isViolation ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isViolation ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                      {param}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-400">{oVal.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right text-indigo-300 font-medium">{rVal.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right text-emerald-300 font-medium">{refVal.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right text-zinc-300">{shift >= 0 ? `+${shift.toFixed(4)}` : shift.toFixed(4)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${isViolation ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {gap.toFixed(6)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isViolation
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {isViolation ? 'VIOLATION' : 'VALID'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#2A3552] text-xs">
          <span className="text-zinc-500 font-mono">
            Audited via Scikit-Learn L2 Ridge Evaluator · {lastAuditedAt}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl font-medium text-xs font-mono text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  )
}
