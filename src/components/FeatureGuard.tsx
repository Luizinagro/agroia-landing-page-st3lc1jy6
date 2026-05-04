import { Navigate, useLocation } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSubscription'
import { Tractor } from 'lucide-react'

interface FeatureGuardProps {
  children: React.ReactNode
  feature: string
  requiredPlan?: string
}

export function FeatureGuard({ children, feature, requiredPlan }: FeatureGuardProps) {
  const { hasFeature, loading } = useSubscription()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Tractor className="w-12 h-12 text-secondary animate-pulse" />
      </div>
    )
  }

  if (!hasFeature(feature)) {
    return (
      <Navigate
        to="/bloqueado"
        state={{
          blockedFeature: feature,
          requiredPlan: requiredPlan || 'Completo',
          from: location.pathname,
        }}
        replace
      />
    )
  }

  return <>{children}</>
}
