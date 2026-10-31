import React from 'react'
import { Users, Cpu, Trash2, ShieldCheck } from 'lucide-react'
import StatCard from '../common/StatCard'

export default function StatCards({ stats, onSelectCard, activeFilter }) {
  const model = stats.model || { name: 'Risk Prediction Model', type: 'Ridge Regression (L2, alpha=1.0)', features: [], status: 'Healthy' }
  const cards = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: stats.total_users_seeded ?? stats.totalUsers,
      subvalue: `${stats.active_users ?? stats.activeUsers} active · ${stats.tombstoned_users ?? stats.deletedUsers} tombstoned`,
      meta: 'Live count from SQLite users/tombstones',
      icon: Users,
      badge: 'SQLite DB',
      badgeVariant: 'emerald',
      accent: 'emerald',
    },
    {
      id: 'active-model',
      title: 'Active Model',
      value: model.name,
      subvalue: model.type,
      meta: `${(model.features || []).length} derived features · seed ${stats.model?.seed ?? 42} · α=${stats.model?.ridge_alpha ?? 1.0}`,
      icon: Cpu,
      badge: model.status,
      badgeVariant: 'cyan',
      accent: 'cyan',
    },
    {
      id: 'deletion-requests',
      title: 'Deletion Requests',
      value: stats.deletion_log_events ?? stats.deletionRequests,
      subvalue: `${stats.tombstoned_users ?? 0} tombstoned · ${stats.reingestion_blocked ?? 0} re-ingest blocked`,
      meta: 'Live events from deletion_log',
      icon: Trash2,
      badge: 'Audit Tracked',
      badgeVariant: 'amber',
      accent: 'amber',
    },
    {
      id: 'verified-deletions',
      title: 'Verified Deletions',
      value: `${stats.verification_passed ?? 0}/${(stats.verification_passed ?? 0) + (stats.verification_failed ?? 0)}`,
      subvalue: `${stats.verification_passed ?? 0} passed · ${stats.verification_failed ?? 0} failed audit`,
      meta: 'Independent dual-train verification (PASS/FAIL)',
      icon: ShieldCheck,
      badge: (stats.verification_failed ?? 0) > 0 ? `${stats.verification_failed} Flagged` : '100% Pass',
      badgeVariant: (stats.verification_failed ?? 0) > 0 ? 'rose' : 'emerald',
      accent: (stats.verification_failed ?? 0) > 0 ? 'rose' : 'emerald',
      warning: (stats.verification_failed ?? 0) > 0 ? 'Verification FAIL recorded in deletion_log' : null,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          title={card.title}
          value={card.value}
          subvalue={card.subvalue}
          meta={card.meta}
          icon={card.icon}
          badge={card.badge}
          badgeVariant={card.badgeVariant}
          accent={card.accent}
          warning={card.warning}
          isSelected={activeFilter === card.id}
          onClick={() => onSelectCard(card.id)}
        />
      ))}
    </div>
  )
}
