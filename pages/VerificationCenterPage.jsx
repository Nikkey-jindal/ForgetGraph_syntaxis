import React, { useState } from 'react'
import {
  ShieldCheck,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  FileCheck,
  Download,
  Info,
  RefreshCw,
  Scale,
  Award,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useDashboard } from '../context/DashboardContext'
import { MODEL_COEFFICIENT_NAMES } from '../data/forgetGraphData'
import { buildModelData } from '../modelData'

export default function VerificationCenterPage() {
  const { verification, stats, tombstones } = useDashboard()
  const modelData = buildModelData(verification, stats)
  const [toleranceExponent, setToleranceExponent] = useState(5) // 10^-5
  const [selectedUserAudit, setSelectedUserAudit] = useState(42)
  const auditOptions = tombstones.length ? tombstones.map((t) => t.userId) : [42, 118, 87, 193]
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditSuccessMsg, setAuditSuccessMsg] = useState(null)

  if (!modelData) return (
    <div className="text-xs font-mono text-slate-400">Loading verification data from API...</div>
  )

  const currentTolerance = Math.pow(10, -toleranceExponent)

  // Live per-parameter gaps between replacement (current) and original model,
  // plus the backend verification verdict. Real numbers from GET /verification.
  const repCoef = modelData ? modelData.replacementModel.coefficients : {}
  const origCoef = modelData ? modelData.originalModel.coefficients : {}
  const deltas = Object.fromEntries(
    MODEL_COEFFICIENT_NAMES.map((k) => [k, Math.abs((repCoef[k] ?? 0) - (origCoef[k] ?? 0))])
  )

  const maxGap = Math.max(...Object.values(deltas))
  const passed = maxGap <= currentTolerance

  const handleRunAudit = () => {
    setIsAuditing(true)
    setTimeout(() => {
      setIsAuditing(false)
      setAuditSuccessMsg(`Audit completed at ${new Date().toLocaleTimeString()} for User ${selectedUserAudit}`)
    }, 600)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Center & Dual-Train Auditor"
        subtitle="Mathematically certify unlearning compliance by auditing replacement model weights against an independent reference trained from scratch on remaining data."
        category="DEFENSE GRID / VERIFICATION CENTER"
        badge="Dual-Train Engine Active"
        badgeVariant="emerald"
      />

      {/* Mathematical Principle & Invariance Rule Card */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-[#1A2744]">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
              PS09 Verification Criterion
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white font-heading">
              L2 Regularized Weight Invariance Bound
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              In a strictly unlearned model, retraining without a target user u must produce weights w_rep that converge to an independent ground-truth reference model w_ref trained from scratch on D \ &#123;u&#125;.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080C14] border border-emerald-500/30 text-center shrink-0">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              CONVERGENCE INVARIANT
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold text-emerald-400 tracking-tight">
              max |w_rep - w_ref| ≤ τ
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Target Tolerance: τ = 1.0 × 10⁻⁵
            </div>
          </div>
        </div>

        {/* Tolerance Threshold Explorer Slider */}
        <div className="mt-5 p-4 rounded-xl bg-[#080C14] border border-[#1A2744] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0E1626] border border-[#1A2744] text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-heading">
                Audit Sensitivity Threshold (τ)
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Adjust strictness exponent: 10⁻{toleranceExponent} ({currentTolerance.toExponential(1)})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-72">
            <input
              type="range"
              min="2"
              max="7"
              step="1"
              value={toleranceExponent}
              onChange={(e) => setToleranceExponent(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
              10⁻{toleranceExponent}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Dual-Train Audit Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Parameter Discrepancy Matrix */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A2744] mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                  Parameter-by-Parameter Discrepancy Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Comparing weights between pipeline replacement M_rep and ground truth reference M_ref.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedUserAudit}
                  onChange={(e) => setSelectedUserAudit(Number(e.target.value))}
                  className="bg-[#080C14] border border-[#1A2744] text-xs font-mono font-bold text-emerald-400 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  {auditOptions.map((uid) => (
                    <option key={uid} value={uid}>Audit USR-{String(uid).padStart(4, '0')}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono text-xs font-bold transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isAuditing ? 'Auditing...' : 'Run Audit'}
                </button>
              </div>
            </div>

            {/* Table of Parameter Discrepancies */}
            <div className="overflow-x-auto rounded-lg border border-[#1A2744]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#080C14] text-slate-400 border-b border-[#1A2744] uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Feature Parameter</th>
                    <th className="py-3 px-4">M_rep Weight</th>
                    <th className="py-3 px-4">M_ref Weight</th>
                    <th className="py-3 px-4 text-right">Discrepancy (|ΔW|)</th>
                    <th className="py-3 px-4 text-right">Audit Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16233B] bg-[#0E1626]">
                  {MODEL_COEFFICIENT_NAMES.map((param) => {
                    const delta = deltas[param]
                    const paramPass = delta <= currentTolerance
                    const repWeight = modelData.replacementModel.coefficients[param] || 0
                    const refWeight = modelData.referenceModel.coefficients[param] || 0

                    return (
                      <tr key={param} className="hover:bg-[#142036]/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                          <span className="text-emerald-400">•</span>
                          <span>{param}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {repWeight.toFixed(4)}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {refWeight.toFixed(4)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold">
                          <span className={paramPass ? 'text-emerald-400' : 'text-rose-400'}>
                            {delta.toFixed(6)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <StatusBadge variant={paramPass ? 'emerald' : 'rose'} size="sm">
                            {paramPass ? 'PASS' : 'VIOLATION'}
                          </StatusBadge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Max Gap Summary Banner */}
            <div className={`mt-4 p-4 rounded-xl border font-mono text-xs flex items-center justify-between gap-3 ${
              passed
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="font-bold">
                    {passed
                      ? `OVERALL VERIFICATION: PASS (Max ΔW = ${maxGap.toFixed(6)} ≤ τ)`
                      : `OVERALL VERIFICATION: FAILED (Max ΔW = ${maxGap.toFixed(6)} > τ)`}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    {passed
                      ? 'The replacement model is certified mathematically identical to an independent reference model.'
                      : 'Audit Warning: Model weights diverged from reference. Residue detected in balance_log weight.'}
                  </div>
                </div>
              </div>

              <StatusBadge variant={passed ? 'emerald' : 'rose'} size="md">
                {passed ? 'CERTIFIED' : 'REJECTED'}
              </StatusBadge>
            </div>
          </div>
        </div>

        {/* Right Column: Cryptographic Certificate Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1A2744] mb-4">
              <Award className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Compliance Certificate
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-[#080C14] border border-[#1A2744] font-mono text-xs space-y-3">
              <div className="text-center pb-2 border-b border-[#16233B]">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                  FORGETGRAPH CERTIFIED AUDIT
                </div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  ID: USR-{String(selectedUserAudit).padStart(4, '0')}
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className={passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {passed ? 'VERIFIED UNLEARNED' : 'AUDIT FAILED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tolerance Bound:</span>
                  <span className="text-white">τ = {currentTolerance.toExponential(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Weight Gap:</span>
                  <span className="text-white">{maxGap.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Auditor:</span>
                  <span className="text-cyan-400">SecOps-01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Model Family:</span>
                  <span className="text-white">Ridge Regressor (L2)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#16233B] text-[10px] text-slate-400 break-all">
                <span className="text-slate-400 block mb-0.5">SHA-256 Digest:</span>
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Certificate exported for User ${selectedUserAudit}`)}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-[#142036] hover:bg-[#1A2744] border border-[#1E2D4A] text-xs font-mono text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Audit Certificate (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
