import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Check, X, Database, Headset, Shield, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Básico',
    price: 'Grátis',
    period: '/ 7 dias',
    level: 0,
    features: ['dashboard'],
    description: 'Ideal para: Produtores que querem conhecer a plataforma',
    permissionsAllowed: [
      'Criar conta e acessar plataforma',
      'Visualizar dashboard básico',
      'Adicionar 1 propriedade',
      'Ver histórico de 7 dias',
      'Acessar comunidade (leitura)',
    ],
    permissionsDenied: [
      'Não pode postar na comunidade',
      'Não pode usar IA Avançada',
      'Não pode acessar calculadora ROI',
      'Não pode usar marketplace',
      'Não pode gerar relatórios avançados',
    ],
    limits: [
      '1 propriedade',
      '7 dias de histórico',
      'Sem backup automático',
      'Sem exportação de dados',
    ],
    support: ['Email apenas', 'Resposta em até 48h'],
  },
  {
    name: 'Plantio Solo',
    price: 'R$ 149',
    period: '/mês',
    level: 1,
    features: ['dashboard', 'roi', 'loja'],
    description: 'Ideal para: Produtores focados em lavoura',
    permissionsAllowed: [
      'Tudo do Básico +',
      'Gestão completa de plantio',
      'Criar múltiplas safras',
      'Acompanhar ciclo de plantio',
      'Receber alertas de clima',
      'Calcular insumos necessários',
      'Gerar relatórios mensais',
      'Acessar histórico de 1 ano',
      'Postar na comunidade',
    ],
    permissionsDenied: [
      'Não pode gerenciar rebanho',
      'Não pode usar IA Avançada',
      'Não pode acessar calculadora ROI',
      'Não pode usar marketplace',
      'Não pode integrar com APIs externas',
    ],
    limits: [
      '3 propriedades',
      '1 ano de histórico',
      'Backup automático semanal',
      'Exportação em PDF',
    ],
    support: ['Email prioritário', 'Resposta em até 24h', 'Chat de suporte básico'],
  },
  {
    name: 'Pecuária Solo',
    price: 'R$ 199',
    period: '/mês',
    level: 1,
    features: ['dashboard', 'pecuaria', 'rastreabilidade', 'loja'],
    description: 'Ideal para: Produtores focados em rebanho',
    permissionsAllowed: [
      'Tudo do Básico +',
      'Gestão completa do rebanho',
      'Rastrear animais individualmente',
      'Alertas de cio (detecção de calor)',
      'Histórico reprodutivo',
      'Controle de vacinação',
      'Cálculo de nutrição e ração',
      'Gerar relatórios de desempenho',
      'Acessar histórico de 1 ano',
      'Postar na comunidade',
    ],
    permissionsDenied: [
      'Não pode gerenciar plantio',
      'Não pode usar IA Avançada',
      'Não pode acessar calculadora ROI',
      'Não pode usar marketplace',
      'Não pode integrar com APIs externas',
    ],
    limits: [
      '3 propriedades',
      '1 ano de histórico',
      'Backup automático semanal',
      'Exportação em PDF',
    ],
    support: ['Email prioritário', 'Resposta em até 24h', 'Chat de suporte básico'],
  },
  {
    name: 'Completo',
    price: 'R$ 349',
    period: '/mês',
    level: 2,
    features: ['dashboard', 'roi', 'loja', 'pecuaria', 'rastreabilidade'],
    description: 'Ideal para: Produtores que querem visão total da operação',
    highlighted: true,
    permissionsAllowed: [
      'Tudo dos planos Solo +',
      'IA Avançada (previsões)',
      'Dashboard integrado',
      'Calculadora ROI completa',
      'Análise de rentabilidade',
      'Rastreabilidade e ESG',
      'Certificação sustentabilidade',
      'Marketplace de insumos',
      'Integração APIs (CEPEA)',
      'Relatórios avançados',
      'Histórico ilimitado',
      'Postar e comentar na comunidade',
      'Participar de grupos privados',
      'Agendar consultoria (1x/mês)',
    ],
    permissionsDenied: [
      'Não pode gerenciar múltiplos usuários',
      'Não pode acessar API customizada',
      'Não pode fazer integrações avançadas',
    ],
    limits: [
      '5 propriedades',
      'Histórico ilimitado',
      'Backup automático diário',
      'Exportação em PDF, Excel, CSV',
      'Armazenamento de 50GB',
    ],
    support: [
      'Email prioritário',
      'Chat 24/7',
      'Resposta em até 2h',
      'Acesso a webinars e treinamentos',
      'Suporte VIP',
    ],
  },
  {
    name: 'Família Coop',
    price: 'R$ 799',
    period: '/mês',
    level: 3,
    features: ['dashboard', 'roi', 'loja', 'pecuaria', 'rastreabilidade', 'multi_propriedade'],
    description: 'Ideal para: Famílias, grupos e operações maiores',
    permissionsAllowed: [
      'Tudo do plano Completo +',
      'Gerenciar até 5 usuários',
      'Definir permissões por usuário',
      'Visualizar relatórios consolidados',
      'Análise comparativa',
      'Consultoria dedicada mensal',
      'Integração com terceiros',
      'Acesso à API customizada',
      'Criar integrações avançadas',
      'Backup automático real-time',
      'Armazenamento ilimitado',
      'Acesso antecipado a features',
      'Treinamento personalizado',
    ],
    permissionsDenied: [],
    secondaryUsers: [
      {
        role: 'Gerente de Propriedade',
        allowed: ['Visualizar dados da propriedade', 'Editar dados', 'Gerar relatórios'],
        denied: ['Não pode gerenciar usuários', 'Não pode alterar configurações'],
      },
      {
        role: 'Operacional (Campo)',
        allowed: ['Visualizar dados', 'Registrar atividades', 'Receber alertas'],
        denied: ['Não pode editar dados críticos', 'Não pode gerar relatórios'],
      },
      {
        role: 'Consultor (Externo)',
        allowed: ['Visualizar dados', 'Gerar relatórios'],
        denied: ['Não pode editar dados', 'Não pode gerenciar usuários'],
      },
    ],
    limits: [
      '10 propriedades',
      'Histórico ilimitado',
      'Backup em tempo real',
      'Exportação todos formatos',
      'Armazenamento ilimitado',
      'API customizada',
    ],
    support: [
      'Email VIP',
      'Chat 24/7',
      'Telefone dedicado',
      'Resposta em até 30min',
      'Consultoria mensal',
      'Treinamento personalizado',
      'Acesso antecipado a features',
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
          Conheça as permissões, limites e acessos de cada plano para escolher a melhor estrutura
          para a sua operação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1400px] mx-auto mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[920px] mx-auto mt-8">
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
        'relative flex flex-col p-6 md:p-8 rounded-[2.2rem] transition-all duration-300',
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

      <div className="flex-1 space-y-8 mb-8 border-t border-white/5 pt-6">
        <div className="space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" /> Permissões do Usuário
          </h4>
          <ul className="space-y-3">
            {plan.permissionsAllowed.map((f: string, j: number) => (
              <li key={`allow-${j}`} className="flex items-start gap-3 text-sm text-zinc-300">
                <div className="mt-0.5 rounded-full p-0.5 bg-green-500/10 text-green-500 shrink-0">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </div>
                <span className="leading-tight">{f}</span>
              </li>
            ))}
            {plan.permissionsDenied?.map((f: string, j: number) => (
              <li key={`deny-${j}`} className="flex items-start gap-3 text-sm text-zinc-500">
                <div className="mt-0.5 rounded-full p-0.5 bg-red-500/10 text-red-500/70 shrink-0">
                  <X className="w-3 h-3" strokeWidth={3} />
                </div>
                <span className="leading-tight">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {plan.secondaryUsers && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-500" /> Permissões Secundárias
            </h4>
            <div className="space-y-3">
              {plan.secondaryUsers.map((role: any, j: number) => (
                <div key={j} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h5 className="text-sm font-bold text-orange-400 mb-3">{role.role}</h5>
                  <ul className="space-y-2">
                    {role.allowed.map((f: string, k: number) => (
                      <li
                        key={`r-allow-${k}`}
                        className="flex items-start gap-2 text-xs text-zinc-300"
                      >
                        <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {role.denied.map((f: string, k: number) => (
                      <li
                        key={`r-deny-${k}`}
                        className="flex items-start gap-2 text-xs text-zinc-500"
                      >
                        <X className="w-3 h-3 text-red-500/70 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" /> Limite de Dados
          </h4>
          <ul className="space-y-2">
            {plan.limits.map((f: string, j: number) => (
              <li key={`limit-${j}`} className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/70 shrink-0" />
                <span className="leading-tight">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Headset className="w-4 h-4 text-purple-500" /> Suporte
          </h4>
          <ul className="space-y-2">
            {plan.support.map((f: string, j: number) => (
              <li key={`support-${j}`} className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500/70 shrink-0" />
                <span className="leading-tight">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        className={cn(
          'w-full h-auto py-4 mt-auto rounded-full font-black text-sm tracking-wide uppercase transition-all duration-300 whitespace-normal text-center',
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
