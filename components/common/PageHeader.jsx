import React from 'react'
import StatusBadge from './StatusBadge'

/**
 * Reusable PageHeader for FORGETGRAPH dashboard pages.
 * Aligned with premium dark cybersecurity SaaS design guidelines.
 */
export default function PageHeader({
  title,
  subtitle,
  category = 'PS09 PROTOCOL / DELETION VERIFICATION',
  badge,
  badgeVariant = 'emerald',
  actions,
  children,
  className = '',
}) {
  return (
    <div className={`pb-6 mb-6 border-b border-[#1A2744] flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}>
      <div>
        {category && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              {category}
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
            {title}
          </h1>
          {badge && (
            <StatusBadge variant={badgeVariant} size="sm" dot>
              {badge}
            </StatusBadge>
          )}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {(actions || children) && (
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          {actions}
          {children}
        </div>
      )}
    </div>
  )
}
