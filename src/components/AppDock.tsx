import { Dock } from '@/components/ui/dock-two'
import {
  LayoutDashboard,
  Calculator,
  BrainCircuit,
  Store,
  Users,
  Settings,
  ActivitySquare,
  Beef,
  MessageSquare,
  Map as MapIcon,
  ClipboardList,
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

  const baseItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
      isActive: location.pathname === '/dashboard',
    },
    {
      icon: Store,
      label: 'Loja',
      onClick: () => navigate('/loja'),
      isActive: location.pathname === '/loja',
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
      icon: MapIcon,
      label: 'Satélite',
      onClick: () => {
        if (hasAccess(['Completo', 'Família Coop'])) {
          navigate('/analise-satelite')
        } else {
          navigate('/dashboard', { state: { blockedFeature: true } })
        }
      },
      isActive: location.pathname === '/analise-satelite',
    },
    {
      icon: MessageSquare,
      label: 'Comunidade',
      onClick: () => navigate('/comunidade'),
      isActive: location.pathname === '/comunidade',
    },
    {
      icon: ClipboardList,
      label: 'Gestão',
      onClick: () => {
        if (hasAccess(['Completo', 'Plantio Solo', 'Pecuário Solo', 'Família Coop'])) {
          navigate('/gestao')
        } else {
          navigate('/dashboard', { state: { blockedFeature: true } })
        }
      },
      isActive: location.pathname === '/gestao',
    },
    {
      icon: Settings,
      label: 'Perfil',
      onClick: () => navigate('/perfil'),
      isActive: location.pathname === '/perfil',
    },
  ]

  if (isAdmin) {
    baseItems.push({
      icon: Users,
      label: 'CRM / Gestão',
      onClick: () => navigate('/crm'),
      isActive: location.pathname === '/crm',
    })
  }

  return <Dock items={baseItems} />
}
