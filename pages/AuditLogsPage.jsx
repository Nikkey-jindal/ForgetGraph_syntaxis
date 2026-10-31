import React, { useState } from 'react'
import {
  FileText,
  Ban,
  ShieldAlert,
  Search,
  Filter,
  Download,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Database,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useDashboard } from '../context/DashboardContext'

export default function AuditLogsPage() {
  const { tombstones, auditLogs, stats, testReingestion } = useDashboard()
  const [activeTab, setActiveTab] = useState('tombstones') // 'tombstones' | 'reingest' | 'events'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStep, setFilterStep] = useState('ALL')

  // Re-ingestion form state
  const [testUid, setTestUid] = useState(42)
  const [testAge, setTestAge] = useState(35)
  const [testBalance, setTestBalance] = useState(5000.0)
  const [testTx, setTestTx] = useState(40)
  const [testTenure, setTestTenure] = useState(700)
  const [testRisk, setTestRisk] = useState(50.0)
  const [reingestResult, setReingestResult] = useState(null)

  // Quick fill buttons
  const handleSetDeletedId = () => {
    if (tombstones.length > 0) {
      setTestUid(tombstones[0].userId)
    }
  }

  const handleSetFreshId = () => {
    setTestUid(5000)
  }

  const handleRunReingestTest = async (e) => {
    e.preventDefault()
    const outcome = await testReingestion({
      id: testUid,
      age: testAge,
      account_balance: testBalance,
      num_transactions: testTx,
      tenure_days: testTenure,
      risk_score: testRisk,
    })
    setReingestResult(outcome)
  }

  // Filtered audit events
  const filteredEvents = auditLogs.filter((evt) => {
    const matchesSearch =
      String(evt.userId).includes(searchQuery) ||
      evt.stepName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.details?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
    if (filterStep !== 'ALL' && evt.stepName !== filterStep) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs & Cryptographic Tombstones"
        subtitle="Permanent tamper-evident blacklist of deleted IDs, automated re-ingestion prevention barrier, and verified unlearning audit trail."
        category="DEFENSE GRID / AUDIT LOGS"
        badge="Permanent Blacklist Active"
        badgeVariant="amber"
      />

      {/* Top 3 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Tombstoned IDs
            </div>
            <div className="text-2xl font-extrabold text-white font-heading mt-0.5">
              {tombstones.length} Users
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Permanent cryptographic blacklist
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Blocked Re-Ingestions
            </div>
            <div className="text-2xl font-extrabold text-amber-300 font-heading mt-0.5">
              {auditLogs.filter((a) => a.stepName === 'reingestion_blocked').length} Attempts
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              API gateway security barrier
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400">
            <Ban className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Integrity Standard
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-heading mt-0.5">
              SHA-256
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Tamper-evident ledger hashing
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1A2744] pb-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('tombstones')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'tombstones'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Tombstone Registry ({tombstones.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reingest')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'reingest'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Re-Ingestion Security Barrier Test
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'events'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Full Event Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: Tombstone Registry */}
      {activeTab === 'tombstones' && (
        <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A2744] mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                Cryptographic Tombstone Blacklist
              </h3>
              <p className="text-xs text-slate-400">
                Permanently banned user IDs protected by cryptographic tamper-evident hashes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert('Exporting tombstone registry as CSV...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142036] hover:bg-[#1A2744] border border-[#1E2D4A] text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Tombstones (.csv)</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#1A2744]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#080C14] text-slate-400 border-b border-[#1A2744] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Tombstoned User ID</th>
                  <th className="py-3 px-4">Purge Timestamp</th>
                  <th className="py-3 px-4">Cryptographic Digest (SHA-256)</th>
                  <th className="py-3 px-4">Legal Reason</th>
                  <th className="py-3 px-4 text-right">Blocked Ingestions</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16233B] bg-[#0E1626]">
                {tombstones.map((t) => (
                  <tr key={t.userId} className="hover:bg-[#142036]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>USR-{String(t.userId).padStart(4, '0')}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{t.deletedAt}</td>
                    <td className="py-3 px-4 text-emerald-400/90 font-mono text-[11px] truncate max-w-xs" title={t.sha256Hash}>
                      {t.sha256Hash.substring(0, 24)}...
                    </td>
                    <td className="py-3 px-4 text-slate-300">{t.reason}</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-400">
                      {t.attemptsBlocked} attempts
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge variant="amber" size="sm">
                        PERMANENT BAN
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Re-Ingestion Security Barrier Test */}
      {activeTab === 'reingest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
            <div className="pb-3 border-b border-[#1A2744] mb-4">
              <h3 className="text-sm sm:text-base font-bold text-white font-heading flex items-center gap-2">
                <Ban className="w-4 h-4 text-amber-400" />
                Re-Ingestion Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Attempt to insert a user record. The tombstone barrier ensures forgotten IDs are rejected.
              </p>
            </div>

            <form onSubmit={handleRunReingestTest} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Target User ID:</label>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  value={testUid}
                  onChange={(e) => setTestUid(Number(e.target.value))}
                  className="w-full bg-[#080C14] border border-[#1A2744] rounded-lg px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Quick Fill Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSetDeletedId}
                  className="py-1.5 px-2 rounded-lg bg-[#142036] hover:bg-[#1A2744] border border-[#1E2D4A] text-amber-300 text-[11px] transition-colors"
                >
                  Fill Tombstoned (42)
                </button>
                <button
                  type="button"
                  onClick={handleSetFreshId}
                  className="py-1.5 px-2 rounded-lg bg-[#142036] hover:bg-[#1A2744] border border-[#1E2D4A] text-emerald-300 text-[11px] transition-colors"
                >
                  Fill Fresh ID (5000)
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#16233B]">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider">Record Attributes:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block">Age:</label>
                    <input
                      type="number"
                      value={testAge}
                      onChange={(e) => setTestAge(Number(e.target.value))}
                      className="w-full bg-[#080C14] border border-[#1A2744] rounded px-2 py-1 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block">Balance ($):</label>
                    <input
                      type="number"
                      value={testBalance}
                      onChange={(e) => setTestBalance(Number(e.target.value))}
                      className="w-full bg-[#080C14] border border-[#1A2744] rounded px-2 py-1 text-slate-200"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer active:scale-98"
              >
                Attempt Record Insertion
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
            <div className="pb-3 border-b border-[#1A2744] mb-4">
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                Barrier Outcome Telemetry
              </h3>
              <p className="text-xs text-slate-400">
                Live feedback from the API gateway ingestion interceptor.
              </p>
            </div>

            {reingestResult ? (
              <div className={`p-4 rounded-xl border font-mono text-xs ${
                reingestResult.outcome === 'blocked'
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  {reingestResult.outcome === 'blocked' ? (
                    <>
                      <Ban className="w-4 h-4 text-rose-400" />
                      <span>SECURITY BARRIER ENFORCED: RE-INGESTION REJECTED</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>RECORD ACCEPTED & INSERTED</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {reingestResult.message}
                </p>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 font-mono text-xs border border-dashed border-[#1A2744] rounded-xl">
                Select a user ID and click "Attempt Record Insertion" to test the security barrier.
              </div>
            )}

            {/* Recent Blocked Ingestions List */}
            <div className="mt-5">
              <div className="text-xs font-bold text-white font-heading mb-2">
                Recent Barrier Interceptions:
              </div>
              <div className="space-y-2">
                {auditLogs
                  .filter((a) => a.stepName === 'reingestion_blocked')
                  .slice(0, 5)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-[#080C14] border border-[#1A2744] flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <Ban className="w-3.5 h-3.5 text-rose-400" />
                        <span className="font-bold text-white">USR-{String(log.userId).padStart(4, '0')}</span>
                        <span className="text-slate-400 truncate max-w-sm">Re-ingestion blocked</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Full Event Audit Trail */}
      {activeTab === 'events' && (
        <div className="rounded-xl bg-[#0E1626] border border-[#1A2744] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A2744] mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                Chronological Pipeline Event Ledger
              </h3>
              <p className="text-xs text-slate-400">
                Immutable event trail of all deletion steps, model retraining, and verification checks.
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user ID or step..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#080C14] border border-[#1A2744] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={filterStep}
                onChange={(e) => setFilterStep(e.target.value)}
                className="bg-[#080C14] border border-[#1A2744] rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Steps</option>
                <option value="source_removed">source_removed</option>
                <option value="features_recomputed">features_recomputed</option>
                <option value="cache_invalidated">cache_invalidated</option>
                <option value="model_retrained">model_retrained</option>
                <option value="verification_run">verification_run</option>
                <option value="tombstone_recorded">tombstone_recorded</option>
                <option value="reingestion_blocked">reingestion_blocked</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#1A2744]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#080C14] text-slate-400 border-b border-[#1A2744] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Pipeline Step</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Event Telemetry Details</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16233B] bg-[#0E1626]">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#142036]/60 transition-colors">
                    <td className="py-3 px-4 text-slate-400">#{evt.id}</td>
                    <td className="py-3 px-4 font-bold text-white">
                      USR-{String(evt.userId).padStart(4, '0')}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      {evt.stepName}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{evt.timestamp}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-md truncate" title={evt.details}>
                      {evt.details}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge
                        variant={
                          evt.status === 'PASS' || evt.status === 'OK'
                            ? 'emerald'
                            : evt.status === 'BLOCKED'
                            ? 'amber'
                            : 'rose'
                        }
                        size="sm"
                      >
                        {evt.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
