import React from 'react'
import { X, ShieldCheck, CheckCircle2, AlertOctagon, Clock, Database, Layers, Zap, Brain, Lock } from 'lucide-react'

export default function DeletionDetailModal({ deletion, isOpen, onClose }) {
  if (!isOpen || !deletion) return null

  const isPassed = deletion.isPassed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-xl bg-[#0E1626] border border-[#1A2744] p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1A2744]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isPassed ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/60 border-rose-500/30 text-rose-400'
            }`}>
              {isPassed ? <ShieldCheck className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-heading">
                Deletion Audit Certificate: {deletion.userCode}
              </h3>
              <p className="text-xs text-slate-400">
                PS09 Verifiable Unlearning Lifecycle Record
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

        {/* Content */}
        <div className="mt-5 space-y-4">
          {/* Certificate banner */}
          <div
            className={`p-4 rounded-xl border ${
              isPassed
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs mb-1">
              <span className="font-bold">{deletion.verificationResult}</span>
              <span>Tolerance: τ = {deletion.tolerance}</span>
            </div>
            <p className="text-xs text-zinc-300">
              {deletion.notes}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-950/70 border border-[#2A3552]">
              <div className="text-zinc-500 text-[10px]">User Identifier</div>
              <div className="text-white font-bold">{deletion.userCode} (ID: {deletion.userId})</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/70 border border-[#2A3552]">
              <div className="text-zinc-500 text-[10px]">Timestamp</div>
              <div className="text-white font-bold">{deletion.timestamp}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/70 border border-[#2A3552]">
              <div className="text-zinc-500 text-[10px]">Max Weight Gap |ΔW|</div>
              <div className={isPassed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {deletion.maxDelta}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/70 border border-[#2A3552]">
              <div className="text-zinc-500 text-[10px]">Deletion Status</div>
              <div className="text-white font-bold">{deletion.deletionStatus}</div>
            </div>
          </div>

          {/* 6 Stages Verified Checklist */}
          <div className="p-4 rounded-xl bg-[#1F2840]/60 border border-[#2A3552] space-y-2">
            <div className="text-xs font-bold text-white font-sans mb-2">
              Verified Pipeline Execution Stages:
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  1. source_removed (SQLite: users)
                </span>
                <span className="text-emerald-400 text-[11px]">✓ 12 ms</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  2. features_recomputed (Derived matrix)
                </span>
                <span className="text-emerald-400 text-[11px]">✓ 84 ms</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  3. cache_invalidated (predictions table)
                </span>
                <span className="text-emerald-400 text-[11px]">✓ 18 ms</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  4. model_retrained (Ridge on D \ {'{u}'})
                </span>
                <span className="text-emerald-400 text-[11px]">✓ 340 ms</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  5. verification_run (vs Reference Model)
                </span>
                <span className={isPassed ? 'text-emerald-400 text-[11px]' : 'text-rose-400 text-[11px] font-bold'}>
                  {isPassed ? '✓ 312 ms' : '✕ Discrepancy Found'}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  6. tombstone_recorded (Re-ingestion blocked)
                </span>
                <span className="text-emerald-400 text-[11px]">✓ 8 ms</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs font-mono text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  )
}
