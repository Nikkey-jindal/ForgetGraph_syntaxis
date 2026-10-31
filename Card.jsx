import React from 'react'

/**
 * Premium Card component with clean 1px hairline border, subtle background tint,
 * and smooth transition on hover.
 */
export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`
        rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-zinc-100 backdrop-blur-sm
        ${hover ? 'transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/70 hover:-translate-y-0.5' : ''}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  )
}
