import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Tractor } from 'lucide-react'

export function ProtectedRoute({ requireActive = true }: { requireActive?: boolean }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Tractor className="w-12 h-12 text-secondary animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireActive && user.data_trial_expira && new Date(user.data_trial_expira) < new Date()) {
    return <Navigate to="/selecionar-plano" replace />
  }

  return <Outlet />
}
