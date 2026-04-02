import { CheckCircle2, Lock, BrainCircuit, MapPin, Calculator, ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const features = [
  {
    id: 'previsao_ia',
    name: 'Previsão IA',
    icon: BrainCircuit,
    description: 'Previsões com Inteligência Artificial para sua lavoura.',
  },
  {
    id: 'rastreabilidade',
    name: 'Rastreabilidade',
    icon: MapPin,
    description: 'Acompanhe todo o ciclo de vida da sua produção.',
  },
  {
    id: 'roi',
    name: 'Calculadora de ROI',
    icon: Calculator,
    description: 'Calcule o retorno sobre investimento de suas safras.',
  },
  {
    id: 'loja',
    name: 'Loja de Insumos',
    icon: ShoppingCart,
    description: 'Acesso exclusivo para compra de insumos com desconto.',
  },
]

interface FeatureCardsProps {
  userPlan: any
  user: any
}

export const FeatureCards = ({ userPlan, user }: FeatureCardsProps) => {
  const isFeatureUnlocked = (featureId: string, featureName: string) => {
    if (!userPlan) {
      const currentPlan = user?.plan_active || user?.plano_ativo || 'Básico'
      if (currentPlan === 'Completo' || currentPlan === 'Família Coop') return true
      return false
    }

    if (Array.isArray(userPlan.plan_features)) {
      return (
        userPlan.plan_features.includes(featureId) || userPlan.plan_features.includes(featureName)
      )
    }

    if (userPlan.plan_name === 'Completo' || userPlan.plan_name === 'Família Coop') return true
    return false
  }

  return (
    <div className="space-y-4 animate-slide-up" style={{ animationDelay: '50ms' }}>
      <h2 className="text-xl font-bold text-[#1a3c34] flex items-center gap-2">
        Funcionalidades do seu Plano
      </h2>
      <div className="grid-responsive gsap-stagger-container">
        {features.map((feature) => {
          const unlocked = isFeatureUnlocked(feature.id, feature.name)
          return (
            <div
              key={feature.id}
              className={cn(
                'card-glass p-6 !rounded-[20px] flex flex-col gsap-stagger-item',
                !unlocked &&
                  'opacity-60 grayscale cursor-not-allowed hover:transform-none hover:shadow-none hover:border-white/10',
              )}
            >
              <div className="pb-2">
                <div className="flex justify-between items-start">
                  <div
                    className={cn(
                      'p-3 rounded-xl',
                      unlocked ? 'bg-agro-green/20 text-agro-green' : 'bg-white/10 text-white/50',
                    )}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  {unlocked ? (
                    <Badge className="bg-agro-green/20 text-agro-green border-agro-green/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Acesso
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-white/20 text-white/50 flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" /> Upgrade
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mt-4">{feature.name}</h3>
              </div>
              <div className="mt-2">
                <p className="text-sm text-white/60 line-clamp-2">{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
