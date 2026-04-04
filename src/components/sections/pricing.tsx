import { useState, useRef } from 'react'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

const desktopPlans = [
  {
    name: 'Básico',
    price: 'Grátis',
    description: 'Comece sem custo e conheça a plataforma.',
    cardText:
      'Ideal para quem quer dar os primeiros passos no Agro IA e testar a experiência da plataforma antes de avançar para recursos mais completos.',
    features: [
      'Acesso inicial à plataforma',
      'Visão geral dos recursos',
      'Entrada sem risco',
      'Ideal para conhecer o sistema',
    ],
    ctaText: 'Começar grátis',
    highlighted: false,
  },
  {
    name: 'Plantio Solo',
    price: 'R$ 149',
    period: '/mês',
    description: 'Mais controle e previsibilidade para sua lavoura.',
    cardText:
      'Perfeito para produtores que querem organizar melhor o plantio, acompanhar informações com mais clareza e tomar decisões com mais segurança no dia a dia da operação.',
    features: [
      'Gestão focada em plantio',
      'Mais organização operacional',
      'Melhor acompanhamento da produção',
      'Decisão mais assertiva no campo',
    ],
    ctaText: 'Assinar Plantio Solo',
    highlighted: false,
  },
  {
    name: 'Pecuária Solo',
    price: 'R$ 199',
    period: '/mês',
    description: 'Mais precisão e controle na gestão do rebanho.',
    cardText:
      'Indicado para quem atua com pecuária e precisa acompanhar dados do rebanho, melhorar a gestão da operação e reduzir falhas no controle das atividades.',
    features: [
      'Gestão focada em pecuária',
      'Melhor controle do rebanho',
      'Mais segurança nas informações',
      'Acompanhamento mais eficiente',
    ],
    ctaText: 'Assinar Pecuária Solo',
    highlighted: false,
  },
  {
    name: 'Completo',
    price: 'R$ 349',
    period: '/mês',
    description: 'A solução ideal para quem quer visão total da operação.',
    cardText:
      'Reúne os principais recursos da plataforma em um só plano, entregando mais controle, mais inteligência e melhor custo-benefício para quem quer gerir a produção com visão completa.',
    features: [
      'Recursos integrados em um só plano',
      'Visão mais ampla da operação',
      'Melhor custo-benefício',
      'Mais controle e estratégia',
    ],
    ctaText: 'Escolher plano Completo',
    highlighted: true,
  },
  {
    name: 'Família Coop',
    price: 'R$ 799',
    period: '/mês',
    description: 'Mais estrutura para operações maiores e gestão compartilhada.',
    cardText:
      'Feito para famílias, grupos e operações com maior escala, que precisam de mais organização, visão consolidada e capacidade de gestão em um nível mais avançado.',
    features: [
      'Ideal para operações maiores',
      'Gestão mais estruturada',
      'Melhor visão do todo',
      'Escala com mais controle',
    ],
    ctaText: 'Assinar Família Coop',
    highlighted: false,
  },
]

const mobilePlans = [
  {
    name: 'Básico',
    price: 'Grátis',
    description: 'Comece sem custo.',
    cardText: 'Ideal para conhecer a plataforma.',
    features: ['Acesso inicial', 'Teste sem risco', 'Entrada rápida'],
    ctaText: 'Começar grátis',
    highlighted: false,
  },
  {
    name: 'Plantio Solo',
    price: 'R$ 149',
    period: '/mês',
    description: 'Mais controle no plantio.',
    cardText: 'Feito para quem quer organizar melhor a lavoura.',
    features: ['Gestão de plantio', 'Mais previsibilidade', 'Melhor acompanhamento'],
    ctaText: 'Assinar',
    highlighted: false,
  },
  {
    name: 'Pecuária Solo',
    price: 'R$ 199',
    period: '/mês',
    description: 'Mais precisão na pecuária.',
    cardText: 'Controle melhor o rebanho e a operação.',
    features: ['Gestão pecuária', 'Controle do rebanho', 'Mais segurança nos dados'],
    ctaText: 'Assinar',
    highlighted: false,
  },
  {
    name: 'Completo',
    price: 'R$ 349',
    period: '/mês',
    description: 'Visão total da operação em um só plano.',
    cardText: 'A solução ideal para quem quer visão completa, controle e inteligência integrados.',
    features: ['Recursos integrados', 'Melhor custo-benefício', 'Mais controle e estratégia'],
    ctaText: 'Escolher plano',
    highlighted: true,
  },
  {
    name: 'Família Coop',
    price: 'R$ 799',
    period: '/mês',
    description: 'Mais estrutura para crescer.',
    cardText: 'Ideal para famílias e operações maiores.',
    features: ['Gestão compartilhada', 'Mais escala', 'Visão consolidada'],
    ctaText: 'Assinar',
    highlighted: false,
  },
]

export function Pricing() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const isMobile = useIsMobile()

  const activePlans = isMobile ? mobilePlans : desktopPlans

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
            Escolha o plano ideal para a sua operação
          </h2>
          <p className="text-zinc-400 text-lg font-medium">
            Comece grátis ou avance para mais controle, inteligência e gestão no campo.
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
              {activePlans.slice(0, 3).map((plan, i) => (
                <PricingCard key={i} plan={plan} />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              {activePlans.slice(3, 5).map((plan, i) => (
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
          ? 'bg-zinc-900/90 border-2 border-green-500 shadow-[0_0_40px_-15px_rgba(34,197,94,0.5)] z-10 md:scale-[1.02]'
          : 'bg-black border border-white/5 hover:bg-zinc-900/40 hover:border-white/10',
      )}
    >
      {plan.highlighted && (
        <div className="absolute top-0 right-8 -translate-y-1/2">
          <div className="bg-primary text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            Mais popular
          </div>
        </div>
      )}

      <h3 className="text-2xl font-black mb-2 text-white">{plan.name}</h3>
      <p className="text-zinc-400 text-sm font-medium mb-6 min-h-[40px]">{plan.description}</p>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-5xl font-black tracking-tighter text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          {plan.price}
        </span>
        {plan.period && <span className="font-bold text-sm text-zinc-500">{plan.period}</span>}
      </div>

      <p className="text-zinc-500 text-sm mb-8 min-h-[80px] leading-relaxed">{plan.cardText}</p>

      <ul className="space-y-4 mb-8 flex-1">
        {plan.features.map((f: string, j: number) => (
          <li key={j} className="flex items-start gap-3 text-sm font-semibold text-zinc-300">
            <div className="mt-0.5 rounded-full p-1 bg-primary/10 text-primary shrink-0">
              <Check className="w-3 h-3" strokeWidth={3} />
            </div>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={cn(
          'w-full h-auto py-4 mt-4 rounded-full font-black text-sm md:text-base tracking-wide uppercase transition-all duration-300 bg-green-500 text-black hover:bg-green-600 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] shadow-[0_0_15px_rgba(34,197,94,0.3)] whitespace-normal text-center',
          plan.highlighted &&
            'shadow-[0_0_25px_rgba(34,197,94,0.6)] md:scale-105 hover:md:scale-110 bg-green-400 hover:bg-green-500',
        )}
      >
        <Link to="/cadastro">{plan.ctaText}</Link>
      </Button>
    </div>
  )
}
