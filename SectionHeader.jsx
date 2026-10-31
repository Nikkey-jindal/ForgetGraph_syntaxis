import React from 'react'
import Badge from './Badge'

/**
 * Standardized SectionHeader with modern typography, crisp contrast,
 * and optional badge and alignment controls.
 */
export default function SectionHeader({
  badge,
  badgeVariant = 'default',
  badgeIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignment = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }

  return (
    <div className={`max-w-3xl flex flex-col mb-12 sm:mb-16 ${alignment[align] || alignment.center} ${className}`}>
      {badge && (
        <div className="mb-4">
          <Badge variant={badgeVariant} icon={badgeIcon} dot>
            {badge}
          </Badge>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3.5 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
