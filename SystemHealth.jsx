import React from 'react'
import { Database, Layers, Zap, Brain, ShieldCheck, RefreshCw } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function SystemHealth({ systems, onRefresh }) {
  const getIcon = (id) => {
    switch (id) {
      case 'raw-db':
        return Database
      case 'feature-store':
        return Layers
      case 'prediction-cache':
        return Zap
      case 'ml-model':
        return Brain
      case 'verification-engine':
        return ShieldCheck
      default:
        return Database
    }
  }

  return (
    <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#1A2744]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading">
              Subsystem Health & Tier Telemetry
            </h2>
            <StatusBadge variant="emerald" size="sm" dot>
              All 5 Tiers Operational
            </StatusBadge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time verification of data tiers: from SQLite source persistence to retrained model weights.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#142036] hover:bg-[#1A2744] border border-[#1E2D4A] px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sync Diagnostics</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {systems.map((sys) => {
          const Icon = getIcon(sys.id)
          return (
            <div
              key={sys.id}
              className="rounded-xl bg-[#080C14] border border-[#1A2744] p-4 flex flex-col justify-between hover:border-emerald-500/30 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="p-2 rounded-lg bg-[#0E1626] border border-[#1A2744] text-emerald-400 group-hover:text-cyan-300 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <StatusBadge variant={sys.badgeVariant || 'emerald'} size="sm">
                    {sys.status}
                  </StatusBadge>
                </div>

                <div className="text-sm font-bold text-white font-heading">
                  {sys.name}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                  {sys.entity}
                </div>
                <div className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {sys.details}
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#16233B] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-emerald-400 font-semibold">{sys.records}</span>
                <span>{sys.latency}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
