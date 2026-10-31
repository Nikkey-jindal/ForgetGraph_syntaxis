import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Network,
  UserMinus,
  ShieldCheck,
  Cpu,
  FileText,
  X,
  Radio,
  ExternalLink,
  Lock,
  ChevronRight,
  Database,
} from 'lucide-react'
import { useDashboard } from '../../context/DashboardContext'
import StatusBadge from '../common/StatusBadge'

/**
 * FORGETGRAPH Fixed Sidebar Navigation
 * Premium dark cybersecurity SaaS layout with emerald and cyan accents.
 */
export default function Sidebar() {
  const location = useLocation()
  const {
    mobileNavOpen,
    setMobileNavOpen,
    stats,
    auditLogs,
    tombstones,
  } = useDashboard()

  const navItems = [
    {
      name: 'Overview',
      path: '/',
      icon: LayoutDashboard,
      badge: null,
      description: 'System health & pipeline telemetry',
    },
    {
      name: 'Data Lineage',
      path: '/data-lineage',
      icon: Network,
      badge: 'DAG',
      badgeVariant: 'cyan',
      description: '4-tier dependency flow trace',
    },
    {
      name: 'Delete User',
      path: '/delete-user',
      icon: UserMinus,
      badge: `${stats.active_users ?? stats.activeUsers} Active`,
      badgeVariant: 'emerald',
      description: '6-stage atomic unlearning runner',
    },
    {
      name: 'Verification Center',
      path: '/verification-center',
      icon: ShieldCheck,
      badge: 'Dual-Train',
      badgeVariant: 'emerald',
      description: 'Tolerance τ = 10⁻⁵ audit',
    },
    {
      name: 'Model Comparison',
      path: '/model-comparison',
      icon: Cpu,
      badge: 'Tri-Model',
      badgeVariant: 'cyan',
      description: 'Ridge weight invariance',
    },
    {
      name: 'Audit Logs',
      path: '/audit-logs',
      icon: FileText,
      badge: `${tombstones.length} Tombstones`,
      badgeVariant: 'amber',
      description: 'Permanent tamper-evident log',
    },
  ]

  const handleLinkClick = () => {
    if (mobileNavOpen) {
      setMobileNavOpen(false)
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B1120] border-r border-[#16233B] text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#16233B] flex items-center justify-between">
        <NavLink
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3 group select-none"
        >
          {/* Logo Icon Mark */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[1.5px] shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#080C14] rounded-[10px] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-emerald-400 stroke-current"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Cybersecurity Shield + Graph Nodes */}
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="2" fill="#10B981" />
                <line x1="12" y1="9" x2="12" y2="7" />
                <line x1="10" y1="12" x2="8" y2="13" />
                <line x1="14" y1="12" x2="16" y2="13" />
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black tracking-wider text-base text-white group-hover:text-emerald-300 transition-colors">
                FORGETGRAPH
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                PS09
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight leading-none mt-0.5">
              Deletion Verification Protocol
            </div>
          </div>
        </NavLink>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#142036] transition-colors"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
        <div className="px-2.5 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
          <span>Security Grid Navigation</span>
          <span className="text-[9px] text-emerald-400 font-mono">LIVE DUAL-TRAIN</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`
                group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium
                transition-all duration-150 select-none
                ${
                  isActive
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#121B2F] border border-transparent'
                }
              `}
            >
              {/* Active Indicator Bar on Left */}
              {isActive && (
                <span className="absolute left-0 inset-y-1.5 w-1 bg-emerald-400 rounded-r-full shadow-[0_0_8px_#10B981]" />
              )}

              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-emerald-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <div className="truncate">
                  <div className="tracking-tight text-[13px] font-semibold">{item.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono hidden xl:block truncate">
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`
                    text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 border
                    ${
                      item.badgeVariant === 'emerald'
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30'
                        : item.badgeVariant === 'amber'
                        ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                        : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30'
                    }
                  `}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Sidebar Footer: System Telemetry Card */}
      <div className="p-3.5 border-t border-[#16233B] bg-[#080C14]/70">
        <div className="rounded-xl p-3 bg-[#0E1626] border border-[#1A2744] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-white font-mono">DEFENSE GRID</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-1 border-t border-[#16233B]">
            <div>
              <span className="text-slate-400 block text-[9px]">TOLERANCE</span>
              <span className="text-white font-semibold">τ = 10⁻⁵</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">LATENCY</span>
              <span className="text-emerald-400 font-semibold">{stats.active_users ?? stats.activeUsers} active users</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#16233B] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span className="font-mono text-[10px]">SecOps-Auditor-01</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">SQLite + Ridge</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 xl:w-72 z-30 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Responsive Navigation Drawer & Backdrop */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Sidebar Panel */}
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
