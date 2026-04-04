import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Básico',
    price: 'Grátis',
    description: 'Ideal para começar',
    features: ['Dashboard Básico', 'Pecuária Essencial', 'Previsão IA (Limitado)'],
    highlighted: false,
  },
  {
    name: 'Plantio',
    price: 'R$147',
    period: '/mês',
    description: 'Para pequenos produtores',
    features: ['Tudo do Básico', 'Rastreabilidade', 'Calculadora ROI', 'Alertas de Preço'],
    highlighted: false,
  },
  {
    name: 'Completo',
    price: 'R$347',
    period: '/mês',
    description: 'A solução definitiva',
    features: ['Plantio + Pecuária', 'Loja de Insumos', 'Dashboard de Estoque', 'Suporte 24/7'],
    highlighted: true,
  },
]

export function Pricing() {
  return (
    <section id="planos" className="py-32 bg-zinc-950">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
            Planos e Preços
          </h2>
          <p className="text-zinc-400 text-lg font-medium">
            Escolha o pacote ideal para as necessidades da sua operação. Desbloqueie o poder da IA
            hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={cn(
                'rounded-3xl p-8 transition-all duration-300',
                plan.highlighted
                  ? 'bg-primary text-black scale-105 shadow-2xl shadow-primary/20 border-2 border-primary'
                  : 'bg-black border border-zinc-800 text-white hover:border-zinc-600',
              )}
            >
              {plan.highlighted && (
                <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                  Mais Popular
                </div>
              )}

              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p
                className={cn(
                  'text-sm font-medium mb-8 h-10',
                  plan.highlighted ? 'text-black/70' : 'text-zinc-400',
                )}
              >
                {plan.description}
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                {plan.period && (
                  <span
                    className={cn(
                      'font-bold text-sm',
                      plan.highlighted ? 'text-black/70' : 'text-zinc-400',
                    )}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm font-semibold">
                    <div
                      className={cn(
                        'mt-0.5 rounded-full p-1',
                        plan.highlighted ? 'bg-black/10 text-black' : 'bg-primary/10 text-primary',
                      )}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  'w-full h-12 rounded-full font-bold text-base',
                  plan.highlighted
                    ? 'bg-black text-white hover:bg-zinc-800'
                    : 'bg-white text-black hover:bg-zinc-200',
                )}
              >
                <Link to="/cadastro">Assinar {plan.name}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
