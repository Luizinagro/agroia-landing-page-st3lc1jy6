import { Check } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/animated-section'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Básico',
    price: 'Grátis',
    description: 'Ideal para começar',
    features: ['Pecuária Básica', 'Previsão IA (Limitado)'],
    highlighted: false,
  },
  {
    name: 'Plantio Solo',
    price: 'R$147',
    period: '/mês',
    description: 'Para pequenos produtores',
    features: ['Pecuária', 'Previsão IA 92% precisão', 'Rastreabilidade', 'Calculadora ROI'],
    highlighted: false,
  },
  {
    name: 'Pecuária Solo',
    price: 'R$197',
    period: '/mês',
    description: 'Foco em rebanhos',
    features: ['Pecuária Avançada', 'Previsão IA', 'Rastreabilidade', 'Calculadora ROI'],
    highlighted: false,
  },
  {
    name: 'Completo',
    price: 'R$347',
    period: '/mês',
    description: 'A solução definitiva',
    features: ['Todas as Funcionalidades', 'Loja de Insumos', 'Suporte Prioritário 24/7'],
    highlighted: true,
  },
  {
    name: 'Família Coop',
    price: 'R$747',
    period: '/mês',
    description: 'Para grandes grupos',
    features: ['Tudo do Completo', 'Até 5 Propriedades', 'Relatórios Consolidados'],
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section className="py-32 bg-[#050A15] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D1FF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-6 tracking-tight">
            Planos para Escalar sua Produtividade
          </h2>
          <p className="text-white/50 text-lg md:text-xl font-medium">
            Escolha o pacote ideal para as necessidades da sua operação. Desbloqueie o poder da IA
            hoje.
          </p>
        </AnimatedSection>

        <div className="grid-responsive">
          {plans.map((plan, index) => (
            <AnimatedSection key={index} delay={index * 100} className="flex">
              <Card
                className={cn(
                  'flex flex-col w-full relative transition-all duration-500 overflow-hidden backdrop-blur-xl',
                  plan.highlighted
                    ? 'bg-gradient-to-b from-[#00FF94]/10 to-white/5 border-[#00FF94]/50 shadow-[0_0_30px_rgba(0,255,148,0.15)] scale-105 z-10'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10',
                )}
              >
                {plan.highlighted && (
                  <>
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00FF94] to-[#00D1FF]" />
                    <div className="absolute -top-4 right-4 bg-[#00FF94] text-[#050A15] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mt-6 shadow-[0_0_15px_rgba(0,255,148,0.5)]">
                      Popular
                    </div>
                  </>
                )}

                <CardHeader className="text-left pb-6 pt-8">
                  <CardTitle className="text-2xl mb-2 text-white font-bold">{plan.name}</CardTitle>
                  <p className="text-sm text-white/50 mb-6 h-10">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-white/50 font-medium">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
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
                              ? 'bg-[#00FF94]/20 text-[#00FF94]'
                              : 'bg-white/10 text-white',
                          )}
                        >
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6 pb-8">
                  <Button
                    asChild
                    className={cn(
                      'w-full font-bold transition-all duration-300 rounded-xl py-6',
                      plan.highlighted
                        ? 'bg-[#00FF94] hover:bg-white text-[#050A15] shadow-[0_0_20px_rgba(0,255,148,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                        : 'bg-white/10 hover:bg-white/20 text-white',
                    )}
                  >
                    <Link to="/cadastro">Assinar Agora</Link>
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
