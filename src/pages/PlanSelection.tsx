import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Sparkles, Tractor, ArrowRight, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Básico',
    price: 'Grátis',
    period: '',
    level: 0,
    features: ['dashboard', 'comunidade'],
    featureLabels: ['Dashboard Básico', 'Suporte Básico', 'Acesso à Comunidade'],
  },
  {
    name: 'Plantio Solo',
    price: 'R$ 147',
    period: '/mês',
    level: 1,
    features: ['dashboard', 'comunidade', 'roi', 'loja', 'previsao-ia'],
    featureLabels: ['Previsão IA', 'Calculadora de ROI', 'Loja de Insumos'],
  },
  {
    name: 'Pecuário Solo',
    price: 'R$ 147',
    period: '/mês',
    level: 1,
    features: ['dashboard', 'comunidade', 'pecuaria', 'rastreabilidade', 'loja'],
    featureLabels: ['Rastreabilidade', 'Loja de Insumos', 'Gestão Pecuária'],
  },
  {
    name: 'Completo',
    price: 'R$ 347',
    period: '/mês',
    level: 2,
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
    featureLabels: [
      'Previsão IA',
      'Rastreabilidade',
      'Calculadora de ROI',
      'Loja de Insumos',
      'Análise de Satélite',
      'CRM',
    ],
  },
  {
    name: 'Família Coop',
    price: 'R$ 747',
    period: '/mês',
    level: 3,
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
    featureLabels: [
      'Previsão IA',
      'Rastreabilidade',
      'Calculadora de ROI',
      'Loja de Insumos',
      'Até 5 propriedades',
      'Análise de Satélite',
    ],
  },
]

export default function PlanSelection() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [updating, setUpdating] = useState<string | null>(null)

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
        className: 'bg-[#1a3c34] text-white border-[#f4d03f]',
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative isolate">
      {/* Botão de Fechar muito visível e acessível */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[9999]">
        <Button
          variant="outline"
          size="icon"
          onClick={handleClose}
          className="text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 shadow-md rounded-full w-12 h-12 border-2 border-slate-200 transition-all"
          title="Fechar e ir para o Dashboard"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 z-10 pt-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#1a3c34] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <Tractor className="w-8 h-8 text-[#f4d03f] transform rotate-6" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a3c34] tracking-tight">
            Escolha seu Plano AgroIA
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Selecione o plano ideal para iniciar sua jornada e destravar o poder da inteligência
            artificial na sua propriedade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch pb-10">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col h-full bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200',
                plan.name === 'Completo'
                  ? 'border-[#f4d03f] border-2 shadow-lg scale-105 z-10'
                  : '',
              )}
            >
              {plan.name === 'Completo' && (
                <div className="absolute top-0 inset-x-0 bg-[#f4d03f] text-[#1a3c34] text-center py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Mais Recomendado
                </div>
              )}

              <CardHeader className={cn('pb-4', plan.name === 'Completo' ? 'pt-10' : 'pt-6')}>
                <CardTitle className="text-xl font-bold text-[#1a3c34]">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold text-[#1a3c34]">
                  {plan.price}
                  <span className="ml-1 text-sm font-semibold text-slate-500">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 pb-6">
                <ul className="space-y-4">
                  {plan.featureLabels.map((feat, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-[#4ade80] shrink-0 mr-3 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  className={cn(
                    'w-full h-12 text-sm font-bold transition-all',
                    plan.name === 'Completo'
                      ? 'bg-[#f4d03f] text-[#1a3c34] hover:bg-[#e3c02f] hover:shadow-md'
                      : 'bg-[#1a3c34] text-white hover:bg-[#2c5c50]',
                  )}
                  disabled={updating !== null}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {updating === plan.name ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  Selecionar Plano <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center pb-12 flex flex-col gap-4 items-center">
          <Button
            variant="outline"
            className="text-slate-700 hover:text-[#1a3c34] border-slate-300"
            onClick={handleClose}
          >
            Pular por enquanto
          </Button>
          <Button
            variant="ghost"
            className="text-slate-500 hover:text-[#1a3c34]"
            onClick={() => navigate('/login')}
          >
            Voltar para o Login
          </Button>
        </div>
      </div>
    </div>
  )
}
