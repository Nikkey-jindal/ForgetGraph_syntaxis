import React from 'react'
import { ShieldCheck, Cpu } from 'lucide-react'

/**
 * Reusable LoadingState with dark cybersecurity aesthetic
 */
export default function LoadingState({
  message = 'Verifying deletion invariants...',
  submessage = 'Auditing L2 regularized weight stability against ground-truth reference model',
  variant = 'radar', // 'radar' | 'spinner' | 'skeleton'
  size = 'md',
  className = '',
}) {
  if (variant === 'skeleton') {
    return (
      <div className={`space-y-4 animate-pulse ${className}`}>
        <div className="h-8 bg-[#142036] rounded-lg w-1/3" />
        <div className="h-4 bg-[#142036] rounded w-2/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="h-28 bg-[#142036] rounded-xl" />
          <div className="h-28 bg-[#142036] rounded-xl" />
          <div className="h-28 bg-[#142036] rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* High-tech Radar Pulse Visual */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 flex items-center justify-center animate-pulse">
          <div className="w-12 h-12 rounded-full border border-cyan-500/40 flex items-center justify-center bg-[#0E1626]">
            <ShieldCheck className="w-6 h-6 text-emerald-400 animate-bounce" />
          </div>
        </div>
        {/* Orbiting scanning ping */}
        <div className="absolute inset-0 rounded-full border-t-2 border-emerald-400 animate-spin" />
      </div>

      <div className="text-sm font-semibold text-white tracking-tight font-heading">
        {message}
      </div>
      {submessage && (
        <div className="text-xs text-slate-400 mt-1 max-w-md font-mono">
          {submessage}
        </div>
      )}
    </div>
  )
}
