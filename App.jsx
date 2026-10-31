import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import OverviewPage from './pages/OverviewPage'
import DataLineagePage from './pages/DataLineagePage'
import DeleteUserPage from './pages/DeleteUserPage'
import VerificationCenterPage from './pages/VerificationCenterPage'
import ModelComparisonPage from './pages/ModelComparisonPage'
import AuditLogsPage from './pages/AuditLogsPage'
import FeaturesPage from './pages/FeaturesPage'
import PricingPage from './pages/PricingPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import { DashboardProvider } from './context/DashboardContext'

/**
 * Automatically scrolls window to top on route change.
 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Primary FORGETGRAPH Cybersecurity Dashboard Routes */}
            <Route index element={<OverviewPage />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="data-lineage" element={<DataLineagePage />} />
            <Route path="delete-user" element={<DeleteUserPage />} />
            <Route path="verification-center" element={<VerificationCenterPage />} />
            <Route path="model-comparison" element={<ModelComparisonPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />

            {/* Preserved Secondary Views */}
            <Route path="features" element={<FeaturesPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  )
}
