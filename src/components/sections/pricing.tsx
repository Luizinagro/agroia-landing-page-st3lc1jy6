import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Pricing() {
  const plans = [
    {
      name: 'Básico',
      price: 'Grátis',
      description: 'Ideal para pequenos produtores iniciando na digitalização.',
      features: ['Gestão básica de rebanho', 'Acesso à comunidade', 'Alertas manuais de clima'],
      button: 'Começar Grátis',
      highlight: false,
    },
    {
      name: 'Completo',
      price: 'R$ 149',
      period: '/mês',
      description: 'A solução definitiva com Inteligência Artificial e automação.',
      features: [
        'Previsão IA de mercado e safra',
        'Rastreabilidade completa',
        'Alertas climáticos automáticos',
        'Suporte prioritário via WhatsApp',
      ],
      button: 'Assinar Completo',
      highlight: true,
    },
    {
      name: 'Família Coop',
      price: 'Sob Consulta',
      description: 'Para cooperativas e grandes propriedades com múltiplos usuários.',
      features: [
        'Contas ilimitadas',
        'Dashboards personalizados',
        'Integração via API e ERP',
        'Gerente de conta dedicado',
      ],
      button: 'Falar com Vendas',
      highlight: false,
    },
  ]

  return (
    <section id="planos" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Escolha seu Plano</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Planos flexíveis que crescem junto com a sua produção e capacidade de investimento.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`bg-zinc-950 border ${plan.highlight ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'border-white/10'} relative flex flex-col rounded-2xl p-8`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                  Mais Escolhido
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
                <p className="text-zinc-400 text-sm h-10">{plan.description}</p>
                <div className="mt-6 flex items-baseline text-white">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-zinc-400 ml-1 font-medium">{plan.period}</span>
                  )}
                </div>
              </div>
              <div className="flex-1 mb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start text-zinc-300">
                      <Check className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <Link to="/cadastro" className="w-full block">
                  <Button
                    size="lg"
                    className={`w-full font-semibold ${plan.highlight ? 'bg-green-500 text-black hover:bg-green-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {plan.button}
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
