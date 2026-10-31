import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useDashboard } from '../../context/DashboardContext'
import DeleteUserModal from '../modals/DeleteUserModal'
import DataLineageModal from '../modals/DataLineageModal'
import RunVerificationModal from '../modals/RunVerificationModal'
import DeletionDetailModal from '../modals/DeletionDetailModal'

/**
 * Master FORGETGRAPH Layout Component
 * Fixed sidebar, top navbar, responsive viewport, cybersecurity theme.
 */
export default function Layout() {
  const {
    deleteModalOpen,
    setDeleteModalOpen,
    lineageModalOpen,
    setLineageModalOpen,
    verificationModalOpen,
    setVerificationModalOpen,
    selectedDeletionDetail,
    setSelectedDeletionDetail,
    executeDeletion,
  } = useDashboard()

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F1F5F9] flex selection:bg-emerald-500/30 selection:text-white font-sans bg-cyber-grid">
      {/* 1. Fixed Sidebar Navigation (Desktop) & Responsive Drawer (Mobile) */}
      <Sidebar />

      {/* 2. Main Dashboard Content Column (Shifted right on desktop by sidebar width) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72 transition-all">
        {/* Top Protocol Announcement Bar */}
        <div className="bg-[#0B1120] border-b border-[#16233B] py-1 px-4 text-center text-[11px] text-slate-400 font-mono">
          <span className="font-semibold text-emerald-400">FORGETGRAPH (PS09)</span>: Active Dependency-Aware Data Deletion Verification.{' '}
          <span className="text-slate-400 hidden sm:inline">
            “Prove the deletion. Don’t just claim it.”
          </span>
        </div>

        {/* Top Navbar */}
        <Navbar />

        {/* Main Dashboard Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>

        {/* Global Minimal Footer */}
        <footer className="border-t border-[#16233B] bg-[#080C14] py-5 px-4 text-xs text-slate-400 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-white font-bold tracking-wider">FORGETGRAPH</span>
              <span className="text-slate-400">/</span>
              <span>PS09 Deletion Verification Protocol</span>
              <span className="text-slate-400">/</span>
              <span className="text-emerald-400">Strict L2 Weight Invariance (τ = 10⁻⁵)</span>
            </div>
            <div className="text-[10px] text-slate-400">
              SQLite primary DB · Scikit-Learn Ridge Regressor · Cryptographic Tombstone Barrier
            </div>
          </div>
        </footer>
      </div>

      {/* Global Interactive Modals */}
      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onExecuteDeletion={(del) => {
          executeDeletion(del.userId, 'User initiated purge request')
        }}
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
        deletion={selectedDeletionDetail}
        isOpen={!!selectedDeletionDetail}
        onClose={() => setSelectedDeletionDetail(null)}
      />
    </div>
  )
}
