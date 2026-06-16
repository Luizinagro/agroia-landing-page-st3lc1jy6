import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSubscription'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface FeatureGuardProps {
  children: ReactNode
  feature: string
  requiredPlan?: string
}

export function FeatureGuard({ children, feature }: FeatureGuardProps) {
  const { hasFeature, loading, currentPlanName, getMinimumPlan } = useSubscription()

  if (loading) return null

  if (!hasFeature(feature)) {
    const minPlan = getMinimumPlan ? getMinimumPlan(feature) : 'Superior'

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-200">
        <div className="bg-[#0D1F0D] border border-[#2E5A1A] rounded-[16px] p-[40px] max-w-[420px] w-full text-center flex flex-col items-center shadow-2xl">
          <Lock className="w-[48px] h-[48px] text-[#6DBF4A] mb-4" />
          <h2 className="text-[#F5F0E8] text-xl font-bold mb-2">
            Este módulo não está incluído no seu plano atual
          </h2>
          <p className="text-[#A8B8A0] mb-6 text-sm">
            Você está no plano: <strong className="text-[#F5F0E8]">{currentPlanName}</strong>
            <br />
            Este recurso está disponível a partir do plano:{' '}
            <strong className="text-[#F5F0E8]">{minPlan}</strong>
          </p>
          <Button
            asChild
            className="w-full bg-[#6DBF4A] hover:bg-[#5CA83A] text-[#0A1A0A] font-bold mb-3 h-12"
          >
            <Link to="/selecionar-plano">Ver Planos e Fazer Upgrade →</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full text-[#A8B8A0] hover:text-[#F5F0E8] hover:bg-[#1A3A0A]"
          >
            <Link to="/dashboard">Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
