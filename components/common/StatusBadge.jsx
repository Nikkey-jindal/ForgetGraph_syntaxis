import React from 'react'
import { CheckCircle2, AlertOctagon, Ban, Clock, ShieldCheck, Cpu, Info, AlertTriangle } from 'lucide-react'

/**
 * Premium StatusBadge for FORGETGRAPH Cybersecurity Dashboard
 * Variants: emerald (success/verified), cyan (audit/in-progress), amber (warning/blocked),
 * rose (audit failure/danger), neutral (archived/idle)
 */
export default function StatusBadge({
  variant,
  status,
  size = 'md',
  dot = false,
  glow = false,
  icon: IconProp,
  children,
  className = '',
}) {
  const label = children || status || ''
  const str = String(label).toLowerCase()

  // Auto-detect variant if not explicitly provided
  let activeVariant = variant
  if (!activeVariant) {
    if (str.includes('pass') || str.includes('completed') || str.includes('healthy') || str.includes('synchronized') || str.includes('ok') || str.includes('active')) {
      activeVariant = 'emerald'
    } else if (str.includes('fail') || str.includes('error') || str.includes('danger') || str.includes('residue')) {
      activeVariant = 'rose'
    } else if (str.includes('block') || str.includes('warn') || str.includes('tombstone') || str.includes('flagged')) {
      activeVariant = 'amber'
    } else if (str.includes('audit') || str.includes('retrain') || str.includes('dag') || str.includes('serving') || str.includes('info')) {
      activeVariant = 'cyan'
    } else {
      activeVariant = 'neutral'
    }
  }

  // Variant color definitions
  const variantStyles = {
    emerald: {
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: glow ? 'shadow-[0_0_12px_rgba(16,185,129,0.3)]' : '',
      dotColor: 'bg-emerald-400',
      DefaultIcon: CheckCircle2,
    },
    cyan: {
      bg: 'bg-cyan-950/60',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      glow: glow ? 'shadow-[0_0_12px_rgba(6,182,212,0.3)]' : '',
      dotColor: 'bg-cyan-400',
      DefaultIcon: ShieldCheck,
    },
    amber: {
      bg: 'bg-amber-950/60',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: glow ? 'shadow-[0_0_12px_rgba(245,158,11,0.3)]' : '',
      dotColor: 'bg-amber-400',
      DefaultIcon: AlertTriangle,
    },
    rose: {
      bg: 'bg-rose-950/70',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      glow: glow ? 'shadow-[0_0_12px_rgba(244,63,94,0.35)]' : '',
      dotColor: 'bg-rose-400',
      DefaultIcon: AlertOctagon,
    },
    neutral: {
      bg: 'bg-slate-900/80',
      text: 'text-slate-300',
      border: 'border-slate-700/60',
      glow: '',
      dotColor: 'bg-slate-400',
      DefaultIcon: Info,
    },
  }

  const v = variantStyles[activeVariant] || variantStyles.neutral
  const IconComponent = IconProp || (str.includes('block') ? Ban : v.DefaultIcon)

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }

  return (
    <span
      className={`
        inline-flex items-center font-mono font-medium rounded-full border
        backdrop-blur-sm transition-all duration-150 select-none
        ${v.bg} ${v.text} ${v.border} ${v.glow} ${sizeStyles[size] || sizeStyles.md} ${className}
      `}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${v.dotColor}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${v.dotColor}`} />
        </span>
      )}
      {IconComponent && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span className="tracking-tight">{label}</span>
    </span>
  )
}
