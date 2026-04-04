import { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children?: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#000000]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
      </div>
    )
  }

  // Verifica se o usuário existe e possui o tipo 'admin'
  const isAdmin = user && (user.tipo_usuario === 'admin' || user.user_type === 'admin')

  if (!isAdmin) {
    // Se não for admin, redireciona para o dashboard comum de produtor
    return <Navigate to="/dashboard" replace />
  }

  // Se for admin, renderiza a rota do CRM
  return children ? <>{children}</> : <Outlet />
}
