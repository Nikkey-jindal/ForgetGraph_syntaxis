import React, { useState } from 'react'
import { X, UserMinus, CheckCircle2, Clock, ShieldCheck, AlertTriangle, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { PIPELINE_STAGES } from '../../data/forgetGraphData'

export default function DeleteUserModal({ isOpen, onClose, onExecuteDeletion, availableUsers = [45, 12, 73, 98, 154] }) {
  const [targetId, setTargetId] = useState(availableUsers[0] || 45)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStepIdx, setCurrentStepIdx] = useState(-1)
  const [executionResult, setExecutionResult] = useState(null)
  const [injectResidue, setInjectResidue] = useState(false) // Allows demonstrating verification catching unlearning failure

  if (!isOpen) return null

  const handleReset = () => {
    setIsRunning(false)
    setCurrentStepIdx(-1)
    setExecutionResult(null)
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const runPipeline = async () => {
    setIsRunning(true)
    setCurrentStepIdx(0)
    setExecutionResult(null)

    // Simulate real 6-stage pipeline execution with realistic timing
    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      setCurrentStepIdx(i)
      await new Promise((resolve) => setTimeout(resolve, 400))
    }

    const isPassed = !injectResidue
    const maxDelta = isPassed ? '0.000002' : '0.038410'
    const newDeletion = {
      id: `del-${Date.now()}`,
      userId: Number(targetId),
      userCode: `USR-${String(targetId).padStart(4, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      relativeTime: 'Just now',
      deletionStatus: 'Completed',
      verificationResult: isPassed ? 'Verified PASS' : 'VERIFICATION FAILED',
      isPassed,
      maxDelta,
      tolerance: '0.000010',
      notes: isPassed
        ? 'Clean unlearning certified. Replacement model matches reference model.'
        : 'Audit Failure: Memorization residue detected in weight balance_log (ΔW > τ).',
      details: {
        sourceRemoved: true,
        featuresRecomputed: true,
        cachePurged: true,
        modelRetrained: true,
        tombstoneCreated: true,
      },
    }

    setExecutionResult(newDeletion)
    setIsRunning(false)
    if (onExecuteDeletion) {
      onExecuteDeletion(newDeletion)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-xl bg-[#0E1626] border border-[#1A2744] p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#1A2744]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <UserMinus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-heading">
                Initiate Dependency-Aware Deletion
              </h3>
              <p className="text-xs text-slate-400">
                PS09 Six-Stage Deletion & Mathematical Verification Protocol
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#142036] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!executionResult ? (
          <div className="mt-5 space-y-5">
            {/* User Target Selection */}
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-300 mb-2">
                Select Target Customer ID to Delete:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  disabled={isRunning}
                  className="flex-1 bg-[#080C14] border border-[#1A2744] rounded-lg px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-zinc-400 font-mono">
                  USR-{String(targetId).padStart(4, '0')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-zinc-400">Quick presets:</span>
                {availableUsers.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTargetId(id)}
                    disabled={isRunning}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-indigo-300 border border-zinc-800 cursor-pointer"
                  >
                    User {id}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Customer Row Data */}
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-[#2A3552] text-xs">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                Target Record Blueprint (SQLite: users):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">Age</div>
                  <div className="text-white font-bold">34 yrs</div>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">Balance</div>
                  <div className="text-white font-bold">$14,250.00</div>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">Transactions</div>
                  <div className="text-white font-bold">42 tx</div>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">Tenure</div>
                  <div className="text-white font-bold">680 days</div>
                </div>
              </div>
            </div>

            {/* Real Unlearning Failure Simulation Toggle */}
            <div className="p-3 rounded-xl bg-[#1F2840]/60 border border-[#2A3552] flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-white">
                  Test Failure Detection Mode
                </div>
                <div className="text-[11px] text-zinc-400">
                  Simulates residual memory residue in model weights to test verification engine rejection.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={injectResidue}
                  onChange={(e) => setInjectResidue(e.target.checked)}
                  disabled={isRunning}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {/* Stepper Progress */}
            {isRunning && (
              <div className="space-y-2 pt-2 border-t border-[#2A3552]">
                <div className="text-xs font-mono text-indigo-300 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Executing Stage {currentStepIdx + 1} of 6: {PIPELINE_STAGES[currentStepIdx]?.key}...
                </div>
                <div className="space-y-1.5">
                  {PIPELINE_STAGES.map((stg, i) => {
                    const isDone = i < currentStepIdx
                    const isCurrent = i === currentStepIdx
                    return (
                      <div
                        key={stg.key}
                        className={`text-[11px] font-mono px-3 py-1.5 rounded-lg flex items-center justify-between border ${
                          isDone
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                            : isCurrent
                            ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700 animate-pulse'
                            : 'bg-zinc-950/40 text-zinc-500 border-zinc-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{i + 1}.</span>
                          <span>{stg.key}</span>
                        </span>
                        <span>{isDone ? '✓ Completed' : isCurrent ? 'Processing...' : 'Pending'}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Trigger Button */}
            {!isRunning && (
              <button
                type="button"
                onClick={runPipeline}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs font-mono text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-950/50"
              >
                <span>Execute Complete 6-Stage Purge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Execution Result Certificate */
          <div className="mt-5 space-y-4">
            <div
              className={`p-4 rounded-xl border text-center space-y-2 ${
                executionResult.isPassed
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                {executionResult.isPassed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                )}
              </div>
              <h4 className="text-base font-bold text-white font-sans">
                {executionResult.isPassed ? 'Deletion Verified & Certified' : 'Verification Audit Rejected'}
              </h4>
              <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                {executionResult.notes}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-[#2A3552] text-xs font-mono space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span>Target User:</span>
                <span className="text-white font-bold">{executionResult.userCode}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Max Weight Discrepancy (|ΔW|):</span>
                <span className={executionResult.isPassed ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                  {executionResult.maxDelta} (Tolerance τ = {executionResult.tolerance})
                </span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Tombstone Blacklist Entry:</span>
                <span className="text-amber-400">ENFORCED (Re-ingestion blocked)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs font-mono text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Done & Return to Overview
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
