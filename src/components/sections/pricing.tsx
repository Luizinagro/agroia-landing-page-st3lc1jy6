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
    <section ref={containerRef} className="relative overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://img.usecurling.com/p/1920/1080?q=agriculture')] bg-cover bg-center opacity-5 mix-blend-overlay" />
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1DB954]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 gsap-grow">
          <h2>Planos para Escalar sua Produtividade</h2>
          <p className="text-[#E0E0E0] text-base md:text-lg">
            Escolha o pacote ideal para as necessidades da sua operação. Desbloqueie o poder da IA
            hoje.
          </p>
        </div>

        <div className="grid-responsive gsap-stagger-container">
          {plans.map((plan, index) => (
            <div key={index} className="flex gsap-stagger-item">
              <div
                className={cn(
                  'card-glass w-full relative flex flex-col bg-[#000000] border border-[#1DB954]',
                  plan.highlighted && 'z-10 scale-[1.02] shadow-[0_0_20px_rgba(29,185,84,0.4)]',
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1DB954] text-[#000000] px-4 py-1 rounded-[12px] text-xs font-medium tracking-wider uppercase">
                    POPULAR
                  </div>
                )}

                <div className="text-left pb-6">
                  <h3 className="text-xl mb-2 text-[#FFFFFF] font-medium">{plan.name}</h3>
                  <p className="text-sm text-[#E0E0E0] mb-6 h-10">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-medium text-[#FFFFFF] tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && <span className="text-[#E0E0E0]">{plan.period}</span>}
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#E0E0E0]">
                        <div className="mt-0.5 rounded-[4px] p-1 bg-[#1DB954]/10 text-[#1DB954]">
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
                      'w-full py-3 flex items-center justify-center text-center',
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
