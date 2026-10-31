import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../api'
import { PIPELINE_STAGES } from '../data/forgetGraphData'

const DashboardContext = createContext(null)

const EMPTY_STATS = {
  total_users_seeded: 0,
  active_users: 0,
  tombstoned_users: 0,
  deleted_users: 0,
  feature_rows: 0,
  cached_predictions: 0,
  deletion_log_events: 0,
  verification_passed: 0,
  verification_failed: 0,
  reingestion_blocked: 0,
  model: null,
  pipeline_steps: [],
}

function deletionRecordFromApi(userId, deleteResult, logEvents) {
  const steps = logEvents.filter((e) => e.userId === Number(userId))
  const verification = deleteResult.verification
  return {
    id: `del-${userId}-${Date.now()}`,
    userId: Number(userId),
    userCode: `USR-${String(userId).padStart(4, '0')}`,
    timestamp: steps.length ? steps[steps.length - 1].timestamp : new Date().toISOString(),
    relativeTime: 'Just now',
    deletionStatus: deleteResult.status === 'deleted' ? 'Completed' : deleteResult.status,
    verificationResult: verification ? (verification.passed ? 'Verified PASS' : 'VERIFICATION FAILED') : deleteResult.status,
    isPassed: verification ? verification.passed : false,
    steps,
  }
}

export function DashboardProvider({ children }) {
  const [stats, setStats] = useState(EMPTY_STATS)
  const [deletions, setDeletions] = useState([])
  const [tombstones, setTombstones] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [verification, setVerification] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [lastDeleteResult, setLastDeleteResult] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [lineageModalOpen, setLineageModalOpen] = useState(false)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)
  const [selectedDeletionDetail, setSelectedDeletionDetail] = useState(null)
  const pollRef = useRef(null)

  const refreshAll = useCallback(async () => {
    try {
      const [s, log, tomb, ver] = await Promise.all([
        api.getStats(),
        api.getLog(300),
        api.getTombstones(),
        api.getVerification(),
      ])
      setStats(s)
      setAuditLogs(log.events)
      setTombstones(tomb.tombstones)
      setVerification(ver)
      setApiError(null)
    } catch (err) {
      setApiError(err.message)
    }
  }, [])

  useEffect(() => {
    refreshAll()
    pollRef.current = setInterval(refreshAll, 5000)
    return () => clearInterval(pollRef.current)
  }, [refreshAll])

  const executeDeletion = useCallback(
    async (userId) => {
      const result = await api.deleteUser(userId)
      await refreshAll()
      const log = await api.getLog(300)
      const events = log.events
      setDeletions((prev) => {
        const record = deletionRecordFromApi(userId, result, events)
        return [record, ...prev.filter((d) => d.userId !== Number(userId))]
      })
      setLastDeleteResult(result)
      return {
        success: result.status === 'deleted',
        status: result.status,
        isPassed: result.verification ? result.verification.passed : false,
        verification: result.verification,
        replacementModel: result.replacement_model,
      }
    },
    [refreshAll]
  )

  const testReingestion = useCallback(
    async (record) => {
      const userId = Number(record.id ?? record.userId)
      const outcome = await api.ingestUser({
        id: userId,
        age: Number(record.age) || 35,
        account_balance: Number(record.account_balance) || 5000.0,
        num_transactions: Number(record.num_transactions) || 40,
        tenure_days: Number(record.tenure_days) || 700,
        risk_score: Number(record.risk_score) || 50.0,
      })
      await refreshAll()
      return {
        outcome: outcome.outcome,
        userId,
        message:
          outcome.outcome === 'blocked'
            ? `User ${userId} is tombstoned in the DB. Ingestion was rejected by the backend.`
            : `Fresh user ID ${userId} accepted by the backend and inserted into users.`,
      }
    },
    [refreshAll]
  )

  return (
    <DashboardContext.Provider
      value={{
        stats,
        deletions,
        tombstones,
        auditLogs,
        verification,
        apiError,
        lastDeleteResult,
        stages: PIPELINE_STAGES,
        mobileNavOpen,
        setMobileNavOpen,
        deleteModalOpen,
        setDeleteModalOpen,
        lineageModalOpen,
        setLineageModalOpen,
        verificationModalOpen,
        setVerificationModalOpen,
        selectedDeletionDetail,
        setSelectedDeletionDetail,
        refreshDiagnostics: refreshAll,
        refreshAll,
        executeDeletion,
        testReingestion,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
