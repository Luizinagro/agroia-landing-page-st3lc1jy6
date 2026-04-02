import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Básico',
    price: 'Grátis',
    period: '',
    level: 0,
    features: ['dashboard'],
    featureLabels: ['Dashboard Básico', 'Suporte Básico'],
  },
  {
    name: 'Plantio Solo',
    price: 'R$ 147',
    period: '/mês',
    level: 1,
    features: ['dashboard', 'roi', 'loja'],
    featureLabels: ['Previsão IA', 'Calculadora de ROI', 'Loja de Insumos'],
  },
  {
    name: 'Pecuário Solo',
    price: 'R$ 147',
    period: '/mês',
    level: 1,
    features: ['dashboard', 'pecuaria', 'rastreabilidade', 'loja'],
    featureLabels: ['Rastreabilidade', 'Loja de Insumos', 'Gestão Pecuária'],
  },
  {
    name: 'Completo',
    price: 'R$ 347',
    period: '/mês',
    level: 2,
    features: ['dashboard', 'roi', 'loja', 'pecuaria', 'rastreabilidade'],
    featureLabels: ['Previsão IA', 'Rastreabilidade', 'Calculadora de ROI', 'Loja de Insumos'],
  },
  {
    name: 'Família Coop',
    price: 'R$ 747',
    period: '/mês',
    level: 3,
    features: ['dashboard', 'roi', 'loja', 'pecuaria', 'rastreabilidade', 'multi_propriedade'],
    featureLabels: [
      'Previsão IA',
      'Rastreabilidade',
      'Calculadora de ROI',
      'Loja de Insumos',
      'Até 5 propriedades',
    ],
  },
]

export default function Planos() {
  const { user } = useAuth()
  const { plan: currentPlan, loading: loadingPlan } = useSubscription()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [updating, setUpdating] = useState<string | null>(null)

  const currentPlanName = currentPlan?.plan_name || user?.plan_active || 'Básico'
  const currentPlanLevel = PLANS.find((p) => p.name === currentPlanName)?.level || 0

  const handleUpgrade = async (selectedPlan: (typeof PLANS)[0]) => {
    if (!user?.id) return
    setUpdating(selectedPlan.name)

    try {
      // Atualizar user_plans
      if (currentPlan?.id) {
        const { error } = await supabase
          .from('user_plans')
          .update({
            plan_name: selectedPlan.name,
            plan_features: selectedPlan.features,
          })
          .eq('id', currentPlan.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('user_plans').insert({
          user_id: user.id,
          plan_name: selectedPlan.name,
          plan_features: selectedPlan.features,
        })
        if (error) throw error
      }

      // Sincronizar campo redundante na tabela users
      await supabase.from('users').update({ plan_active: selectedPlan.name }).eq('id', user.id)

      toast({
        title: 'Plano atualizado com sucesso!',
        description: `Seu novo plano é o ${selectedPlan.name}. Aproveite as novas ferramentas!`,
        className: 'bg-[#1a3c34] text-white border-[#f4d03f]',
      })

      // Force reload to update all subscription contexts immediately
      window.location.assign('/dashboard')
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao atualizar plano',
        description: 'Não foi possível completar a transação no momento. Tente novamente.',
        variant: 'destructive',
      })
      setUpdating(null)
    }
  }

  if (loadingPlan) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a3c34]" />
      </div>
    )
  }

  return (
    <div className="container py-12 px-4 md:px-6 mx-auto animate-in fade-in duration-500">
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-[#1a3c34]">Evolua sua Gestão</h1>
        <p className="text-lg text-muted-foreground">
          Escolha o plano ideal para a sua propriedade e libere todo o potencial da inteligência
          artificial e rastreabilidade no campo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 max-w-[1400px] mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = plan.name === currentPlanName
          const isSuperior = plan.level > currentPlanLevel

          let btnText = 'Mudar Plano'
          if (isCurrent) btnText = 'Seu Plano Atual'
          else if (isSuperior) btnText = 'Fazer Upgrade'

          return (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden',
                isCurrent
                  ? 'border-2 border-[#1a3c34] shadow-md bg-green-50/20'
                  : 'border border-border',
                plan.name === 'Completo' && !isCurrent ? 'border-[#f4d03f] border-2 shadow-lg' : '',
              )}
            >
              {isCurrent && (
                <div className="absolute top-0 inset-x-0 bg-[#1a3c34] text-[#f4d03f] text-center py-1.5 text-xs font-bold uppercase tracking-wider">
                  Seu Plano Atual
                </div>
              )}
              {plan.name === 'Completo' && !isCurrent && (
                <div className="absolute top-0 inset-x-0 bg-[#f4d03f] text-[#1a3c34] text-center py-1 text-xs font-bold flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" /> Mais Escolhido
                </div>
              )}

              <CardHeader
                className={cn('pb-4', isCurrent || plan.name === 'Completo' ? 'pt-10' : 'pt-6')}
              >
                <CardTitle className="text-xl text-[#1a3c34]">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-[#1a3c34]">
                  {plan.price}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 pb-6">
                <ul className="space-y-4">
                  {plan.featureLabels.map((feat, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-[#f4d03f] shrink-0 mr-3 mt-0.5" />
                      <span className="text-sm font-medium text-zinc-700">{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  className={cn(
                    'w-full h-11 text-sm font-bold transition-colors',
                    isCurrent
                      ? 'bg-zinc-100 text-zinc-500 hover:bg-zinc-100 cursor-not-allowed'
                      : plan.name === 'Completo'
                        ? 'bg-[#f4d03f] text-[#1a3c34] hover:bg-[#f4d03f]/90'
                        : 'bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90',
                  )}
                  disabled={isCurrent || updating !== null}
                  onClick={() => handleUpgrade(plan)}
                >
                  {updating === plan.name ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  {btnText}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
