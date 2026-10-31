import React, { useState } from 'react'
import {
  Cpu,
  Scale,
  Brain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Code,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useDashboard } from '../context/DashboardContext'
import { MODEL_COEFFICIENT_NAMES } from '../data/forgetGraphData'

export default function ModelComparisonPage() {
  const { modelData } = useDashboard()
  const { originalModel, replacementModel, referenceModel, tolerance, maxGap, verdict } = modelData
  const [showRawJson, setShowRawJson] = useState(false)

  // Construct coefficient table data
  const rows = MODEL_COEFFICIENT_NAMES.map((name) => {
    const orig = originalModel.coefficients[name] ?? 0
    const rep = replacementModel.coefficients[name] ?? 0
    const ref = referenceModel.coefficients[name] ?? 0
    const shift = rep - orig
    const gap = Math.abs(rep - ref)

    return {
      name,
      orig,
      rep,
      ref,
      shift,
      gap,
    }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Model Comparison & Weight Invariance"
        subtitle="Compare the baseline model before deletion, the replacement model retrained without the user, and an independent ground-truth reference model."
        category="DEFENSE GRID / MODEL COMPARISON"
        badge="Tri-Model Invariance Active"
        badgeVariant="cyan"
      />

      {/* Tri-Model Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model 1: Original Baseline */}
        <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Model 1 of 3</span>
            <span className="text-slate-400">M_orig</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white font-heading">
            {originalModel.name}
          </h3>
          <div className="text-xs font-mono text-slate-300 mt-1">
            {originalModel.trainedOn}
          </div>
          <div className="mt-4 pt-3 border-t border-[#16233B] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">R² Quality:</span>
            <span className="text-white font-bold">{originalModel.r2Score}</span>
            <StatusBadge variant="neutral" size="sm">
              Archived Baseline
            </StatusBadge>
          </div>
        </div>

        {/* Model 2: Replacement Model */}
        <div className="rounded-xl bg-[#0E1626] border border-emerald-500/30 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
            <span>Model 2 of 3</span>
            <span className="text-emerald-400 font-bold">M_rep</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white font-heading">
            {replacementModel.name}
          </h3>
          <div className="text-xs font-mono text-emerald-300 mt-1">
            {replacementModel.trainedOn}
          </div>
          <div className="mt-4 pt-3 border-t border-[#16233B] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">R² Quality:</span>
            <span className="text-emerald-400 font-bold">{replacementModel.r2Score}</span>
            <StatusBadge variant="emerald" size="sm">
              Serving Active
            </StatusBadge>
          </div>
        </div>

        {/* Model 3: Ground-Truth Reference Model */}
        <div className="rounded-xl bg-[#0E1626] border border-cyan-500/30 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
            <span>Model 3 of 3</span>
            <span className="text-cyan-400 font-bold">M_ref</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white font-heading">
            {referenceModel.name}
          </h3>
          <div className="text-xs font-mono text-cyan-300 mt-1">
            {referenceModel.trainedOn}
          </div>
          <div className="mt-4 pt-3 border-t border-[#16233B] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">R² Quality:</span>
            <span className="text-cyan-400 font-bold">{referenceModel.r2Score}</span>
            <StatusBadge variant="cyan" size="sm">
              Ground Truth
            </StatusBadge>
          </div>
        </div>
      </div>

      {/* Main Full-Width Coefficient Comparison Table */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A2744] mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white font-heading">
              Complete Coefficient Comparison Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact parameter shifts and ground-truth divergence across all regularized features.
            </p>
          </div>

          <StatusBadge
            variant={verdict === 'PASS' ? 'emerald' : 'rose'}
            size="sm"
            dot
          >
            {verdict === 'PASS' ? 'L2 Invariance Certified' : 'Divergence Flagged'}
          </StatusBadge>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-lg border border-[#1A2744]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080C14] text-slate-400 border-b border-[#1A2744] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Coefficient Name</th>
                <th className="py-3 px-4 text-right">Original (M_orig)</th>
                <th className="py-3 px-4 text-right">Replacement (M_rep)</th>
                <th className="py-3 px-4 text-right">Reference (M_ref)</th>
                <th className="py-3 px-4 text-right">Shift from Original</th>
                <th className="py-3 px-4 text-right">Gap to Reference</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16233B] bg-[#0E1626]">
              {rows.map((r) => {
                const isCompliant = r.gap <= tolerance
                return (
                  <tr key={r.name} className="hover:bg-[#142036]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{r.name}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {r.orig.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                      {r.rep.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right text-cyan-400 font-bold">
                      {r.ref.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-300">
                      {r.shift >= 0 ? `+${r.shift.toFixed(4)}` : r.shift.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      <span className={isCompliant ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                        {r.gap.toFixed(6)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge variant={isCompliant ? 'emerald' : 'rose'} size="sm">
                        {isCompliant ? 'PASS' : 'FAIL'}
                      </StatusBadge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Audit Summary */}
        <div className="mt-4 pt-3 border-t border-[#16233B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div>
            Largest gap between replacement and reference:{' '}
            <span className="text-emerald-400 font-bold">{maxGap.toFixed(6)}</span>{' '}
            (Tolerance: {tolerance})
          </div>
          <div className="text-[11px] text-slate-400">
            Original parameters from original_model.pkl · Ridge (α = 1.0)
          </div>
        </div>
      </div>

      {/* Raw Verification Output Accordion */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRawJson(!showRawJson)}
          className="w-full p-4 flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white hover:bg-[#142036] transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Raw Verification Payload Output (JSON)</span>
          </div>
          {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRawJson && (
          <div className="p-4 bg-[#080C14] border-t border-[#1A2744]">
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-4 rounded-lg bg-[#05080E] border border-[#16233B]">
{JSON.stringify(
  {
    protocol: 'FORGETGRAPH-PS09',
    timestamp: new Date().toISOString(),
    verdict: verdict,
    tolerance: tolerance,
    maxGap: maxGap,
    models: {
      original: originalModel,
      replacement: replacementModel,
      reference: referenceModel,
    },
    invarianceCheck: {
      passed: verdict === 'PASS',
      criterion: 'max_j |w_rep - w_ref| <= tau',
    },
  },
  null,
  2
)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
