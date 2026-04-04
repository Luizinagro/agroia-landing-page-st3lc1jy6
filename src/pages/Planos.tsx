import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Básico',
    price: 'Grátis',
    period: '',
    level: 0,
    features: ['dashboard'],
    description: 'Comece sem custo e conheça a plataforma.',
    featureLabels: ['Acesso inicial à plataforma', 'Visão geral dos recursos', 'Entrada sem risco'],
  },
  {
    name: 'Plantio Solo',
    price: 'R$ 149',
    period: '/mês',
    level: 1,
    features: ['dashboard', 'roi', 'loja'],
    description: 'Mais controle e previsibilidade para sua lavoura.',
    featureLabels: [
      'Gestão focada em plantio',
      'Mais organização operacional',
      'Calculadora de ROI',
      'Loja de Insumos',
    ],
  },
  {
    name: 'Pecuária Solo',
    price: 'R$ 199',
    period: '/mês',
    level: 1,
    features: ['dashboard', 'pecuaria', 'rastreabilidade', 'loja'],
    description: 'Mais precisão e controle na gestão do rebanho.',
    featureLabels: [
      'Gestão focada em pecuária',
      'Melhor controle do rebanho',
      'Rastreabilidade',
      'Loja de Insumos',
    ],
  },
  {
    name: 'Completo',
    price: 'R$ 349',
    period: '/mês',
    level: 2,
    features: ['dashboard', 'roi', 'loja', 'pecuaria', 'rastreabilidade'],
    description: 'A solução ideal para quem quer visão total da operação.',
    featureLabels: [
      'Recursos integrados',
      'Previsão IA',
      'Rastreabilidade',
      'Calculadora de ROI',
      'Loja de Insumos',
    ],
    highlighted: true,
  },
  {
    name: 'Família Coop',
    price: 'R$ 799',
    period: '/mês',
    level: 3,
    features: ['dashboard', 'roi', 'loja', 'pecuaria', 'rastreabilidade', 'multi_propriedade'],
    description: 'Mais estrutura para operações maiores e gestão compartilhada.',
    featureLabels: [
      'Gestão compartilhada',
      'Mais escala',
      'Até 5 propriedades',
      'Todos os recursos Completos',
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

      await supabase.from('users').update({ plan_active: selectedPlan.name }).eq('id', user.id)

      toast({
        title: 'Plano atualizado com sucesso!',
        description: `Seu novo plano é o ${selectedPlan.name}. Aproveite as novas ferramentas!`,
        className: 'bg-green-500 text-black border-green-600',
      })

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
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="bg-black min-h-full rounded-2xl md:rounded-3xl p-6 md:p-12 animate-in fade-in duration-500 border border-white/10 shadow-2xl">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
          Evolua sua Gestão
        </h1>
        <p className="text-zinc-400 text-lg font-medium">
          Escolha o plano ideal para a sua propriedade e libere todo o potencial da inteligência
          artificial e rastreabilidade no campo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto mb-6">
        {PLANS.slice(0, 3).map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            currentPlanName={currentPlanName}
            currentPlanLevel={currentPlanLevel}
            updating={updating}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {PLANS.slice(3, 5).map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            currentPlanName={currentPlanName}
            currentPlanLevel={currentPlanLevel}
            updating={updating}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>
    </div>
  )
}

function PlanCard({ plan, currentPlanName, currentPlanLevel, updating, onUpgrade }: any) {
  const isCurrent = plan.name === currentPlanName
  const isSuperior = plan.level > currentPlanLevel

  let btnText = 'Mudar Plano'
  if (isCurrent) btnText = 'Seu Plano Atual'
  else if (isSuperior) btnText = 'Fazer Upgrade'

  return (
    <div
      className={cn(
        'relative flex flex-col p-8 rounded-[2.2rem] transition-all duration-300',
        plan.highlighted || isCurrent
          ? 'bg-zinc-900/90 border-2 border-green-500 shadow-[0_0_40px_-15px_rgba(34,197,94,0.5)] z-10 scale-[1.02]'
          : 'bg-black border border-white/5 hover:bg-zinc-900/40 hover:border-white/10',
      )}
    >
      {isCurrent && (
        <div className="absolute top-0 right-8 -translate-y-1/2">
          <div className="bg-zinc-100 text-zinc-800 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg border border-zinc-200">
            Plano Atual
          </div>
        </div>
      )}
      {!isCurrent && plan.highlighted && (
        <div className="absolute top-0 right-8 -translate-y-1/2">
          <div className="bg-green-500 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            Recomendado
          </div>
        </div>
      )}

      <h3 className="text-2xl font-black mb-2 text-white">{plan.name}</h3>
      <p className="text-zinc-400 text-sm font-medium mb-6 min-h-[40px]">{plan.description}</p>

      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-5xl font-black tracking-tighter text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          {plan.price}
        </span>
        {plan.period && <span className="font-bold text-sm text-zinc-500">{plan.period}</span>}
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {plan.featureLabels.map((f: string, j: number) => (
          <li key={j} className="flex items-start gap-3 text-sm font-semibold text-zinc-300">
            <div className="mt-0.5 rounded-full p-1 bg-green-500/10 text-green-500 shrink-0">
              <Check className="w-3 h-3" strokeWidth={3} />
            </div>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        className={cn(
          'w-full h-auto py-4 mt-4 rounded-full font-black text-sm tracking-wide uppercase transition-all duration-300 whitespace-normal text-center',
          isCurrent
            ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-800 cursor-not-allowed'
            : plan.highlighted
              ? 'bg-green-500 text-black hover:bg-green-600 shadow-[0_0_25px_rgba(34,197,94,0.6)] hover:scale-105'
              : 'bg-zinc-100 text-black hover:bg-white hover:scale-105',
        )}
        disabled={isCurrent || updating !== null}
        onClick={() => onUpgrade(plan)}
      >
        {updating === plan.name ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2 inline-block" />
        ) : null}
        {btnText}
      </Button>
    </div>
  )
}
