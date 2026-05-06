/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Dashboard from './pages/Dashboard'
import DashboardConsolidado from './pages/DashboardConsolidado'
import Community from './pages/Community'
import Billing from './pages/Billing'
import Pecuaria from './pages/Pecuaria'
import PlanSelection from './pages/PlanSelection'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { DatabaseProvider } from './contexts/DatabaseContext'
import { CartProvider } from './contexts/CartContext'
import Store from './pages/Store'
import Checkout from './pages/Checkout'
import BlockedAccess from './pages/BlockedAccess'
import CalculadoraRoi from './pages/CalculadoraRoi'
import MeusCalculos from './pages/MeusCalculos'
import Planos from './pages/Planos'
import Profile from './pages/Profile'
import PrevisaoIA from './pages/PrevisaoIA'
import Rastreabilidade from './pages/Rastreabilidade'
import CRM from './pages/CRM'
import AnaliseSatelite from './pages/AnaliseSatelite'
import SharedAnalysis from './pages/SharedAnalysis'
import ConsultorPerformance from './pages/ConsultorPerformance'
import ConsultorIAAgro from './pages/ConsultorIAAgro'
import { FeatureGuard } from './components/FeatureGuard'
// ONLY IMPORT AND RENDER WORKING PAGES, NEVER ADD PLACEHOLDER COMPONENTS OR PAGES IN THIS FILE
// AVOID REMOVING ANY CONTEXT PROVIDERS FROM THIS FILE (e.g. TooltipProvider, Toaster, Sonner)

const App = () => {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <CartProvider>
          <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  <Route element={<ProtectedRoute />}>
                    <Route
                      path="/dashboard-consolidado"
                      element={
                        <FeatureGuard feature="dashboard">
                          <DashboardConsolidado />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <FeatureGuard feature="dashboard">
                          <Dashboard />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/comunidade"
                      element={
                        <FeatureGuard feature="comunidade">
                          <Community />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/faturamento"
                      element={
                        <FeatureGuard feature="faturamento" requiredPlan="Completo">
                          <Billing />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/pecuaria"
                      element={
                        <FeatureGuard feature="pecuaria" requiredPlan="Pecuário Solo">
                          <Pecuaria />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/rastreabilidade"
                      element={
                        <FeatureGuard feature="rastreabilidade" requiredPlan="Pecuário Solo">
                          <Rastreabilidade />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/loja"
                      element={
                        <FeatureGuard feature="loja" requiredPlan="Plantio Solo">
                          <Store />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <FeatureGuard feature="checkout" requiredPlan="Completo">
                          <Checkout />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/roi"
                      element={
                        <FeatureGuard feature="roi" requiredPlan="Plantio Solo">
                          <CalculadoraRoi />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/meus-calculos"
                      element={
                        <FeatureGuard feature="meus-calculos" requiredPlan="Completo">
                          <MeusCalculos />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/previsao-ia"
                      element={
                        <FeatureGuard feature="previsao-ia" requiredPlan="Plantio Solo">
                          <PrevisaoIA />
                        </FeatureGuard>
                      }
                    />
                    <Route path="/bloqueado" element={<BlockedAccess />} />
                    <Route path="/planos" element={<Planos />} />
                    <Route path="/perfil" element={<Profile />} />
                    <Route
                      path="/crm"
                      element={
                        <FeatureGuard feature="crm" requiredPlan="Completo">
                          <CRM />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/analise-satelite"
                      element={
                        <FeatureGuard feature="analise-satelite" requiredPlan="Completo">
                          <AnaliseSatelite />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/analises-compartilhadas"
                      element={
                        <FeatureGuard feature="analise-compartilhada" requiredPlan="Completo">
                          <ConsultorPerformance />
                        </FeatureGuard>
                      }
                    />
                    <Route
                      path="/consultor-ia-agro"
                      element={
                        <FeatureGuard feature="consultor-ia-agro" requiredPlan="Completo">
                          <ConsultorIAAgro />
                        </FeatureGuard>
                      }
                    />
                  </Route>

                  <Route element={<ProtectedRoute requireActive={false} />}>
                    <Route path="/selecionar-plano" element={<PlanSelection />} />
                  </Route>

                  <Route path="/analise-compartilhada/:id" element={<SharedAnalysis />} />

                  {/* ADD ALL CUSTOM ROUTES MUST BE ADDED HERE */}
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </CartProvider>
      </DatabaseProvider>
    </AuthProvider>
  )
}

export default App
