import { useState, useRef } from 'react'
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
    name: 'Plantio Solo',
    price: 'R$147',
    period: '/mês',
    description: 'Focado em agricultura',
    features: [
      'Tudo do Básico',
      'Rastreabilidade',
      'Calculadora ROI',
      'Alertas de Preço (Plantio)',
    ],
    highlighted: false,
  },
  {
    name: 'Pecuário Solo',
    price: 'R$147',
    period: '/mês',
    description: 'Focado em pecuária',
    features: [
      'Tudo do Básico',
      'Gestão de Rebanho',
      'Previsão de Engorda',
      'Alertas de Preço (Gado)',
    ],
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
    price: 'R$597',
    period: '/mês',
    description: 'Para cooperativas',
    features: [
      'Múltiplas Propriedades',
      'Relatórios Consolidados',
      'Acesso Multi-usuário',
      'Consultoria Dedicada',
    ],
    highlighted: false,
  },
]

export function Pricing() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <section id="planos" className="py-32 bg-black relative">
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

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="group relative rounded-[2.5rem] bg-zinc-950 p-2 overflow-hidden border border-white/5"
          style={
            {
              '--x': `${mousePos.x}px`,
              '--y': `${mousePos.y}px`,
            } as React.CSSProperties
          }
        >
          {/* Mouse follow gradient for connecting grid lines effect */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
            style={{
              background:
                'radial-gradient(800px circle at var(--x) var(--y), rgba(34,197,94,0.4), transparent 40%)',
            }}
          />

          <div className="relative z-10 flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {plans.slice(0, 3).map((plan, i) => (
                <PricingCard key={i} plan={plan} />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              {plans.slice(3, 5).map((plan, i) => (
                <PricingCard key={i} plan={plan} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingCard({ plan }: { plan: any }) {
  return (
    <div
      className={cn(
        'relative h-full flex flex-col p-8 rounded-[2.2rem] transition-all duration-300',
        plan.highlighted
          ? 'bg-zinc-900/90 shadow-[0_0_40px_-15px_rgba(34,197,94,0.3)]'
          : 'bg-black hover:bg-zinc-900/40',
      )}
    >
      {plan.highlighted && (
        <div className="absolute top-0 right-8 -translate-y-1/2">
          <div className="bg-primary text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            Recomendado
          </div>
        </div>
      )}

      <h3 className="text-2xl font-black mb-2 text-white">{plan.name}</h3>
      <p className="text-zinc-400 text-sm font-medium mb-8 h-10">{plan.description}</p>

      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-5xl font-black tracking-tighter text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          {plan.price}
        </span>
        {plan.period && <span className="font-bold text-sm text-zinc-500">{plan.period}</span>}
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {plan.features.map((f: string, j: number) => (
          <li key={j} className="flex items-start gap-3 text-sm font-semibold text-zinc-300">
            <div className="mt-0.5 rounded-full p-1 bg-primary/10 text-primary">
              <Check className="w-3 h-3" strokeWidth={3} />
            </div>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={cn(
          'w-full h-14 mt-4 rounded-full font-black text-lg tracking-wide uppercase transition-all duration-300 bg-green-500 text-black hover:bg-green-600 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] shadow-[0_0_15px_rgba(34,197,94,0.3)]',
          plan.highlighted && 'shadow-[0_0_25px_rgba(34,197,94,0.5)] scale-105',
        )}
      >
        <Link to="/cadastro">Assinar</Link>
      </Button>
    </div>
  )
}
