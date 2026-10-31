import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from '../context/DashboardContext'
import PageHeader from '../components/common/PageHeader'
import StatCards from '../components/dashboard/StatCards'
import SystemHealth from '../components/dashboard/SystemHealth'
import QuickActions from '../components/dashboard/QuickActions'
import PipelineActivity from '../components/dashboard/PipelineActivity'
import ModelStatus from '../components/dashboard/ModelStatus'
import RecentDeletions from '../components/dashboard/RecentDeletions'
import { ShieldCheck, RefreshCw, Database, Cpu, ArrowRight, UserMinus } from 'lucide-react'

export default function OverviewPage() {
  const {
    stats,
    systems,
    deletions,
    modelData,
    stages,
    setDeleteModalOpen,
    setLineageModalOpen,
    setVerificationModalOpen,
    setSelectedDeletionDetail,
    refreshDiagnostics,
  } = useDashboard()

  const [activeStatFilter, setActiveStatFilter] = useState(null)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Security & Verification Overview"
        subtitle="Active unlearning telemetry across SQLite raw tables, derived feature matrices, inference caches, and Scikit-Learn Ridge model weights."
        category="DEFENSE GRID / OVERVIEW"
        badge="PS09 Verification Active"
        badgeVariant="emerald"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshDiagnostics}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1626] border border-[#1A2744] text-xs font-mono text-slate-300 hover:text-white hover:border-emerald-500/30 transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Refresh Telemetry</span>
            </button>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer active:scale-95"
            >
              <UserMinus className="w-3.5 h-3.5" />
              <span>Execute Deletion</span>
            </button>
          </div>
        }
      />

      {/* 1. Top Stat Cards */}
      <section aria-label="Key Verification Metrics">
        <StatCards
          stats={stats}
          activeFilter={activeStatFilter}
          onSelectCard={(id) => {
            setActiveStatFilter(activeStatFilter === id ? null : id)
            if (id === 'active-model') setVerificationModalOpen(true)
            if (id === 'deletion-requests' || id === 'verified-deletions') {
              const el = document.getElementById('recent-deletions-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        />
      </section>

      {/* 2. System Health Architecture Telemetry */}
      <section aria-label="Architecture Telemetry">
        <SystemHealth
          systems={systems}
          onRefresh={refreshDiagnostics}
        />
      </section>

      {/* 3. Quick Actions Grid */}
      <section aria-label="Quick Actions">
        <QuickActions
          onOpenDeleteModal={() => setDeleteModalOpen(true)}
          onOpenLineageModal={() => setLineageModalOpen(true)}
          onOpenVerificationModal={() => setVerificationModalOpen(true)}
        />
      </section>

      {/* 4. Two-Column Grid: Pipeline Activity & Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <section className="h-full" aria-label="Six-Stage Pipeline Activity">
          <PipelineActivity
            stages={stages}
            onTriggerStageDemo={() => setDeleteModalOpen(true)}
          />
        </section>

        <section className="h-full" aria-label="Tri-Model Status Comparison">
          <ModelStatus
            modelData={modelData}
            onOpenVerificationModal={() => setVerificationModalOpen(true)}
          />
        </section>
      </div>

      {/* 5. Recent Deletions Audit Feed */}
      <section id="recent-deletions-section" aria-label="Recent Deletion Audit Feed">
        <RecentDeletions
          deletions={deletions}
          onSelectDeletion={(del) => setSelectedDeletionDetail(del)}
        />
      </section>
    </div>
  )
}
