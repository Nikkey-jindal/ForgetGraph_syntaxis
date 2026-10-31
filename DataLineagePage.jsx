import React, { useState } from 'react'
import {
  Network,
  Database,
  Layers,
  Zap,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Search,
  Download,
  Info,
  RefreshCw,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useDashboard } from '../context/DashboardContext'
import { DATA_LINEAGE_LAYERS } from '../data/forgetGraphData'

export default function DataLineagePage() {
  const { tombstones, stats } = useDashboard()
  const [selectedUserId, setSelectedUserId] = useState(42)
  const [searchQuery, setSearchQuery] = useState('')

  // Map user ID to simulated footprint
  const isDeleted = tombstones.some((t) => t.userId === Number(selectedUserId))
  const isFailedResidualUser = Number(selectedUserId) === 87

  const userFootprint = {
    users: isDeleted ? 0 : 1,
    features: isDeleted ? 0 : 1,
    predictions: isDeleted ? 0 : 1,
    model: isDeleted
      ? isFailedResidualUser
        ? 'DIVERGED: Residual weight residue detected in balance_log (ΔW = 0.04821)'
        : `RETRAINED: Clean fit without user ${selectedUserId} (ΔW = 0.000002)`
      : `INCLUDED: Active training weight in Ridge model`,
    modelPassed: !isFailedResidualUser,
  }

  const nodes = [
    {
      id: 'users',
      title: '1. Raw Database',
      entity: 'users table (SQLite)',
      icon: Database,
      activeRows: `${stats.activeUsers} rows`,
      userRows: userFootprint.users,
      status: userFootprint.users === 0 ? 'Removed' : 'Present',
      variant: userFootprint.users === 0 ? 'emerald' : 'cyan',
      description: 'Source customer profile, demographic, and financial ledger data.',
    },
    {
      id: 'features',
      title: '2. Feature Store',
      entity: 'features matrix (4 features)',
      icon: Layers,
      activeRows: `${stats.activeUsers} feature vectors`,
      userRows: userFootprint.features,
      status: userFootprint.features === 0 ? 'Recomputed' : 'Present',
      variant: userFootprint.features === 0 ? 'emerald' : 'cyan',
      description: 'Statistical normalization, logarithmic balance, and transaction ratios.',
    },
    {
      id: 'predictions',
      title: '3. Prediction Cache',
      entity: 'predictions table',
      icon: Zap,
      activeRows: `${stats.activeUsers} cached inferences`,
      userRows: userFootprint.predictions,
      status: userFootprint.predictions === 0 ? 'Purged' : 'Present',
      variant: userFootprint.predictions === 0 ? 'emerald' : 'cyan',
      description: 'Low-latency scored inference vectors cached for API consumers.',
    },
    {
      id: 'model',
      title: '4. ML Model Artifacts',
      entity: 'Ridge Regressor (L2 regularized)',
      icon: Brain,
      activeRows: '5 parameters',
      userRows: isDeleted ? (userFootprint.modelPassed ? 0 : 'Residue') : 1,
      status: isDeleted ? (userFootprint.modelPassed ? 'Unlearned' : 'Diverged') : 'Serving',
      variant: isDeleted ? (userFootprint.modelPassed ? 'emerald' : 'rose') : 'cyan',
      description: 'Global model coefficients mathematically verified against reference M_ref.',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Lineage & Dependency Graph (DAG)"
        subtitle="Prove the complete cascade of user data removal: from raw database records to derived feature stores, inference cache tables, and retrained ML model weights."
        category="DEFENSE GRID / DATA LINEAGE"
        badge="4-Tier Lineage Active"
        badgeVariant="cyan"
      />

      {/* User Trace Selector Card */}
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
              Check whether user data has been fully purged or remains in downstream derived layers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Target User:</span>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="bg-[#080C14] border border-[#1A2744] text-xs font-mono font-bold text-emerald-400 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value={42}>User 42 (Tombstoned · Verified PASS)</option>
              <option value={118}>User 118 (Tombstoned · Verified PASS)</option>
              <option value={87}>User 87 (Tombstoned · Audit Failed Residue)</option>
              <option value={193}>User 193 (Tombstoned · Verified PASS)</option>
              <option value={15}>User 15 (Tombstoned · Re-Ingest Blocked)</option>
              <option value={1}>User 1 (Active Customer)</option>
              <option value={2}>User 2 (Active Customer)</option>
            </select>
          </div>
        </div>

        {/* Selected User Status Banner */}
        <div className={`mt-4 p-3.5 rounded-lg border flex items-center justify-between gap-3 text-xs font-mono ${
          isDeleted
            ? isFailedResidualUser
              ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
        }`}>
          <div className="flex items-center gap-2">
            {isDeleted ? (
              isFailedResidualUser ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span>
              {isDeleted
                ? isFailedResidualUser
                  ? `User ${selectedUserId}: Tombstoned in DB, but mathematical audit flagged residual memorization in model weights!`
                  : `User ${selectedUserId}: Fully forgotten. Zero residual rows in raw DB, feature store, cache, and certified unlearned in model weights.`
                : `User ${selectedUserId}: Active in database. Footprint present across all 4 tiers.`}
            </span>
          </div>

          <StatusBadge
            variant={isDeleted ? (isFailedResidualUser ? 'rose' : 'emerald') : 'cyan'}
            size="sm"
          >
            {isDeleted ? (isFailedResidualUser ? 'AUDIT VIOLATION' : 'VERIFIED ZERO RESIDUE') : 'ACTIVE DATA'}
          </StatusBadge>
        </div>
      </div>

      {/* Interactive Visual DAG Diagram */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#1A2744]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white font-heading">
              Four-Tier Pipeline Dependency DAG
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic dependency edges and state invalidation triggers.
            </p>
          </div>
          <StatusBadge variant="cyan" size="sm">
            Directed Acyclic Graph
          </StatusBadge>
        </div>

        {/* Visual Flow Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {nodes.map((node, index) => {
            const Icon = node.icon
            return (
              <div key={node.id} className="relative flex flex-col justify-between">
                <div className="rounded-xl bg-[#080C14] border border-[#1A2744] p-4 flex flex-col justify-between h-full hover:border-emerald-500/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-[#0E1626] border border-[#1A2744] text-emerald-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <StatusBadge variant={node.variant} size="sm">
                        {node.status}
                      </StatusBadge>
                    </div>

                    <h4 className="text-xs font-bold text-white font-heading">
                      {node.title}
                    </h4>
                    <div className="text-[11px] font-mono text-emerald-400/90 mt-0.5 truncate">
                      {node.entity}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {node.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#16233B] space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Active Capacity:</span>
                      <span className="text-white font-bold">{node.activeRows}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>User {selectedUserId} Residuals:</span>
                      <span className={`font-bold ${
                        node.userRows === 0
                          ? 'text-emerald-400'
                          : node.userRows === 'Residue'
                          ? 'text-rose-400'
                          : 'text-cyan-400'
                      }`}>
                        {node.userRows === 0 ? '0 (Clean)' : node.userRows}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector on Desktop */}
                {index < 3 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-500/60">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Layer Verification Audit Breakdown Table */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A2744]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white font-heading">
              Layer-by-Layer Verification Proof
            </h3>
            <p className="text-xs text-slate-400">
              Audit results for target user {selectedUserId} across storage, cache, and mathematical parameters.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#1A2744]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080C14] text-slate-400 border-b border-[#1A2744] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Layer Tier</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Reference Count (User {selectedUserId})</th>
                <th className="py-3 px-4">Verification Audit Check</th>
                <th className="py-3 px-4 text-right">Invariant Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16233B] bg-[#0E1626]">
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tier 1: Raw Storage</td>
                <td className="py-3 px-4 text-slate-400">users (SQLite table)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{userFootprint.users} rows</td>
                <td className="py-3 px-4 text-slate-300">Atomic DELETE query executed with 0 dangling references</td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant={userFootprint.users === 0 ? 'emerald' : 'cyan'} size="sm">
                    {userFootprint.users === 0 ? 'PURGED' : 'PRESENT'}
                  </StatusBadge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tier 2: Feature Store</td>
                <td className="py-3 px-4 text-slate-400">features matrix (4 features)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{userFootprint.features} rows</td>
                <td className="py-3 px-4 text-slate-300">Feature normalization recomputed on remaining D \ {'{u}'}</td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant={userFootprint.features === 0 ? 'emerald' : 'cyan'} size="sm">
                    {userFootprint.features === 0 ? 'RECALCULATED' : 'PRESENT'}
                  </StatusBadge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tier 3: Prediction Cache</td>
                <td className="py-3 px-4 text-slate-400">predictions table</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{userFootprint.predictions} rows</td>
                <td className="py-3 px-4 text-slate-300">Cached inference scores purged; zero tombstoned lookups</td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant={userFootprint.predictions === 0 ? 'emerald' : 'cyan'} size="sm">
                    {userFootprint.predictions === 0 ? 'INVALIDATED' : 'PRESENT'}
                  </StatusBadge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tier 4: Model Weights</td>
                <td className="py-3 px-4 text-slate-400">Ridge Regressor (L2 regularized)</td>
                <td className="py-3 px-4 font-bold">
                  <span className={userFootprint.modelPassed ? 'text-emerald-400' : 'text-rose-400'}>
                    {userFootprint.modelPassed ? '0 residual weights' : 'Residue in balance_log'}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {userFootprint.modelPassed
                    ? 'Dual-train verified: Replacement matches reference within τ = 10⁻⁵'
                    : 'Discrepancy ΔW = 0.048210 > 10⁻⁵: Residual training influence detected'}
                </td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant={userFootprint.modelPassed ? 'emerald' : 'rose'} size="sm">
                    {userFootprint.modelPassed ? 'L2 INVARIANT PASS' : 'AUDIT FAILED'}
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
