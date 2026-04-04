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
      <div className="grid-responsive gsap-stagger-container">
        {features.map((feature) => {
          const unlocked = isFeatureUnlocked(feature.id, feature.name)
          return (
            <div
              key={feature.id}
              className={cn(
                'bg-black rounded-[2rem] p-6 flex flex-col gsap-stagger-item shadow-[0_0_15px_rgba(29,185,84,0.1)] border border-primary/50 transition-colors hover:border-primary',
                !unlocked &&
                  'opacity-60 grayscale cursor-not-allowed hover:border-primary/50 hover:shadow-[0_0_15px_rgba(29,185,84,0.1)]',
              )}
            >
              <div className="pb-2">
                <div className="flex justify-between items-start">
                  <div
                    className={cn(
                      'p-3 rounded-[1rem]',
                      unlocked
                        ? 'bg-primary/10 text-primary'
                        : 'bg-zinc-800/50 text-muted-foreground',
                    )}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  {unlocked ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 flex items-center gap-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Acesso
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-white/10 text-muted-foreground flex items-center gap-1 rounded-full"
                    >
                      <Lock className="w-3 h-3" /> Upgrade
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-white mt-4">
                  {feature.name}
                </h3>
              </div>
              <div className="mt-2">
                <p className="text-sm text-[#A0A0A0] line-clamp-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
