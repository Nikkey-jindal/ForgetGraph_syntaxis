import React, { useState } from 'react'
import {
  INITIAL_TOP_STATS,
  INITIAL_SYSTEM_HEALTH,
  PIPELINE_STAGES,
  INITIAL_RECENT_DELETIONS,
  INITIAL_MODEL_STATUS,
} from '../data/forgetGraphData'
import { useDashboard } from '../context/DashboardContext'

import StatCards from '../components/dashboard/StatCards'
import SystemHealth from '../components/dashboard/SystemHealth'
import PipelineActivity from '../components/dashboard/PipelineActivity'
import ModelStatus from '../components/dashboard/ModelStatus'
import RecentDeletions from '../components/dashboard/RecentDeletions'
import QuickActions from '../components/dashboard/QuickActions'

import DeleteUserModal from '../components/modals/DeleteUserModal'
import DataLineageModal from '../components/modals/DataLineageModal'
import RunVerificationModal from '../components/modals/RunVerificationModal'
import DeletionDetailModal from '../components/modals/DeletionDetailModal'

import { ShieldCheck, Sparkles, RefreshCw, Layers, Database, Cpu } from 'lucide-react'

export default function HomePage() {
  // Global dashboard state
  const [stats, setStats] = useState(INITIAL_TOP_STATS)
  const [systems, setSystems] = useState(INITIAL_SYSTEM_HEALTH)
  const [deletions, setDeletions] = useState(INITIAL_RECENT_DELETIONS)
  const [modelData, setModelData] = useState(INITIAL_MODEL_STATUS)

  // Modals state from context
  const {
    deleteModalOpen,
    setDeleteModalOpen,
    lineageModalOpen,
    setLineageModalOpen,
    verificationModalOpen,
    setVerificationModalOpen,
  } = useDashboard()

  const [selectedDeletionForDetail, setSelectedDeletionForDetail] = useState(null)
  const [activeStatFilter, setActiveStatFilter] = useState(null)

  // Refresh / Re-sync diagnostics handler
  const handleRefreshDiagnostics = () => {
    setSystems((prev) =>
      prev.map((s) => ({
        ...s,
        lastChecked: 'Just now',
      }))
    )
  }

  // Handle live deletion execution from DeleteUserModal
  const handleExecuteDeletion = (newDeletion) => {
    // 1. Update Deletions list
    setDeletions((prev) => [newDeletion, ...prev])

    // 2. Update Top Stat Cards
    setStats((prev) => ({
      ...prev,
      activeUsers: Math.max(0, prev.activeUsers - 1),
      deletedUsers: prev.deletedUsers + 1,
      deletionRequests: prev.deletionRequests + 1,
      verifiedDeletions: {
        ...prev.verifiedDeletions,
        total: prev.verifiedDeletions.total + 1,
        passed: newDeletion.isPassed
          ? prev.verifiedDeletions.passed + 1
          : prev.verifiedDeletions.passed,
        failed: !newDeletion.isPassed
          ? prev.verifiedDeletions.failed + 1
          : prev.verifiedDeletions.failed,
      },
    }))

    // 3. Update Model Status with slight shift representing new retrained weights
    if (newDeletion.isPassed) {
      setModelData((prev) => ({
        ...prev,
        replacementModel: {
          ...prev.replacementModel,
          trainedOn: `Pipeline retrained on D \\ {${newDeletion.userId}} (${stats.activeUsers - 1} records)`,
        },
        maxGap: 0.000002,
        verdict: 'PASS',
      }))
    } else {
      setModelData((prev) => ({
        ...prev,
        replacementModel: {
          ...prev.replacementModel,
          coefficients: {
            ...prev.replacementModel.coefficients,
            balance_log: prev.replacementModel.coefficients.balance_log + 0.04821,
          },
        },
        maxGap: 0.04821,
        verdict: 'FAIL',
      }))
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#2A3552]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              FORGETGRAPH Overview
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/60 shadow-sm">
              PS09 Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8E9AB8] mt-1.5 max-w-2xl leading-relaxed">
            Dependency-aware data deletion verification. Auditing SQLite raw storage, derived feature matrices, inference caches, and Scikit-Learn model weights.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#171E2E] border border-[#2A3552] text-zinc-300 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            SQLite: users (200 rows)
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#171E2E] border border-[#2A3552] text-zinc-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            Ridge: 4 Features
          </span>
        </div>
      </div>

      {/* TOP STAT CARDS */}
      <section aria-label="Key Performance Indicators">
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

      {/* MAIN SECTION 1: SYSTEM HEALTH */}
      <section aria-label="System Health Telemetry">
        <SystemHealth
          systems={systems}
          onRefresh={handleRefreshDiagnostics}
        />
      </section>

      {/* MAIN SECTION 5: QUICK ACTIONS */}
      <section aria-label="Quick Actions">
        <QuickActions
          onOpenDeleteModal={() => setDeleteModalOpen(true)}
          onOpenLineageModal={() => setLineageModalOpen(true)}
          onOpenVerificationModal={() => setVerificationModalOpen(true)}
        />
      </section>

      {/* TWO-COLUMN GRID: PIPELINE ACTIVITY & MODEL STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* MAIN SECTION 3: PIPELINE ACTIVITY (SIX STAGES) */}
        <section className="h-full" aria-label="Six-Stage Pipeline Activity">
          <PipelineActivity
            stages={PIPELINE_STAGES}
            onTriggerStageDemo={() => setDeleteModalOpen(true)}
          />
        </section>

        {/* MAIN SECTION 4: MODEL STATUS (TRI-MODEL VERIFICATION) */}
        <section className="h-full" aria-label="Model Status & Weights Comparison">
          <ModelStatus
            modelData={modelData}
            onOpenVerificationModal={() => setVerificationModalOpen(true)}
          />
        </section>
      </div>

      {/* MAIN SECTION 2: RECENT DELETIONS & AUDIT LOG */}
      <section id="recent-deletions-section" aria-label="Recent Deletion Requests and Verification Audit">
        <RecentDeletions
          deletions={deletions}
          onSelectDeletion={(del) => setSelectedDeletionForDetail(del)}
        />
      </section>

      {/* MODALS */}
      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onExecuteDeletion={handleExecuteDeletion}
      />

      <DataLineageModal
        isOpen={lineageModalOpen}
        onClose={() => setLineageModalOpen(false)}
      />

      <RunVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
      />

      <DeletionDetailModal
        deletion={selectedDeletionForDetail}
        isOpen={!!selectedDeletionForDetail}
        onClose={() => setSelectedDeletionForDetail(null)}
      />
    </div>
  )
}
