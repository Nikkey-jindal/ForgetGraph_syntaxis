import React from 'react'

/**
 * Premium, production-ready Button component.
 * Features clean contrasts, crisp micro-interactions, and Lucide icon support.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none tracking-tight'

  const variants = {
    primary:
      'bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm border border-transparent font-semibold',
    secondary:
      'bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800/90 hover:text-white hover:border-zinc-700 shadow-sm',
    outline:
      'bg-transparent text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-700',
    ghost:
      'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60',
    danger:
      'bg-rose-950/60 text-rose-200 border border-rose-800/50 hover:bg-rose-900/70',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  )
}
