import React from 'react'

/**
 * Clean, modern Badge component for categories, tags, and status signals.
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  icon: Icon,
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border transition-colors select-none'

  const variants = {
    default: 'bg-zinc-900/90 text-zinc-300 border-zinc-800',
    indigo: 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40',
    emerald: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
    amber: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
    rose: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
  }

  const dotColors = {
    default: 'bg-zinc-400',
    indigo: 'bg-indigo-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-xs sm:text-sm px-3.5 py-1.5 gap-2',
  }

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}>
      {dot && (
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default} ${variant === 'emerald' ? 'animate-pulse' : ''}`} />
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  )
}
