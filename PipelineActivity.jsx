import React, { useState } from 'react'
import { CheckCircle2, ChevronRight, Layers, ArrowRight } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function PipelineActivity({ stages, onTriggerStageDemo }) {
  const [selectedStage, setSelectedStage] = useState(stages[0])

  return (
    <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A2744]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading">
                Six-Stage Deletion Pipeline
              </h2>
              <StatusBadge variant="emerald" size="sm">
                PS09 Protocol
              </StatusBadge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic state transitions required to certify complete data unlearning.
            </p>
          </div>
          <button
            type="button"
            onClick={onTriggerStageDemo}
            className="text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer select-none active:scale-95"
          >
            <span>Live Trace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stepper Timeline */}
        <div className="space-y-2 mb-4">
          {stages.map((stage, idx) => {
            const isSelected = selectedStage.key === stage.key
            return (
              <div
                key={stage.key}
                onClick={() => setSelectedStage(stage)}
                className={`
                  p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3
                  ${isSelected
                    ? 'bg-[#142036] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-[#080C14] border-[#1A2744] hover:bg-[#111C30]'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold"
                    style={{
                      backgroundColor: `${stage.color}15`,
                      color: stage.color,
                      border: `1px solid ${stage.color}40`,
                    }}
                  >
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-heading truncate">
                        {stage.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                        ({stage.system})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {stage.description}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold block">
                    {stage.typicalDuration}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Deterministic
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Stage Detail Drawer */}
      {selectedStage && (
        <div className="mt-3 p-3.5 rounded-lg bg-[#080C14] border border-[#1A2744]">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
              Selected Stage: {selectedStage.name}
            </span>
            <StatusBadge variant="cyan" size="sm">
              {selectedStage.system}
            </StatusBadge>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedStage.description}
          </p>
        </div>
      )}
    </div>
  )
}
