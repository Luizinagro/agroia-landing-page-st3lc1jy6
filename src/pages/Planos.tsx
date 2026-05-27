import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { PLANS } from '@/data/plans-data'
import { PlanCard } from '@/components/PlanCard'
import { PlanComparison } from '@/components/PlanComparison'
import { PlanFAQ } from '@/components/PlanFAQ'

export default function Planos() {
  const { user } = useAuth()
  const { plan: currentPlan, loading: loadingPlan } = useSubscription()
  const { toast } = useToast()
  const [updating, setUpdating] = useState<string | null>(null)
  const [isAnnual, setIsAnnual] = useState(false)

  let currentPlanName = currentPlan?.plan_name || user?.plan_active || 'Explorador'
  if (currentPlanName === 'Básico') currentPlanName = 'Explorador'
  if (currentPlanName === 'Plantio Solo') currentPlanName = 'Lavoura'
  if (currentPlanName === 'Pecuário Solo' || currentPlanName === 'Pecuária Solo')
    currentPlanName = 'Rebanho'
  if (currentPlanName === 'Completo') currentPlanName = 'Fazendeiro Completo'
  if (currentPlanName === 'Família Coop') currentPlanName = 'Cooperativa'

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
        description: `Seu novo plano é o ${selectedPlan.name}.`,
        className: 'bg-green-500 text-black border-green-600',
      })
      window.location.assign('/dashboard')
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao atualizar plano',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
      setUpdating(null)
    }
  }

  if (loadingPlan) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-black min-h-full rounded-2xl md:rounded-3xl p-6 md:p-12 animate-in fade-in duration-500">
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <div className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          🌾 Mais de 500 produtores já transformaram sua fazenda com AgroIA
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
          Escolha o plano certo para o seu campo
        </h1>
        <h2 className="text-zinc-400 text-lg md:text-xl font-medium mb-12">
          Tecnologia de ponta acessível para qualquer produtor rural. Cancele quando quiser.
        </h2>

        <div className="flex items-center justify-center gap-4 bg-zinc-900/50 p-3 rounded-full w-max mx-auto border border-white/5 shadow-xl">
          <span
            className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}
          >
            Mensal
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-primary"
          />
          <span
            className={`text-sm font-bold transition-colors ${isAnnual ? 'text-white' : 'text-zinc-500'} flex items-center gap-2`}
          >
            Anual
            <span className="bg-primary/20 text-primary text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
              2 meses grátis
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1400px] mx-auto mb-8">
        {PLANS.slice(0, 3).map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            isAnnual={isAnnual}
            isCurrent={plan.name === currentPlanName}
            updating={updating}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[920px] mx-auto">
        {PLANS.slice(3, 5).map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            isAnnual={isAnnual}
            isCurrent={plan.name === currentPlanName}
            updating={updating}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>

      <PlanComparison />
      <PlanFAQ />
    </div>
  )
}
