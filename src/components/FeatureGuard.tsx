import { Navigate, useLocation } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSubscription'
import { useAuth } from '@/contexts/AuthContext'
import { Tractor } from 'lucide-react'

interface FeatureGuardProps {
  feature: string
  requiredPlan: string
  children: React.ReactNode
}

export function FeatureGuard({ feature, requiredPlan, children }: FeatureGuardProps) {
  const { loading, hasFeature } = useSubscription()
  const { loading: authLoading } = useAuth() as any
  const location = useLocation()

  if (loading || authLoading) {
    return (
      <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center p-8">
        <Tractor className="w-12 h-12 text-green-600 animate-pulse mb-4" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          Verificando permissões de acesso...
        </p>
      </div>
    )
  }

  if (!hasFeature(feature)) {
    return <Navigate to="/bloqueado" state={{ requiredPlan, from: location.pathname }} replace />
  }

  return <>{children}</>
}
