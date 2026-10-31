import React, { useState } from 'react'
import {
  UserMinus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Ban,
  ArrowRight,
  Database,
  Cpu,
  RefreshCw,
  Hash,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import LoadingState from '../components/common/LoadingState'
import { useDashboard } from '../context/DashboardContext'

export default function DeleteUserPage() {
  const {
    stats,
    tombstones,
    stages,
    executeDeletion,
  } = useDashboard()

  const [targetUserId, setTargetUserId] = useState(1)
  const [reason, setReason] = useState('GDPR Right to Be Forgotten (Art. 17)')
  const [isExecuting, setIsExecuting] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [lastActionResult, setLastActionResult] = useState(null)

  const isAlreadyTombstoned = tombstones.some((t) => t.userId === Number(targetUserId))

  const handlePickLowest = () => {
    const next = Number(targetUserId) + 1
    setTargetUserId(next)
  }

  // Run the REAL backend 6-step deletion pipeline via POST /delete,
  // animating the timeline while the request executes.
  const handleTriggerDeletion = async () => {
    if (isExecuting) return

    setIsExecuting(true)
    setCurrentStepIndex(0)
    setLastActionResult(null)

    const request = executeDeletion(targetUserId)
    for (let i = 0; i < stages.length; i++) {
      setCurrentStepIndex(i)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    const result = await request
    setLastActionResult(result)
    setIsExecuting(false)
    setCurrentStepIndex(stages.length)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deletion Center & Unlearning Pipeline"
        subtitle="Initiate atomic customer data erasure across the 6-stage unlearning pipeline. Each step verifies that no dangling references or mathematical residual weights persist."
        category="DEFENSE GRID / DELETION CENTER"
        badge="Atomic Pipeline Active"
        badgeVariant="emerald"
      />

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form & User Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2744] mb-4">
              <h2 className="text-sm sm:text-base font-bold text-white font-heading flex items-center gap-2">
                <UserMinus className="w-4 h-4 text-emerald-400" />
                Target User Deletion
              </h2>
              <StatusBadge
                variant={isAlreadyTombstoned ? 'amber' : 'emerald'}
                size="sm"
              >
                {isAlreadyTombstoned ? 'Already Tombstoned' : 'Active Record'}
              </StatusBadge>
            </div>

            <div className="space-y-4">
              {/* User ID Selector */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Target Customer User ID:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      max="1000000"
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      disabled={isExecuting}
                      className="w-full bg-[#080C14] border border-[#1A2744] rounded-lg px-3 py-2 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePickLowest}
                    disabled={isExecuting}
                    className="px-3 py-2 rounded-lg bg-[#142036] hover:bg-[#1A2744] border border-[#1E2D4A] text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer select-none active:scale-95 disabled:opacity-50"
                  >
                    Next Active
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  IDs 1-200 exist in the seeded DB. Deleting a tombstoned ID returns already_deleted.
                </p>
              </div>

              {/* Regulatory Reason */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Regulatory Legal Basis / Reason:
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isExecuting}
                  className="w-full bg-[#080C14] border border-[#1A2744] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                >
                  <option value="GDPR Right to Be Forgotten (Art. 17)">
                    GDPR Right to Be Forgotten (Art. 17)
                  </option>
                  <option value="CCPA Consumer Erasure Request">
                    CCPA Consumer Erasure Request
                  </option>
                  <option value="Security Incident - Tainted Training Record">
                    Security Incident - Tainted Training Record
                  </option>
                  <option value="Explicit Consent Revocation">
                    Explicit Consent Revocation
                  </option>
                  <option value="Account Termination & Data Erasure">
                    Account Termination & Data Erasure
                  </option>
                </select>
              </div>

              {/* Customer Record Preview */}
              {false && (
                <div className="p-3.5 rounded-lg bg-[#080C14] border border-[#1A2744] text-xs font-mono space-y-2">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Customer Database Snapshot:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>Age: <span className="text-white font-bold">{targetUser.age}</span></div>
                    <div>Balance: <span className="text-white font-bold">${targetUser.account_balance?.toLocaleString()}</span></div>
                    <div>Transactions: <span className="text-white font-bold">{targetUser.num_transactions}</span></div>
                    <div>Tenure: <span className="text-white font-bold">{targetUser.tenure_days} days</span></div>
                  </div>
                  <div className="pt-2 border-t border-[#16233B] flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Risk Score:</span>
                    <span className="text-cyan-400 font-bold">{targetUser.risk_score}</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleTriggerDeletion}
                disabled={isExecuting || isAlreadyTombstoned}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-98 select-none flex items-center justify-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Executing 6-Stage Pipeline...</span>
                  </>
                ) : (
                  <>
                    <UserMinus className="w-4 h-4" />
                    <span>Execute Deletion for User {targetUserId}</span>
                  </>
                )}
              </button>

              <div className="text-[11px] font-mono text-slate-400 text-center">
                Remaining Active Records: <span className="text-emerald-400 font-bold">{stats.active_users}</span> of {stats.total_users_seeded}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Progress & Step-by-Step Ledger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2744] mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                  Pipeline Execution Telemetry
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time status of each atomic unlearning stage.
                </p>
              </div>

              {lastActionResult && (
                <StatusBadge
                  variant={
                    lastActionResult.status === 'already_deleted'
                      ? 'amber'
                      : lastActionResult.isPassed
                      ? 'emerald'
                      : 'rose'
                  }
                  size="sm"
                  dot
                >
                  {lastActionResult.status === 'already_deleted'
                    ? 'ALREADY DELETED'
                    : lastActionResult.isPassed
                    ? 'Verified PASS'
                    : 'VERIFICATION FAILED'}
                </StatusBadge>
              )}
            </div>

            {/* Verdict Banner if completed */}
            {lastActionResult && (
              lastActionResult.status === 'already_deleted' ? (
                <div className="p-4 rounded-xl border mb-5 font-mono text-xs bg-amber-950/30 border-amber-500/40 text-amber-300">
                  <div className="font-bold text-sm mb-1">⚠ Already Deleted</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    User {targetUserId} is already tombstoned in the database. The backend returned
                    <span className="font-bold"> already_deleted</span> — the deletion pipeline is idempotent and no new steps were logged.
                  </p>
                </div>
              ) : lastActionResult.status === 'user_not_found' ? (
                <div className="p-4 rounded-xl border mb-5 font-mono text-xs bg-rose-950/30 border-rose-500/40 text-rose-300">
                  <div className="font-bold text-sm mb-1">✕ User Not Found</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    User {targetUserId} does not exist in the users table.
                  </p>
                </div>
              ) : (
                <div className={`p-4 rounded-xl border mb-5 font-mono text-xs ${
                  lastActionResult.isPassed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="flex items-center justify-between font-bold text-sm mb-1">
                    <span>{lastActionResult.isPassed ? '✓ Deletion Certified & Verified (PASS)' : '✕ Model Verification Divergence'}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lastActionResult.isPassed
                      ? `User ${targetUserId} was removed from the users table, features recomputed, cache invalidated, replacement Ridge model retrained, and independent verification PASSED (coefficients + intercept match the reference model).`
                      : `User ${targetUserId} was removed, but verification reported FAIL.`}
                  </p>
                </div>
              )
            )}

            {/* Stepper Timeline */}
            <div className="space-y-3">
              {stages.map((stage, idx) => {
                const isDone = currentStepIndex > idx
                const isCurrent = currentStepIndex === idx
                const isPending = currentStepIndex < idx

                return (
                  <div
                    key={stage.key}
                    className={`
                      p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3
                      ${
                        isDone
                          ? 'bg-[#080C14] border-emerald-500/40'
                          : isCurrent
                          ? 'bg-[#142036] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-[#080C14]/50 border-[#1A2744] opacity-60'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Step Indicator Badge */}
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0
                        ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isCurrent
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400 animate-pulse'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }
                      `}>
                        {isDone ? '✓' : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-heading">
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
                      <StatusBadge
                        variant={isDone ? 'emerald' : isCurrent ? 'cyan' : 'neutral'}
                        size="sm"
                      >
                        {isDone ? 'Done' : isCurrent ? 'Running...' : 'Pending'}
                      </StatusBadge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
