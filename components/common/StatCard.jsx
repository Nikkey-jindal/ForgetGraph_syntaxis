import React from 'react'
import { ArrowUpRight, AlertCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'

/**
 * Premium StatCard Component for FORGETGRAPH
 * Clean typography, subtle dark cybersecurity borders, and smooth restrained hover effects.
 */
export default function StatCard({
  title,
  label,
  value,
  subvalue,
  meta,
  icon: Icon,
  badge,
  badgeVariant,
  accent = 'emerald', // 'emerald' | 'cyan' | 'amber' | 'rose'
  trend,
  warning,
  isSelected = false,
  onClick,
  className = '',
}) {
  const displayTitle = title || label

  const accentStyles = {
    emerald: {
      borderHover: 'hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]',
      iconBg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400',
      activeRing: 'border-emerald-500 ring-2 ring-emerald-500/20',
      valueColor: 'text-white',
    },
    cyan: {
      borderHover: 'hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.12)]',
      iconBg: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400',
      activeRing: 'border-cyan-500 ring-2 ring-cyan-500/20',
      valueColor: 'text-cyan-200',
    },
    amber: {
      borderHover: 'hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.12)]',
      iconBg: 'bg-amber-950/40 border-amber-500/30 text-amber-400',
      activeRing: 'border-amber-500 ring-2 ring-amber-500/20',
      valueColor: 'text-amber-200',
    },
    rose: {
      borderHover: 'hover:border-rose-500/40 hover:shadow-[0_0_25px_rgba(244,63,94,0.15)]',
      iconBg: 'bg-rose-950/40 border-rose-500/30 text-rose-400',
      activeRing: 'border-rose-500 ring-2 ring-rose-500/20',
      valueColor: 'text-rose-200',
    },
  }

  const currentAccent = accentStyles[accent] || accentStyles.emerald
  const isClickable = Boolean(onClick)

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      className={`
        relative rounded-xl p-5 bg-[#0E1626] border transition-all duration-200
        ${isSelected ? currentAccent.activeRing : 'border-[#1A2744]'}
        ${isClickable ? `cursor-pointer ${currentAccent.borderHover} hover:-translate-y-0.5` : ''}
        group overflow-hidden ${className}
      `}
    >
      {/* Top ambient highlight gradient */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header: Title + Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          {displayTitle}
        </span>
        {badge && (
          <StatusBadge variant={badgeVariant || accent} size="sm">
            {badge}
          </StatusBadge>
        )}
      </div>

      {/* Main Metric & Icon */}
      <div className="flex items-baseline justify-between mb-2">
        <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-heading ${currentAccent.valueColor}`}>
          {value}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg border transition-transform duration-200 group-hover:scale-105 ${currentAccent.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Subvalue / Description */}
      {subvalue && (
        <div className="text-xs font-medium text-slate-300 mb-2">
          {subvalue}
        </div>
      )}

      {/* Meta Footer */}
      {meta && (
        <div className="pt-2.5 border-t border-[#1A2744] flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">{meta}</span>
          {isClickable && (
            <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-slate-400" />
          )}
        </div>
      )}

      {/* Warning Alert Banner */}
      {warning && (
        <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center gap-1.5 text-[11px] text-rose-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  )
}
