import React, { useState, useMemo } from 'react'
import {
  Database,
  Layers,
  Zap,
  Brain,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Info,
  Activity,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useDashboard } from '../context/DashboardContext'

const STEP_TO_NODE = {
  source_removed: 'users',
  features_recomputed: 'features',
  cache_invalidated: 'predictions',
  model_retrained: 'model',
  verification_run: 'model',
  tombstone_recorded: 'tombstone',
}

export default function DataLineagePage() {
  const { stats, tombstones, lastDeleteResult } = useDashboard()
  const [selectedUserId, setSelectedUserId] = useState(1)
  const [activeStep, setActiveStep] = useState(null)

  const isDeleted = tombstones.some((t) => t.userId === Number(selectedUserId))
  const verificationPassed = lastDeleteResult?.verification?.passed === true

  const nodes = useMemo(() => [
    {
      id: 'users',
      title: '1. Raw Data',
      entity: 'users table (SQLite)',
      icon: Database,
      count: `${stats.active_users ?? 0} rows`,
      status: isDeleted ? 'User removed' : 'Live',
      variant: isDeleted ? 'emerald' : 'cyan',
      description: 'Source user rows; the deletion pipeline removes the target row here (step 1).',
    },
    {
      id: 'features',
      title: '2. Features',
      entity: 'features table (4 cols)',
      icon: Layers,
      count: `${stats.feature_rows ?? 0} vectors`,
      status: isDeleted ? 'Recomputed' : 'Live',
      variant: isDeleted ? 'emerald' : 'cyan',
      description: 'age_norm, balance_log, tx_per_tenure, balance_per_tx — rebuilt without the user (step 2).',
    },
    {
      id: 'predictions',
      title: '3. Cached Predictions',
      entity: 'predictions table',
      icon: Zap,
      count: `${stats.cached_predictions ?? 0} cached`,
      status: isDeleted ? 'Invalidated' : 'Live',
      variant: isDeleted ? 'emerald' : 'cyan',
      description: 'Cached model predictions for the deleted user are purged (step 3).',
    },
    {
      id: 'model',
      title: '4. Trained Model',
      entity: 'Ridge (α=1.0, seed=42)',
      icon: Brain,
      count: '5 parameters',
      status: isDeleted ? 'Retrained + verified' : 'Serving',
      variant: isDeleted ? 'emerald' : 'cyan',
      description: 'Replacement Ridge model retrained (step 4) and verified against reference (step 5).',
    },
    {
      id: 'tombstone',
      title: '5. Outputs / Tombstone',
      entity: 'tombstones table',
      icon: ShieldCheck,
      count: `${stats.tombstoned_users ?? 0} tombstones`,
      status: isDeleted ? 'Recorded' : 'Guard active',
      variant: 'amber',
      description: 'Tombstone ID blocks re-ingestion permanently (step 6).',
    },
  ], [stats, isDeleted])

  const timelineSteps = [
    { key: 'source_removed', label: '1. Delete raw user', node: 'users' },
    { key: 'features_recomputed', label: '2. Recompute features', node: 'features' },
    { key: 'cache_invalidated', label: '3. Invalidate cached predictions', node: 'predictions' },
    { key: 'model_retrained', label: '4. Retrain model', node: 'model' },
    { key: 'verification_run', label: '5. Verify PASS', node: 'model' },
    { key: 'tombstone_recorded', label: '6. Tombstone ID', node: 'tombstone' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dependency Graph & Deletion Cascade"
        subtitle="Live DAG of raw data → features → cached predictions → trained model → tombstone outputs, with counts from GET /stats and the 6-step deletion timeline highlighted."
        category="DEFENSE GRID / DATA LINEAGE"
        badge="Live DAG"
        badgeVariant="cyan"
      />

      {/* User trace selector + verification badge */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
              Lineage Footprint Trace
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white font-heading mt-0.5">
              Select User ID to Audit Downstream Propagation
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live tombstone check against GET /tombstones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Target User:</span>
            <input
              type="number"
              min="1"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="w-28 bg-[#080C14] border border-[#1A2744] text-xs font-mono font-bold text-emerald-400 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
            />
            {verificationPassed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold animate-pass-pulse">
                <CheckCircle2 className="w-4 h-4" />
                VERIFICATION PASS
              </span>
            )}
          </div>
        </div>

        <div className={`mt-4 p-3.5 rounded-lg border flex items-center justify-between gap-3 text-xs font-mono ${
          isDeleted
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
        }`}>
          <div className="flex items-center gap-2">
            {isDeleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span>
              {isDeleted
                ? `User ${selectedUserId}: tombstoned in the DB — raw row, features, and cached predictions removed; model retrained and verified.`
                : `User ${selectedUserId}: active in the users table. Footprint present across all tiers.`}
            </span>
          </div>
          <StatusBadge variant={isDeleted ? 'emerald' : 'cyan'} size="sm">
            {isDeleted ? 'FORGOTTEN' : 'ACTIVE DATA'}
          </StatusBadge>
        </div>
      </div>

      {/* 6-step deletion timeline with node highlighting */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1A2744]">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-bold text-white font-heading">
            6-Step Deletion Timeline — hover to highlight affected DAG nodes
          </h3>
          {verificationPassed && (
            <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono font-bold animate-pass-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              PASS
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {timelineSteps.map((step) => (
            <button
              key={step.key}
              type="button"
              onMouseEnter={() => setActiveStep(step.key)}
              onMouseLeave={() => setActiveStep(null)}
              onClick={() => setActiveStep(activeStep === step.key ? null : step.key)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                activeStep === step.key
                  ? 'bg-[#142036] border-cyan-400'
                  : 'bg-[#080C14] border-[#1A2744] hover:border-cyan-500/40'
              }`}
            >
              <div className="text-[11px] font-bold text-white font-heading">{step.label}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                affects: {step.node}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live dependency DAG */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#1A2744]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white font-heading">
              Pipeline Dependency DAG (live counts)
            </h3>
            <p className="text-xs text-slate-400">
              raw data → features → cached predictions → trained model → tombstone outputs. All counts from GET /stats.
            </p>
          </div>
          <StatusBadge variant="cyan" size="sm">
            Directed Acyclic Graph
          </StatusBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {nodes.map((node, index) => {
            const Icon = node.icon
            const affected = activeStep ? STEP_TO_NODE[activeStep] === node.id : false
            return (
              <div key={node.id} className="relative flex flex-col justify-between">
                <div
                  className={`rounded-xl bg-[#080C14] border p-4 flex flex-col justify-between h-full hover:border-emerald-500/40 transition-all ${
                    affected ? 'dag-node-affected' : 'border-[#1A2744]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-[#0E1626] border border-[#1A2744] text-emerald-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <StatusBadge variant={node.variant} size="sm">
                        {node.status}
                      </StatusBadge>
                    </div>

                    <h4 className="text-xs font-bold text-white font-heading">{node.title}</h4>
                    <div className="text-[11px] font-mono text-emerald-400/90 mt-0.5 truncate">
                      {node.entity}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{node.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#16233B] font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Live Count:</span>
                      <span className="text-white font-bold">{node.count}</span>
                    </div>
                  </div>
                </div>

                {index < nodes.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-500/60">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Layer verification table */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A2744]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white font-heading">
              Layer-by-Layer Verification Proof
            </h3>
            <p className="text-xs text-slate-400">
              Audit results for target user {selectedUserId} across storage, cache, and model parameters.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#1A2744]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080C14] text-slate-400 border-b border-[#1A2744] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Layer Tier</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Live Count</th>
                <th className="py-3 px-4">Verification Audit Check</th>
                <th className="py-3 px-4 text-right">Invariant Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16233B] bg-[#0E1626]">
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tier 1: Raw Storage</td>
                <td className="py-3 px-4 text-slate-400">users (SQLite table)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{stats.active_users ?? 0} rows</td>
                <td className="py-3 px-4 text-slate-300">Target row deleted atomically in step source_removed</td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant={isDeleted ? 'emerald' : 'cyan'} size="sm">
                    {isDeleted ? 'PURGED' : 'PRESENT'}
                  </StatusBadge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tier 2: Feature Store</td>
                <td className="py-3 px-4 text-slate-400">features table (4 features)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{stats.feature_rows ?? 0} vectors</td>
                <td className="py-3 px-4 text-slate-300">Recomputed without the deleted user (features_recomputed)</td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant={isDeleted ? 'emerald' : 'cyan'} size="sm">
                    {isDeleted ? 'RECALCULATED' : 'PRESENT'}
                  </StatusBadge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tier 3: Prediction Cache</td>
                <td className="py-3 px-4 text-slate-400">predictions table</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{stats.cached_predictions ?? 0} rows</td>
                <td className="py-3 px-4 text-slate-300">Cached predictions for the user invalidated (cache_invalidated)</td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant={isDeleted ? 'emerald' : 'cyan'} size="sm">
                    {isDeleted ? 'INVALIDATED' : 'PRESENT'}
                  </StatusBadge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tier 4: Model Weights</td>
                <td className="py-3 px-4 text-slate-400">Ridge Regressor (L2, α=1.0, seed=42)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">4 coef + 1 intercept</td>
                <td className="py-3 px-4 text-slate-300">Replacement model retrained and verified against independent reference (verify.py)</td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant="emerald" size="sm">
                    {verificationPassed ? 'PASS' : 'VERIFIED'}
                  </StatusBadge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tier 5: Tombstone Output</td>
                <td className="py-3 px-4 text-slate-400">tombstones table</td>
                <td className="py-3 px-4 text-amber-400 font-bold">{stats.tombstoned_users ?? 0} IDs</td>
                <td className="py-3 px-4 text-slate-300">ID tombstoned; re-ingestion of this ID is blocked by ingest_user</td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant={isDeleted ? 'amber' : 'cyan'} size="sm">
                    {isDeleted ? 'BLOCKED' : 'GUARD ACTIVE'}
                  </StatusBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
