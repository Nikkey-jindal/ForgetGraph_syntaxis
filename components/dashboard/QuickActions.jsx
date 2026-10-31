import React from 'react'
import { Link } from 'react-router-dom'
import { UserMinus, Network, ShieldCheck, ArrowRight } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function QuickActions({
  onOpenDeleteModal,
  onOpenLineageModal,
  onOpenVerificationModal,
}) {
  const actions = [
    {
      id: 'delete-user',
      title: 'Delete a User',
      subtitle: 'Initiate 6-Stage Purge',
      description: 'Select an active user ID (1-200), cascade deletion across features & cache, retrain replacement model, and enforce tombstone.',
      icon: UserMinus,
      buttonText: 'Execute Deletion',
      buttonRoute: '/delete-user',
      badge: 'Interactive Pipeline',
      badgeVariant: 'amber',
      accent: 'amber',
      onClick: onOpenDeleteModal,
    },
    {
      id: 'view-lineage',
      title: 'View Data Lineage',
      subtitle: 'Inspect Dependency DAG',
      description: 'Trace customer data across Raw DB (users) → Feature Matrix → Predictions & Model Weights. Prove zero residual traces.',
      icon: Network,
      buttonText: 'Inspect Lineage DAG',
      buttonRoute: '/data-lineage',
      badge: '4-Tier Graph',
      badgeVariant: 'cyan',
      accent: 'cyan',
      onClick: onOpenLineageModal,
    },
    {
      id: 'run-verification',
      title: 'Run Verification',
      subtitle: 'Dual-Train Audit Engine',
      description: 'Mathematically audit replacement model weights against the ground-truth reference model. Test convergence threshold (τ = 10⁻⁵).',
      icon: ShieldCheck,
      buttonText: 'Open Verification Center',
      buttonRoute: '/verification-center',
      badge: 'Ground Truth Check',
      badgeVariant: 'emerald',
      accent: 'emerald',
      onClick: onOpenVerificationModal,
    },
  ]

  return (
    <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A2744]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading">
            Quick Actions & Verification Operations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Execute pipeline stages, examine dependencies, and audit model unlearning.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <div
              key={act.id}
              className="relative rounded-xl p-5 bg-[#080C14] border border-[#1A2744] hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-lg bg-[#0E1626] border border-[#1A2744] text-emerald-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <StatusBadge variant={act.badgeVariant} size="sm">
                    {act.badge}
                  </StatusBadge>
                </div>

                <h3 className="text-sm font-bold text-white font-heading">
                  {act.title}
                </h3>
                <div className="text-xs font-mono text-emerald-400/90 mt-0.5">
                  {act.subtitle}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#16233B] flex items-center gap-2">
                <button
                  type="button"
                  onClick={act.onClick}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm cursor-pointer active:scale-95 text-center"
                >
                  Quick Action
                </button>
                <Link
                  to={act.buttonRoute}
                  className="p-2 rounded-lg bg-[#142036] hover:bg-[#1A2744] border border-[#1E2D4A] text-slate-300 hover:text-white transition-colors"
                  title="Open dedicated page"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
