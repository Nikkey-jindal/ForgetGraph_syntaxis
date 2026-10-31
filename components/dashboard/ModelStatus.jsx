import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Scale, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import { MODEL_COEFFICIENT_NAMES } from '../../data/forgetGraphData'
import StatusBadge from '../common/StatusBadge'

export default function ModelStatus({ modelData, onOpenVerificationModal }) {
  const [selectedParam, setSelectedParam] = useState('balance_log')
  const { originalModel, replacementModel, referenceModel, tolerance, maxGap, verdict } = modelData

  return (
    <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A2744]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading">
                Tri-Model Verification Matrix
              </h2>
              <StatusBadge
                variant={verdict === 'PASS' ? 'emerald' : 'rose'}
                size="sm"
                dot
              >
                {verdict}: ΔW &lt; 10⁻⁵
              </StatusBadge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verifying that replacement model weights match an independent reference model trained without deleted data.
            </p>
          </div>

          <Link
            to="/model-comparison"
            className="text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Weight Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Model Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
          {/* Original Model */}
          <div className="p-3 rounded-lg bg-[#080C14] border border-[#1A2744]">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Original Model</span>
              <span className="text-slate-400">M_orig</span>
            </div>
            <div className="text-xs font-bold text-white truncate mb-1 font-heading">
              Baseline Ridge
            </div>
            <div className="text-[11px] text-slate-400">
              {originalModel.trainedOn}
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-400 bg-[#0E1626] px-2 py-0.5 rounded border border-[#1A2744]">
              Archived Baseline
            </div>
          </div>

          {/* Replacement Model */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-1">
              <span>Replacement</span>
              <span className="text-emerald-400">M_rep</span>
            </div>
            <div className="text-xs font-bold text-emerald-200 truncate mb-1 font-heading">
              Pipeline Retrained
            </div>
            <div className="text-[11px] text-emerald-300/80">
              {replacementModel.trainedOn}
            </div>
            <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
              Active Serving
            </div>
          </div>

          {/* Ground-Truth Reference Model */}
          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-1">
              <span>Reference Truth</span>
              <span className="text-cyan-400">M_ref</span>
            </div>
            <div className="text-xs font-bold text-cyan-200 truncate mb-1 font-heading">
              Scratch Retrained
            </div>
            <div className="text-[11px] text-cyan-300/80">
              Independent ground truth
            </div>
            <div className="mt-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
              Audit Verified
            </div>
          </div>
        </div>

        {/* Interactive Feature Weight Inspector */}
        <div className="p-3.5 rounded-lg bg-[#080C14] border border-[#1A2744]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-slate-400">Parameter Discrepancy Inspector:</span>
            <select
              value={selectedParam}
              onChange={(e) => setSelectedParam(e.target.value)}
              className="bg-[#0E1626] border border-[#1A2744] text-xs font-mono font-bold text-emerald-400 rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
            >
              {MODEL_COEFFICIENT_NAMES.map((param) => (
                <option key={param} value={param}>
                  {param}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-[#16233B]">
            <div className="bg-[#0E1626] p-2 rounded border border-[#1A2744]">
              <span className="text-[10px] text-slate-400 block">ORIGINAL (M_orig)</span>
              <span className="text-slate-300 font-bold">
                {originalModel.coefficients[selectedParam]?.toFixed(4)}
              </span>
            </div>
            <div className="bg-[#0E1626] p-2 rounded border border-[#1A2744]">
              <span className="text-[10px] text-slate-400 block">REPLACEMENT (M_rep)</span>
              <span className="text-emerald-400 font-bold">
                {replacementModel.coefficients[selectedParam]?.toFixed(4)}
              </span>
            </div>
            <div className="bg-[#0E1626] p-2 rounded border border-[#1A2744]">
              <span className="text-[10px] text-slate-400 block">REFERENCE (M_ref)</span>
              <span className="text-cyan-400 font-bold">
                {referenceModel.coefficients[selectedParam]?.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Gap Audit Verdict */}
      <div className="mt-3 pt-3 border-t border-[#16233B] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Max Weight Delta:</span>
          <span className="text-emerald-400 font-bold">{maxGap.toFixed(6)}</span>
          <span className="text-slate-400">(Limit: {tolerance})</span>
        </div>
        <StatusBadge variant={verdict === 'PASS' ? 'emerald' : 'rose'} size="sm">
          {verdict === 'PASS' ? 'L2 Invariance Certified' : 'Residue Flagged'}
        </StatusBadge>
      </div>
    </div>
  )
}
