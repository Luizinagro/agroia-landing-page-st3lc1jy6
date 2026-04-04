import { Dock } from '@/components/ui/dock-two'
import {
  LayoutDashboard,
  Calculator,
  BrainCircuit,
  Store,
  Users,
  Settings,
  Tractor,
  ActivitySquare,
  Beef,
  MessageSquare,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'

export function AppDock() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth() as any
  const { plan } = useSubscription()

  const isAdmin = user?.user_type === 'admin' || user?.tipo_usuario === 'admin'
  const planName = plan?.plan_name || 'Básico'

  const hasAccess = (requiredPlan: string[]) => {
    if (isAdmin) return true
    return requiredPlan.includes(planName)
  }

  const items = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
      isActive: location.pathname === '/dashboard',
    },
    {
      icon: Calculator,
      label: 'Calculadora ROI',
      onClick: () => navigate('/roi'),
      isActive: location.pathname === '/roi',
    },
    {
      icon: BrainCircuit,
      label: 'Previsão IA',
      onClick: () => {
        if (hasAccess(['Completo', 'Pecuário Solo', 'Plantio Solo', 'Família Coop'])) {
          navigate('/previsao-ia')
        } else {
          navigate('/dashboard', { state: { blockedFeature: true } })
        }
      },
      isActive: location.pathname === '/previsao-ia',
    },
    {
      icon: Tractor,
      label: 'Insumos',
      onClick: () => navigate('/insumos'),
      isActive: location.pathname === '/insumos',
    },
    {
      icon: ActivitySquare,
      label: 'Rastreabilidade',
      onClick: () => {
        if (hasAccess(['Completo', 'Plantio Solo'])) {
          navigate('/rastreabilidade')
        } else {
          navigate('/dashboard', { state: { blockedFeature: true } })
        }
      },
      isActive: location.pathname === '/rastreabilidade',
    },
    {
      icon: Beef,
      label: 'Pecuária',
      onClick: () => {
        if (hasAccess(['Completo', 'Pecuário Solo'])) {
          navigate('/pecuaria')
        } else {
          navigate('/dashboard', { state: { blockedFeature: true } })
        }
      },
      isActive: location.pathname === '/pecuaria',
    },
    {
      icon: Users,
      label: 'CRM / Gestão',
      onClick: () => {
        if (hasAccess(['Completo', 'Família Coop'])) {
          navigate('/crm')
        } else {
          navigate('/dashboard', { state: { blockedFeature: true } })
        }
      },
      isActive: location.pathname === '/crm',
    },
    {
      icon: MessageSquare,
      label: 'Comunidade',
      onClick: () => navigate('/comunidade'),
      isActive: location.pathname === '/comunidade',
    },
    {
      icon: Store,
      label: 'Loja',
      onClick: () => navigate('/loja'),
      isActive: location.pathname === '/loja',
    },
    {
      icon: Settings,
      label: 'Perfil',
      onClick: () => navigate('/perfil'),
      isActive: location.pathname === '/perfil',
    },
  ]

  return <Dock items={items} />
}
