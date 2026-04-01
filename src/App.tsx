/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Dashboard from './pages/Dashboard'
import Community from './pages/Community'
import Billing from './pages/Billing'
import Pecuaria from './pages/Pecuaria'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Login from './pages/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { DatabaseProvider } from './contexts/DatabaseContext'

// ONLY IMPORT AND RENDER WORKING PAGES, NEVER ADD PLACEHOLDER COMPONENTS OR PAGES IN THIS FILE
// AVOID REMOVING ANY CONTEXT PROVIDERS FROM THIS FILE (e.g. TooltipProvider, Toaster, Sonner)

import { useEffect } from 'react'
import { logSystemEvent } from '@/lib/security'

const App = () => {
  useEffect(() => {
    // Infra Protection: Enforce HTTPS
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      logSystemEvent('SECURITY', 'Redirecionamento HTTP interceptado, forçando HTTPS.', 'system')
      window.location.href = window.location.href.replace('http:', 'https:')
    }
  }, [])

  return (
    <AuthProvider>
      <DatabaseProvider>
        <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/comunidade" element={<Community />} />
                  <Route path="/faturamento" element={<Billing />} />
                  <Route path="/pecuaria" element={<Pecuaria />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES MUST BE ADDED HERE */}
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </DatabaseProvider>
    </AuthProvider>
  )
}

export default App
