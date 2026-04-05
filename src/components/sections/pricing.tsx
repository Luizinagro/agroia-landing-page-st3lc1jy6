import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'

interface Plan {
  id: string
  nome: string
  preco: string
  periodo: string | null
  descricao: string
  features: string[]
  botao: string
  destaque: boolean
  ordem: number
}

const fallbackPlans: Plan[] = [
  {
    id: '1',
    nome: 'Básico',
    preco: 'Grátis',
    periodo: ' por 7 dias',
    descricao: 'Produtores que querem conhecer a plataforma',
    features: [
      'Acesso completo por 7 dias',
      'Dashboard básico com visão geral',
      'Até 1 propriedade',
      'Histórico de 7 dias',
      'Suporte por email',
      'Comunidade de usuários',
    ],
    botao: 'Começar Grátis',
    destaque: false,
    ordem: 1,
  },
  {
    id: '2',
    nome: 'Plantio Solo',
    preco: 'R$ 149',
    periodo: '/mês',
    descricao: 'Produtores focados em lavoura',
    features: [
      'Tudo do plano Básico +',
      'Gestão completa de plantio',
      'Acompanhamento de safras',
      'Previsão de colheita',
      'Alertas de clima e umidade',
      'Cálculo de insumos',
      'Histórico de 1 ano',
      'Até 3 propriedades',
      'Relatórios mensais',
      'Suporte prioritário',
    ],
    botao: 'Assinar',
    destaque: false,
    ordem: 2,
  },
  {
    id: '3',
    nome: 'Pecuária Solo',
    preco: 'R$ 199',
    periodo: '/mês',
    descricao: 'Produtores focados em rebanho',
    features: [
      'Tudo do plano Básico +',
      'Gestão completa do rebanho',
      'Rastreamento individual',
      'Alertas de cio',
      'Histórico reprodutivo',
      'Controle de saúde',
      'Cálculo de nutrição',
      'Histórico de 1 ano',
      'Até 3 propriedades',
      'Relatórios de desempenho',
      'Suporte prioritário',
    ],
    botao: 'Assinar',
    destaque: false,
    ordem: 3,
  },
  {
    id: '4',
    nome: 'Completo',
    preco: 'R$ 349',
    periodo: '/mês',
    descricao: 'Produtores que querem visão total da operação',
    features: [
      'Tudo dos planos Solo +',
      'IA Avançada para previsões',
      'Dashboard integrado',
      'Calculadora ROI completa',
      'Análise de rentabilidade',
      'Rastreabilidade e ESG',
      'Marketplace integrado',
      'Até 5 propriedades',
      'Histórico ilimitado',
      'Integração CEPEA',
      'Suporte 24/7',
    ],
    botao: 'Escolher plano',
    destaque: true,
    ordem: 4,
  },
  {
    id: '5',
    nome: 'Família Coop',
    preco: 'R$ 799',
    periodo: '/mês',
    descricao: 'Famílias, grupos e operações maiores',
    features: [
      'Tudo do plano Completo +',
      'Até 10 propriedades',
      'Múltiplos usuários (até 5)',
      'Gestão compartilhada',
      'Relatórios consolidados',
      'Consultoria dedicada',
      'Integração com terceiros',
      'API customizada',
      'Backup avançado',
      'Suporte VIP',
      'Treinamento para equipe',
    ],
    botao: 'Assinar',
    destaque: false,
    ordem: 5,
  },
]

export function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from('planos' as any)
          .select('*')
          .order('ordem', { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          setPlans(data as Plan[])
        } else {
          setPlans(fallbackPlans)
        }
      } catch (err) {
        console.error('Erro ao buscar planos:', err)
        setPlans(fallbackPlans)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  if (loading) {
    return (
      <section
        id="planos"
        className="py-24 bg-black flex justify-center items-center min-h-[500px]"
      >
        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
      </section>
    )
  }

  return (
    <section id="planos" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Escolha seu Plano</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Planos flexíveis que crescem junto com a sua produção e capacidade de investimento.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1400px] mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id || plan.nome}
              className={`bg-zinc-950 border ${
                plan.destaque
                  ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] md:scale-105 z-10'
                  : 'border-white/10'
              } relative flex flex-col rounded-2xl p-6 transition-transform hover:scale-[1.02]`}
            >
              {plan.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                  Mais Escolhido
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.nome}</h3>
                <p className="text-zinc-400 text-sm min-h-[60px]">{plan.descricao}</p>
                <div className="mt-4 flex items-baseline text-green-400">
                  <span className="text-4xl font-extrabold drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                    {plan.preco}
                  </span>
                  {plan.periodo && (
                    <span className="text-green-500/70 ml-1 font-medium text-sm">
                      {plan.periodo}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start text-zinc-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <Link to="/cadastro" className="w-full block">
                  <Button
                    size="lg"
                    className={`w-full font-bold shadow-lg transition-all ${
                      plan.destaque
                        ? 'bg-green-500 text-black hover:bg-green-400 hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]'
                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                    }`}
                  >
                    {plan.botao}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
