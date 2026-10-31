import React from 'react'
import { Users, Cpu, Trash2, ShieldCheck } from 'lucide-react'
import StatCard from '../common/StatCard'

export default function StatCards({ stats, onSelectCard, activeFilter }) {
  const cards = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: stats.totalUsers,
      subvalue: `${stats.activeUsers} active · ${stats.deletedUsers} tombstoned`,
      meta: 'Census in raw database',
      icon: Users,
      badge: 'SQLite DB',
      badgeVariant: 'emerald',
      accent: 'emerald',
    },
    {
      id: 'active-model',
      title: 'Active Model',
      value: stats.activeModel.name,
      subvalue: stats.activeModel.type,
      meta: `${stats.activeModel.features.length} derived features · ${stats.activeModel.version}`,
      icon: Cpu,
      badge: stats.activeModel.status,
      badgeVariant: 'cyan',
      accent: 'cyan',
    },
    {
      id: 'deletion-requests',
      title: 'Deletion Requests',
      value: stats.deletionRequests,
      subvalue: `${stats.verifiedDeletions.total} executed · 1 blocked`,
      meta: 'Atomic purge lifecycle jobs',
      icon: Trash2,
      badge: 'Audit Tracked',
      badgeVariant: 'amber',
      accent: 'amber',
    },
    {
      id: 'verified-deletions',
      title: 'Verified Deletions',
      value: `${stats.verifiedDeletions.passed}/${stats.verifiedDeletions.total}`,
      subvalue: `${stats.verifiedDeletions.passed} passed · ${stats.verifiedDeletions.failed} failed audit`,
      meta: 'Strict mathematical unlearning check',
      icon: ShieldCheck,
      badge: stats.verifiedDeletions.failed > 0 ? '1 Flagged' : '100% Pass',
      badgeVariant: stats.verifiedDeletions.failed > 0 ? 'rose' : 'emerald',
      accent: stats.verifiedDeletions.failed > 0 ? 'rose' : 'emerald',
      warning: stats.verifiedDeletions.failed > 0 ? 'Residue caught on USR-0087 (ΔW > 10⁻⁵)' : null,
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
