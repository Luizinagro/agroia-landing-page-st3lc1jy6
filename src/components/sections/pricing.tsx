import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useGsapAnimations } from '@/hooks/use-gsap-animations'
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
    name: 'Plantio Solo',
    price: 'R$147',
    period: '/mês',
    description: 'Para pequenos produtores',
    features: ['Tudo do Básico', 'Rastreabilidade', 'Calculadora ROI', 'Alertas de Preço'],
    highlighted: false,
  },
  {
    name: 'Pecuária Solo',
    price: 'R$197',
    period: '/mês',
    description: 'Foco em rebanhos',
    features: ['Gestão de Rebanho', 'Controle Sanitário', 'Rastreabilidade', 'Calculadora ROI'],
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
  {
    name: 'Família Coop',
    price: 'R$747',
    period: '/mês',
    description: 'Para grandes grupos',
    features: [
      'Tudo do Completo',
      'Múltiplas Propriedades',
      'Relatórios Consolidados',
      'IA Personalizada',
    ],
    highlighted: false,
  },
]

export function Pricing() {
  const containerRef = useRef<HTMLDivElement>(null)
  useGsapAnimations(containerRef)

  return (
    <section ref={containerRef} className="py-32 bg-[#050A15] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#22C55E]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 gsap-grow">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-6 tracking-tight">
            Planos para Escalar sua Produtividade
          </h2>
          <p className="text-white/50 text-lg md:text-xl font-medium">
            Escolha o pacote ideal para as necessidades da sua operação. Desbloqueie o poder da IA
            hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 gsap-stagger-container">
          {plans.map((plan, index) => (
            <div key={index} className="flex gsap-stagger-item">
              <div
                className={cn(
                  'card-glass w-full relative flex flex-col',
                  plan.highlighted &&
                    'border-agro-green/50 shadow-[0_0_30px_rgba(34,197,94,0.15)] scale-105 z-10 bg-gradient-to-b from-agro-green/10 to-transparent',
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-agro-green text-bg-dark px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    Popular
                  </div>
                )}

                <div className="text-left pb-6">
                  <h3 className="text-2xl mb-2 text-white font-bold">{plan.name}</h3>
                  <p className="text-sm text-white/50 mb-6 h-10">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-white/50 font-medium">{plan.period}</span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-white/80 font-medium"
                      >
                        <div
                          className={cn(
                            'mt-0.5 rounded-full p-1',
                            plan.highlighted
                              ? 'bg-agro-green/20 text-agro-green'
                              : 'bg-white/10 text-white',
                          )}
                        >
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-auto">
                  <Link
                    to="/cadastro"
                    className={cn(
                      'w-full py-4 flex items-center justify-center text-center',
                      plan.highlighted ? 'btn-agro-primary' : 'btn-agro-secondary',
                    )}
                  >
                    Assinar Agora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
