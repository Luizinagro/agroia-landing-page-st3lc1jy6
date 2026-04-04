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

function PricingCard({ plan, className }: { plan: (typeof plans)[0]; className?: string }) {
  return (
    <div
      className={cn(
        'bg-[#050505] border border-white/5 rounded-[32px] p-8 flex flex-col hover:border-[#1DB954]/30 transition-colors duration-500 gsap-stagger-item',
        className,
      )}
    >
      <h3 className="text-white text-2xl font-black mb-2 tracking-tight">{plan.name}</h3>
      <p className="text-[#A0A0A0] text-sm font-medium mb-8 h-10">{plan.description}</p>

      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-black text-white tracking-tighter">{plan.price}</span>
        {plan.period && <span className="text-[#A0A0A0] font-bold text-sm">{plan.period}</span>}
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-[#E0E0E0] text-sm font-semibold">
            <div className="mt-0.5 rounded-full p-1 bg-[#1DB954]/10 text-[#1DB954]">
              <Check className="w-3 h-3" strokeWidth={3} />
            </div>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/cadastro"
        className="w-full py-4 bg-[#1DB954] text-black rounded-full font-black text-sm text-center hover:bg-[#1DB954]/90 transition-all duration-300 mt-auto hover:scale-[1.02] shadow-[0_0_20px_rgba(29,185,84,0.15)]"
      >
        Assinar {plan.name}
      </Link>
    </div>
  )
}

export function Pricing() {
  const containerRef = useRef<HTMLDivElement>(null)
  useGsapAnimations(containerRef)

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-black py-32">
      <div className="container relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl gsap-grow">
          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Planos</h2>
          <p className="text-[#A0A0A0] text-lg font-medium">
            Escolha o pacote ideal para as necessidades da sua operação. Desbloqueie o poder da IA
            hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 gsap-stagger-container">
          {/* Highlighted Completo - takes full width on small, 6 cols on large */}
          <div className="md:col-span-12 lg:col-span-6 bg-[#1DB954] rounded-[32px] p-8 md:p-12 flex flex-col gsap-stagger-item hover:scale-[1.01] transition-transform duration-500 shadow-[0_0_40px_rgba(29,185,84,0.15)] relative overflow-hidden">
            <div className="absolute top-8 right-8 bg-black text-[#1DB954] px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase">
              POPULAR
            </div>

            <div className="flex-1">
              <h3 className="text-black text-3xl font-black mb-2 tracking-tight">
                {plans[3].name}
              </h3>
              <p className="text-black/70 font-bold mb-10">{plans[3].description}</p>

              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-6xl font-black text-black tracking-tighter">
                  {plans[3].price}
                </span>
                <span className="text-black/70 font-black text-lg">{plans[3].period}</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plans[3].features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-black font-bold">
                    <div className="rounded-full p-1 bg-black/10">
                      <Check className="w-4 h-4" strokeWidth={4} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/cadastro"
              className="w-full py-5 bg-black text-white rounded-full font-black text-center hover:bg-black/80 hover:scale-[1.02] transition-all duration-300 mt-auto shadow-lg"
            >
              Assinar Completo Agora
            </Link>
          </div>

          {/* Plantio & Pecuaria stacked */}
          <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-6">
            <PricingCard plan={plans[1]} className="flex-1" />
            <PricingCard plan={plans[0]} className="flex-1" />
          </div>

          <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-6">
            <PricingCard plan={plans[2]} className="flex-1" />
            <PricingCard plan={plans[4]} className="flex-1" />
          </div>
        </div>
      </div>
    </section>
  )
}
