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
      <div className="grid-responsive">
        {features.map((feature) => {
          const unlocked = isFeatureUnlocked(feature.id, feature.name)
          return (
            <Card
              key={feature.id}
              className={cn(
                'relative overflow-hidden transition-all duration-300 hover:shadow-md',
                !unlocked && 'opacity-80 grayscale-[0.5]',
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      unlocked ? 'bg-[#1a3c34]/10 text-[#1a3c34]' : 'bg-slate-100 text-slate-400',
                    )}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  {unlocked ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Liberado
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-500 hover:bg-slate-100 flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" /> Bloqueado
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base mt-3">{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm line-clamp-2">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
