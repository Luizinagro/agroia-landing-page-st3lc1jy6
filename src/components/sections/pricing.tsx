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
    periodo: null,
    descricao: 'Ideal para pequenos produtores iniciando na digitalização.',
    features: [
      'Gestão básica de rebanho e lavoura',
      'Acesso à comunidade',
      'Alertas manuais de clima',
    ],
    botao: 'Começar Grátis',
    destaque: false,
    ordem: 1,
  },
  {
    id: '2',
    nome: 'Plantio Solo',
    preco: 'R$ 97',
    periodo: '/mês',
    descricao: 'Foco total no monitoramento e gestão da sua lavoura.',
    features: [
      'Previsão de safra com IA',
      'Alertas climáticos automáticos',
      'Gestão de insumos e maquinário',
    ],
    botao: 'Assinar Plantio',
    destaque: false,
    ordem: 2,
  },
  {
    id: '3',
    nome: 'Pecuário Solo',
    preco: 'R$ 97',
    periodo: '/mês',
    descricao: 'Gestão completa do seu rebanho e produção animal.',
    features: [
      'Gestão avançada de rebanho',
      'Controle de engorda e nutrição',
      'Alertas veterinários',
    ],
    botao: 'Assinar Pecuária',
    destaque: false,
    ordem: 3,
  },
  {
    id: '4',
    nome: 'Completo',
    preco: 'R$ 197',
    periodo: '/mês',
    descricao: 'A solução definitiva com Inteligência Artificial e automação.',
    features: [
      'Todas as funções Solo (Plantio e Pecuária)',
      'Previsão IA de mercado',
      'Rastreabilidade completa',
      'Suporte prioritário via WhatsApp',
    ],
    botao: 'Assinar Completo',
    destaque: true,
    ordem: 4,
  },
  {
    id: '5',
    nome: 'Família Coop',
    preco: 'Sob Consulta',
    periodo: null,
    descricao: 'Para cooperativas e grandes propriedades com múltiplos usuários.',
    features: [
      'Contas ilimitadas',
      'Dashboards personalizados',
      'Integração via API e ERP',
      'Gerente de conta dedicado',
    ],
    botao: 'Falar com Vendas',
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
