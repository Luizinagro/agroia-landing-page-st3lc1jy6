import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { Check, X as XIcon, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Explorador',
    monthlyPrice: 'Grátis',
    annualPrice: 'Grátis',
    period: '',
    savings: '',
    icon: '🌱',
    features: ['dashboard', 'comunidade'],
    includedLabels: ['Dashboard Básico', 'Acesso à Comunidade', 'Suporte Básico'],
    excludedLabels: ['Previsão IA', 'Gestão Financeira', 'Análise de Satélite'],
    btnLabel: 'Começar Grátis',
    btnStyle: 'border-white text-white hover:bg-white/10 border bg-transparent',
    belowBtn: 'Não precisa de cartão de crédito',
    belowBtnStyle: 'text-[#A8B8A0]',
  },
  {
    name: 'Lavoura',
    monthlyPrice: 'R$ 149',
    annualPrice: 'R$ 124',
    period: '/mês',
    savings: 'Você economiza R$ 300/ano',
    icon: '🌾',
    features: ['dashboard', 'comunidade', 'roi', 'loja', 'previsao-ia'],
    includedLabels: ['Previsão IA', 'Calculadora de ROI', 'Loja de Insumos', 'Gestão Financeira'],
    excludedLabels: ['Rastreabilidade (Pecuária)', 'Análise de Satélite'],
    btnLabel: 'Assinar Lavoura',
    btnStyle: 'bg-[#4A8A1A] text-white hover:bg-[#3d7214]',
  },
  {
    name: 'Rebanho',
    monthlyPrice: 'R$ 199',
    annualPrice: 'R$ 166',
    period: '/mês',
    savings: 'Você economiza R$ 396/ano',
    icon: '🐄',
    features: ['dashboard', 'comunidade', 'pecuaria', 'rastreabilidade', 'loja'],
    includedLabels: ['Gestão Pecuária', 'Rastreabilidade', 'Loja de Insumos'],
    excludedLabels: ['Gestão de Lavoura', 'Análise de Satélite', 'CRM'],
    btnLabel: 'Assinar Rebanho',
    btnStyle: 'bg-[#4A8A1A] text-white hover:bg-[#3d7214]',
  },
  {
    name: 'Fazendeiro Completo',
    monthlyPrice: 'R$ 349',
    annualPrice: 'R$ 291',
    period: '/mês',
    savings: 'Você economiza R$ 696/ano',
    icon: '🚜',
    features: [
      'dashboard',
      'comunidade',
      'roi',
      'loja',
      'pecuaria',
      'rastreabilidade',
      'previsao-ia',
      'analise-satelite',
      'crm',
      'faturamento',
      'meus-calculos',
      'checkout',
    ],
    includedLabels: [
      'Tudo de Lavoura e Rebanho',
      'Análise de Satélite',
      'CRM e Faturamento',
      'Gestão de RH',
      'IA Avançada',
    ],
    excludedLabels: ['Múltiplas Propriedades'],
    btnLabel: 'Quero o Fazendeiro Completo',
    btnStyle: 'bg-[#6DBF4A] text-[#070F07] hover:bg-[#5aa83b] font-bold',
    belowBtn: '🏆 Plano mais escolhido pelos produtores',
    belowBtnStyle: 'text-[#FFB74D]',
    featured: true,
  },
  {
    name: 'Cooperativa',
    monthlyPrice: 'R$ 799',
    annualPrice: 'R$ 666',
    period: '/mês',
    savings: 'Você economiza R$ 1.596/ano',
    icon: '🤝',
    features: [
      'dashboard',
      'comunidade',
      'roi',
      'loja',
      'pecuaria',
      'rastreabilidade',
      'multi_propriedade',
      'previsao-ia',
      'analise-satelite',
      'crm',
      'faturamento',
      'meus-calculos',
      'checkout',
    ],
    includedLabels: [
      'Até 5 propriedades',
      'Painel Consolidado',
      'Relatórios Customizados',
      'Suporte Prioritário',
    ],
    excludedLabels: [],
    btnLabel: 'Falar com Consultor',
    btnStyle: 'border-white text-white hover:bg-white/10 border bg-transparent',
  },
]

export default function PlanSelection() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [updating, setUpdating] = useState<string | null>(null)
  const [isAnnual, setIsAnnual] = useState(false)

  const currentPlan = user?.plan_active || user?.plan_type || user?.plano_ativo || 'Explorador'

  useEffect(() => {
    if (user) {
      const isPremium =
        currentPlan !== 'Básico' && currentPlan !== 'Explorador' && currentPlan !== 'Nenhum'
      const fromMenu = location.state?.fromMenu

      if (isPremium && !fromMenu) {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [user, navigate, location.state, currentPlan])

  const handleSelectPlan = async (selectedPlan: (typeof PLANS)[0]) => {
    if (!user?.id) return
    setUpdating(selectedPlan.name)

    try {
      const { data: existingPlan } = await supabase
        .from('user_plans')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingPlan?.id) {
        const { error } = await supabase
          .from('user_plans')
          .update({
            plan_name: selectedPlan.name,
            plan_features: selectedPlan.features,
          })
          .eq('id', existingPlan.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('user_plans').insert({
          user_id: user.id,
          plan_name: selectedPlan.name,
          plan_features: selectedPlan.features,
        })
        if (error) throw error
      }

      await supabase
        .from('users')
        .update({
          plan_active: selectedPlan.name,
          plan_type: selectedPlan.name,
        } as any)
        .eq('id', user.id)

      if (updateUser) {
        await updateUser({
          plan_active: selectedPlan.name,
          plano_ativo: selectedPlan.name,
          plan_type: selectedPlan.name,
          plano: selectedPlan.name,
        })
      }

      toast({
        title: 'Plano selecionado com sucesso!',
        description: `Bem-vindo ao plano ${selectedPlan.name}.`,
        className: 'bg-[#0D1F0D] text-white border-[#6DBF4A]',
      })

      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao selecionar plano',
        description: 'Não foi possível completar a transação no momento. Tente novamente.',
        variant: 'destructive',
      })
      setUpdating(null)
    }
  }

  const handleClose = () => {
    sessionStorage.setItem('plan_dismissed', 'true')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#070F07] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative isolate font-sans">
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[9999]">
        <button
          onClick={handleClose}
          className="text-[#A8B8A0] hover:text-white bg-[#0D1F0D] hover:bg-[#1E3A1E] rounded-full w-12 h-12 flex items-center justify-center border border-[#1E3A1E] transition-all"
          title="Fechar e ir para o Dashboard"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-500 z-10 pt-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E8] tracking-tight">
            Escolha seu Plano
          </h1>
          <p className="text-lg text-[#A8B8A0] max-w-2xl mx-auto">
            Comece grátis. Faça upgrade quando precisar de mais.
          </p>

          <div className="pt-6 pb-2">
            <div className="flex items-center justify-center gap-2 bg-[#0D1F0D] p-1.5 rounded-full border border-[#1E3A1E] mx-auto w-fit shadow-lg shadow-black/20">
              <button
                onClick={() => setIsAnnual(false)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-semibold transition-all',
                  !isAnnual
                    ? 'bg-[#1E3A1E] text-white shadow-sm'
                    : 'text-[#A8B8A0] hover:text-white',
                )}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2',
                  isAnnual
                    ? 'bg-[#1E3A1E] text-white shadow-sm'
                    : 'text-[#A8B8A0] hover:text-white',
                )}
              >
                Anual
                <span className="bg-[#6DBF4A]/20 text-[#6DBF4A] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  2 MESES GRÁTIS
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-stretch pb-10">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.name

            return (
              <div
                key={plan.name}
                className={cn(
                  'relative flex flex-col h-full bg-[#0D1F0D] rounded-[12px] p-7 transition-all duration-300 border',
                  plan.featured
                    ? 'border-[#6DBF4A] border-2 shadow-xl shadow-[#6DBF4A]/10 xl:scale-105 z-10'
                    : 'border-[#1E3A1E] hover:border-[#4A8A1A]/50',
                )}
              >
                {plan.featured && !isCurrentPlan && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1A3A0A] text-[#6DBF4A] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#6DBF4A]/30 whitespace-nowrap">
                    MAIS ESCOLHIDO
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1A3A0A] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#6DBF4A] whitespace-nowrap">
                    SEU PLANO ATUAL
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-3xl mb-3">{plan.icon}</div>
                  <h3 className="text-xl font-bold text-[#F5F0E8]">{plan.name}</h3>
                  <div className="mt-4 min-h-[80px]">
                    <div className="flex items-baseline text-3xl font-bold text-white">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      <span className="ml-1 text-sm font-normal text-[#A8B8A0]">{plan.period}</span>
                    </div>
                    {isAnnual && plan.savings && (
                      <div className="text-sm font-medium text-[#6DBF4A] mt-1.5">
                        {plan.savings}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4">
                    {plan.includedLabels.map((feat, i) => (
                      <li key={`inc-${i}`} className="flex items-start">
                        <Check className="h-5 w-5 text-[#6DBF4A] shrink-0 mr-3 mt-0.5" />
                        <span className="text-sm text-[#F5F0E8]">{feat}</span>
                      </li>
                    ))}
                    {plan.excludedLabels.map((feat, i) => (
                      <li key={`exc-${i}`} className="flex items-start opacity-60">
                        <XIcon className="h-5 w-5 text-[#5A3030] shrink-0 mr-3 mt-0.5" />
                        <span className="text-sm text-[#A8B8A0]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-auto flex flex-col items-center gap-3">
                  <button
                    disabled={updating !== null || isCurrentPlan}
                    className={cn(
                      'w-full h-12 rounded-lg text-sm font-semibold transition-all flex items-center justify-center',
                      isCurrentPlan
                        ? 'bg-[#1E3A1E] text-[#A8B8A0] cursor-not-allowed border border-[#2a4d2a]'
                        : plan.btnStyle,
                    )}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {updating === plan.name ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : null}
                    {isCurrentPlan ? 'Plano Atual' : plan.btnLabel}
                  </button>

                  {plan.belowBtn && !isCurrentPlan && (
                    <span className={cn('text-xs text-center', plan.belowBtnStyle)}>
                      {plan.belowBtn}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center pb-12 flex flex-col gap-4 items-center">
          <button
            className="text-[#A8B8A0] hover:text-white transition-colors text-sm font-medium underline underline-offset-4"
            onClick={() => navigate('/login')}
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    </div>
  )
}
