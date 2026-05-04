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

  const hasPlan = !!(user?.plan_type || user?.plan_active || user?.plano_ativo)
  const isDismissed = sessionStorage.getItem('plan_dismissed') === 'true'
  const isAdmin = user?.user_type === 'admin' || user?.tipo_usuario === 'admin'

  // Redireciona para selecionar plano apenas se não tiver nenhum plano associado à conta e não tiver dispensado o aviso
  if (requireActive && !hasPlan && !isDismissed && !isAdmin) {
    return <Navigate to="/selecionar-plano" replace />
  }

  return <Outlet />
}
