import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, AlertOctagon, Ban, ChevronRight, Filter } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function RecentDeletions({ deletions, onSelectDeletion }) {
  const [filter, setFilter] = useState('ALL')

  const filteredDeletions = deletions.filter((d) => {
    if (filter === 'PASS') return d.isPassed && d.deletionStatus === 'Completed'
    if (filter === 'FAILED') return !d.isPassed
    if (filter === 'BLOCKED') return d.deletionStatus === 'Blocked'
    return true
  })

  return (
    <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#1A2744]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading">
              Recent Deletions & Audit Ledger
            </h2>
            <StatusBadge variant="cyan" size="sm">
              Live Feed
            </StatusBadge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic ledger tracking user record deletion verification and re-ingestion barriers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#080C14] p-1 rounded-lg border border-[#1A2744]">
          {['ALL', 'PASS', 'FAILED', 'BLOCKED'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`
                px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer
                ${
                  filter === f
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Deletions */}
      <div className="overflow-x-auto rounded-lg border border-[#1A2744]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#080C14] text-slate-400 border-b border-[#1A2744] uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Pipeline Status</th>
              <th className="py-3 px-4">Verification Audit</th>
              <th className="py-3 px-4 text-right">Max Delta (ΔW)</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16233B] bg-[#0E1626]">
            {filteredDeletions.map((d) => (
              <tr
                key={d.id}
                className="hover:bg-[#142036]/60 transition-colors cursor-pointer"
                onClick={() => onSelectDeletion(d)}
              >
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{d.userCode || `USR-${String(d.userId).padStart(4, '0')}`}</span>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {d.timestamp}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge
                    variant={d.deletionStatus === 'Completed' ? 'emerald' : 'amber'}
                    size="sm"
                  >
                    {d.deletionStatus}
                  </StatusBadge>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge
                    variant={!d.isPassed ? 'rose' : d.deletionStatus === 'Blocked' ? 'cyan' : 'emerald'}
                    size="sm"
                    dot={!d.isPassed}
                  >
                    {d.verificationResult}
                  </StatusBadge>
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  <span className={!d.isPassed ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {d.maxDelta}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1">
                    Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
