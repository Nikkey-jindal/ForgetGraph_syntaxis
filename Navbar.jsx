import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  ShieldCheck,
  UserMinus,
  Bell,
  Cpu,
  Database,
  ExternalLink,
  ChevronRight,
  Terminal,
  AlertTriangle,
} from 'lucide-react'
import { useDashboard } from '../../context/DashboardContext'
import StatusBadge from '../common/StatusBadge'

/**
 * FORGETGRAPH Top Navigation Bar
 * Responsive, fixed/sticky, dark cybersecurity theme with live telemetry pills.
 */
export default function Navbar() {
  const location = useLocation()
  const {
    setMobileNavOpen,
    setDeleteModalOpen,
    stats,
    deletions,
  } = useDashboard()

  // Get current page name from pathname
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
      case '/overview':
        return 'Overview'
      case '/data-lineage':
        return 'Data Lineage'
      case '/delete-user':
        return 'Delete User'
      case '/verification-center':
        return 'Verification Center'
      case '/model-comparison':
        return 'Model Comparison'
      case '/audit-logs':
        return 'Audit Logs'
      default:
        return 'Dashboard'
    }
  }

  const currentTitle = getPageTitle(location.pathname)
  const failedAuditsCount = deletions.filter((d) => !d.isPassed).length

  return (
    <header className="sticky top-0 z-20 bg-[#0B1120]/90 backdrop-blur-md border-b border-[#16233B] h-16 flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Hamburger & Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-[#0E1626] border border-[#1A2744] text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline">FORGETGRAPH</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <span className="text-emerald-400 font-semibold tracking-wide">
              {currentTitle}
            </span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              PS09 Runtime
            </span>
          </div>
        </div>

        {/* Center / Right: Live System Telemetry & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Cluster Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0E1626] border border-[#1A2744] text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-200">Dual-Train Grid:</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-400">{stats.activeUsers}/200 Users</span>
          </div>

          {/* Audit Alert Notice */}
          {failedAuditsCount > 0 && (
            <Link
              to="/audit-logs"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono hover:bg-rose-950/70 transition-colors"
              title="1 residual memorization failure flagged by unlearning auditor"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>1 Residue Flag</span>
            </Link>
          )}

          {/* Quick Action: Delete User CTA */}
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all duration-150 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer active:scale-95 select-none"
          >
            <UserMinus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Delete User</span>
            <span className="xs:hidden">Delete</span>
          </button>

          {/* User Session Profile Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#16233B]">
            <div className="w-8 h-8 rounded-xl bg-[#0E1626] border border-[#1A2744] flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shadow-sm">
              SO
            </div>
            <div className="hidden xl:block text-left text-xs font-mono leading-tight">
              <div className="font-semibold text-slate-200">SecOps-01</div>
              <div className="text-[10px] text-slate-400">ML Unlearning Auditor</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
