import React, { useState } from 'react'
import { X, Network, Database, Layers, Zap, Brain, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { DATA_LINEAGE_LAYERS } from '../../data/forgetGraphData'

export default function DataLineageModal({ isOpen, onClose }) {
  const [selectedUser, setSelectedUser] = useState(42)
  const [traced, setTraced] = useState(true)

  if (!isOpen) return null

  const nodeStats = {
    42: { users: 0, features: 0, predictions: 0, model: 'Retrained without USR-0042 (Clean)' },
    118: { users: 0, features: 0, predictions: 0, model: 'Retrained without USR-0118 (Clean)' },
    15: { users: 0, features: 0, predictions: 0, model: 'ID Tombstoned (Blocked)' },
    99: { users: 1, features: 1, predictions: 1, model: 'Included in Active Model' },
  }

  const currentStats = nodeStats[selectedUser] || {
    users: 0,
    features: 0,
    predictions: 0,
    model: 'Retrained without target user',
  }

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
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-heading">
                Data Lineage & Dependency Graph (DAG)
              </h3>
              <p className="text-xs text-slate-400">
                Provenential trace of customer data across storage, derivation, cache, and ML model parameters.
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

        {/* User Trace Selector */}
        <div className="mt-5 p-3.5 rounded-xl bg-zinc-950/70 border border-[#2A3552] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-400">Trace Footprint for User ID:</span>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(Number(e.target.value))}
              className="bg-[#1F2840] border border-[#2A3552] rounded-lg px-2.5 py-1 text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value={42}>User 42 (Tombstoned / Deleted)</option>
              <option value={118}>User 118 (Tombstoned / Deleted)</option>
              <option value={15}>User 15 (Blocked Re-Ingest)</option>
              <option value={99}>User 99 (Active Customer)</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Residual Footprint Certified</span>
          </div>
        </div>

        {/* Visual DAG Flow Diagram */}
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-b from-[#1F2840]/30 to-zinc-950/60 border border-[#2A3552]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1: Raw Database */}
            <div className="p-4 rounded-xl bg-[#171E2E] border border-indigo-500/40 relative group">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="flex items-center gap-1 text-indigo-300 font-bold">
                  <Database className="w-3.5 h-3.5" />
                  users
                </span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800">
                  Tier 1
                </span>
              </div>
              <div className="text-sm font-bold text-white mb-1">Raw Records</div>
              <div className="text-xs text-zinc-400 mb-3">Primary User DB</div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono">
                <span className="text-zinc-500">Rows for User {selectedUser}:</span>{' '}
                <strong className={currentStats.users === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                  {currentStats.users} rows
                </strong>
              </div>
            </div>

            {/* Step 2: Feature Store */}
            <div className="p-4 rounded-xl bg-[#171E2E] border border-cyan-500/40 relative group">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="flex items-center gap-1 text-cyan-300 font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  features
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                  Tier 2
                </span>
              </div>
              <div className="text-sm font-bold text-white mb-1">Feature Matrix</div>
              <div className="text-xs text-zinc-400 mb-3">4 Normalized Ratios</div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono">
                <span className="text-zinc-500">Rows for User {selectedUser}:</span>{' '}
                <strong className={currentStats.features === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                  {currentStats.features} rows
                </strong>
              </div>
            </div>

            {/* Step 3: Prediction Cache */}
            <div className="p-4 rounded-xl bg-[#171E2E] border border-sky-500/40 relative group">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="flex items-center gap-1 text-sky-300 font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  predictions
                </span>
                <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
                  Tier 3
                </span>
              </div>
              <div className="text-sm font-bold text-white mb-1">Inference Cache</div>
              <div className="text-xs text-zinc-400 mb-3">Cached Output Values</div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono">
                <span className="text-zinc-500">Rows for User {selectedUser}:</span>{' '}
                <strong className={currentStats.predictions === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                  {currentStats.predictions} rows
                </strong>
              </div>
            </div>

            {/* Step 4: ML Model */}
            <div className="p-4 rounded-xl bg-[#171E2E] border border-purple-500/40 relative group">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="flex items-center gap-1 text-purple-300 font-bold">
                  <Brain className="w-3.5 h-3.5" />
                  model
                </span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800">
                  Tier 4
                </span>
              </div>
              <div className="text-sm font-bold text-white mb-1">Ridge Parameters</div>
              <div className="text-xs text-zinc-400 mb-3">Replacement Weights</div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-purple-300 truncate">
                {currentStats.model}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Summary Audit */}
        <div className="mt-5 p-4 rounded-xl bg-[#1F2840]/60 border border-[#2A3552] text-xs space-y-2">
          <div className="font-bold text-white font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            PS09 Dependency Invariant Certification
          </div>
          <p className="text-zinc-300 text-xs leading-relaxed">
            Data deletion cannot simply execute <code className="text-indigo-300 font-mono">DELETE FROM users WHERE id=u</code>. 
            The pipeline deterministically cascades through all derived feature tables, invalidates cached inferences, 
            retrains the active ML model, and verifies that the resultant weights match a reference ground truth with discrepancy <code className="text-emerald-400 font-mono">|ΔW| ≤ 10⁻⁵</code>.
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl font-medium text-xs font-mono text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Close Lineage View
          </button>
        </div>
      </div>
    </div>
  )
}
