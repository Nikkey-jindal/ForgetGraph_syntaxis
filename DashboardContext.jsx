import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  INITIAL_TOP_STATS,
  INITIAL_SYSTEM_HEALTH,
  PIPELINE_STAGES,
  INITIAL_RECENT_DELETIONS,
  INITIAL_MODEL_STATUS,
  INITIAL_TOMBSTONES,
  INITIAL_AUDIT_LOGS,
  SAMPLE_USERS,
} from '../data/forgetGraphData'

const DashboardContext = createContext(null)

export function DashboardProvider({ children }) {
  // Core reactive dashboard state
  const [stats, setStats] = useState(INITIAL_TOP_STATS)
  const [systems, setSystems] = useState(INITIAL_SYSTEM_HEALTH)
  const [deletions, setDeletions] = useState(INITIAL_RECENT_DELETIONS)
  const [modelData, setModelData] = useState(INITIAL_MODEL_STATUS)
  const [tombstones, setTombstones] = useState(INITIAL_TOMBSTONES)
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS)
  const [activeUsersList, setActiveUsersList] = useState(SAMPLE_USERS)

  // Navigation and UI state
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [lineageModalOpen, setLineageModalOpen] = useState(false)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)
  const [selectedDeletionDetail, setSelectedDeletionDetail] = useState(null)

  // Refresh systems telemetry
  const refreshDiagnostics = useCallback(() => {
    setSystems((prev) =>
      prev.map((s) => ({
        ...s,
        lastChecked: 'Just now',
      }))
    )
  }, [])

  // Execute full 6-stage deletion pipeline
  const executeDeletion = useCallback((userId, reason = 'GDPR Right to Be Forgotten (Art. 17)') => {
    const numericId = Number(userId)
    const now = new Date()
    const tsStr = now.toISOString().replace('T', ' ').substring(0, 19)

    // Check if user is already tombstoned
    const alreadyTombstoned = tombstones.some((t) => t.userId === numericId)
    if (alreadyTombstoned) {
      return {
        success: false,
        status: 'already_deleted',
        message: `User ${numericId} is already tombstoned in the verification database.`,
      }
    }

    // Mathematical simulation:
    // User 87 triggers simulated residual audit divergence to demonstrate PS09 catching failure;
    // other users pass the strict L2 unlearning tolerance (gap <= 1.0e-5)
    const isPassing = numericId !== 87
    const deltaW = isPassing ? '0.000002' : '0.048210'

    // 1. Create Deletion record
    const newDeletionRecord = {
      id: `del-${Date.now().toString().slice(-4)}`,
      userId: numericId,
      userCode: `USR-${String(numericId).padStart(4, '0')}`,
      timestamp: tsStr,
      relativeTime: 'Just now',
      deletionStatus: 'Completed',
      verificationResult: isPassing ? 'Verified PASS' : 'VERIFICATION FAILED',
      isPassed: isPassing,
      maxDelta: deltaW,
      tolerance: '0.000010',
      notes: isPassing
        ? 'Exact unlearning match. Max coefficient delta is within tolerance.'
        : 'Audit Warning: Model weights diverged from reference. Residue detected in balance_log weight.',
      details: {
        sourceRemoved: true,
        featuresRecomputed: true,
        cachePurged: true,
        modelRetrained: true,
        tombstoneCreated: true,
      },
    }

    // 2. Create Tombstone record
    const newTombstone = {
      userId: numericId,
      deletedAt: tsStr,
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      reason,
      enforcedBy: 'SecOps-Auditor-01',
      attemptsBlocked: 0,
    }

    // 3. Create Audit Log entries for the 6 stages
    const stepLogs = [
      {
        id: Date.now() + 6,
        userId: numericId,
        stepName: 'tombstone_recorded',
        status: 'OK',
        timestamp: tsStr,
        details: `Cryptographic tombstone hash ${newTombstone.sha256Hash.substring(0, 16)}... registered in SQLite barrier.`,
      },
      {
        id: Date.now() + 5,
        userId: numericId,
        stepName: 'verification_run',
        status: isPassing ? 'PASS' : 'FAIL',
        timestamp: tsStr,
        details: isPassing
          ? `Replacement model evaluated against ground-truth reference: Max gap ΔW = ${deltaW} <= 1.0e-5.`
          : `Residual memory audit caught divergence: Max gap ΔW = ${deltaW} exceeds 1.0e-5 tolerance.`,
      },
      {
        id: Date.now() + 4,
        userId: numericId,
        stepName: 'model_retrained',
        status: 'OK',
        timestamp: tsStr,
        details: `Ridge regression model refit on D \\ {${numericId}}. 4 weights + 1 intercept recalculated.`,
      },
      {
        id: Date.now() + 3,
        userId: numericId,
        stepName: 'cache_invalidated',
        status: 'OK',
        timestamp: tsStr,
        details: `Downstream cached predictions for user ${numericId} purged from memory.`,
      },
      {
        id: Date.now() + 2,
        userId: numericId,
        stepName: 'features_recomputed',
        status: 'OK',
        timestamp: tsStr,
        details: `Normalized age, log balance, and tx ratios recomputed without user ${numericId}.`,
      },
      {
        id: Date.now() + 1,
        userId: numericId,
        stepName: 'source_removed',
        status: 'OK',
        timestamp: tsStr,
        details: `Row atomically deleted from users table in SQLite database.`,
      },
    ]

    // 4. Update State
    setDeletions((prev) => [newDeletionRecord, ...prev])
    setTombstones((prev) => [newTombstone, ...prev])
    setAuditLogs((prev) => [...stepLogs, ...prev])
    setActiveUsersList((prev) =>
      prev.map((u) => (u.id === numericId ? { ...u, status: 'Tombstoned' } : u))
    )

    // 5. Update KPI Stats
    setStats((prev) => ({
      ...prev,
      activeUsers: Math.max(0, prev.activeUsers - 1),
      deletedUsers: prev.deletedUsers + 1,
      deletionRequests: prev.deletionRequests + 1,
      verifiedDeletions: {
        total: prev.verifiedDeletions.total + 1,
        passed: isPassing ? prev.verifiedDeletions.passed + 1 : prev.verifiedDeletions.passed,
        failed: !isPassing ? prev.verifiedDeletions.failed + 1 : prev.verifiedDeletions.failed,
        pending: 0,
      },
    }))

    // 6. Update Model Data
    setModelData((prev) => ({
      ...prev,
      replacementModel: {
        ...prev.replacementModel,
        trainedOn: `Pipeline retrained on D \\ {${numericId}} (${stats.activeUsers - 1} records)`,
        coefficients: {
          ...prev.replacementModel.coefficients,
          balance_log: isPassing
            ? prev.referenceModel.coefficients.balance_log
            : prev.replacementModel.coefficients.balance_log + 0.04821,
        },
      },
      maxGap: isPassing ? 0.000002 : 0.04821,
      verdict: isPassing ? 'PASS' : 'FAIL',
    }))

    return {
      success: true,
      status: 'deleted',
      isPassed: isPassing,
      maxDelta: deltaW,
      deletionRecord: newDeletionRecord,
    }
  }, [tombstones, stats.activeUsers])

  // Test Re-ingestion security barrier
  const testReingestion = useCallback((record) => {
    const numericId = Number(record.id)
    const now = new Date()
    const tsStr = now.toISOString().replace('T', ' ').substring(0, 19)

    // Check if ID is tombstoned
    const isTombstoned = tombstones.some((t) => t.userId === numericId)
    if (isTombstoned) {
      // Increment attempt counter on tombstone
      setTombstones((prev) =>
        prev.map((t) =>
          t.userId === numericId ? { ...t, attemptsBlocked: t.attemptsBlocked + 1 } : t
        )
      )

      // Add blocked attempt to audit logs
      const blockedLog = {
        id: Date.now(),
        userId: numericId,
        stepName: 'reingestion_blocked',
        status: 'BLOCKED',
        timestamp: tsStr,
        details: `Security Barrier Blocked: Attempt to re-ingest tombstoned user ID ${numericId} was rejected.`,
      }
      setAuditLogs((prev) => [blockedLog, ...prev])

      return {
        outcome: 'blocked',
        userId: numericId,
        message: `User ${numericId} is permanently tombstoned. Ingestion was rejected.`,
      }
    }

    // If ID already active in DB
    const isAlreadyActive = activeUsersList.some((u) => u.id === numericId && u.status === 'Active')
    if (isAlreadyActive) {
      return {
        outcome: 'blocked',
        userId: numericId,
        message: `User ID ${numericId} already exists as an active record.`,
      }
    }

    // Fresh ID -> Accepted
    const newUser = {
      id: numericId,
      age: Number(record.age) || 35,
      account_balance: Number(record.account_balance) || 5000.0,
      num_transactions: Number(record.num_transactions) || 40,
      tenure_days: Number(record.tenure_days) || 700,
      risk_score: Number(record.risk_score) || 50.0,
      status: 'Active',
    }

    setActiveUsersList((prev) => [newUser, ...prev])
    setStats((prev) => ({
      ...prev,
      totalUsers: prev.totalUsers + 1,
      activeUsers: prev.activeUsers + 1,
    }))

    const acceptLog = {
      id: Date.now(),
      userId: numericId,
      stepName: 'user_ingested',
      status: 'OK',
      timestamp: tsStr,
      details: `Fresh user ID ${numericId} accepted and inserted into users database.`,
    }
    setAuditLogs((prev) => [acceptLog, ...prev])

    return {
      outcome: 'accepted',
      userId: numericId,
      message: `User ${numericId} was fresh and successfully ingested into the users table.`,
    }
  }, [tombstones, activeUsersList])

  return (
    <DashboardContext.Provider
      value={{
        stats,
        systems,
        deletions,
        modelData,
        tombstones,
        auditLogs,
        activeUsersList,
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
        refreshDiagnostics,
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
