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
    features: ['Previsão do tempo local', 'Acesso à comunidade', 'Notícias do setor'],
    highlighted: false,
  },
  {
    name: 'Plantio Solo',
    price: 'R$147',
    period: '/mês',
    description: 'Para pequenos produtores',
    features: ['Previsão IA 92% precisão', 'Alertas de pragas', 'Suporte horário comercial'],
    highlighted: false,
  },
  {
    name: 'Pecuária Solo',
    price: 'R$197',
    period: '/mês',
    description: 'Foco em rebanhos',
    features: ['Monitoramento de pasto', 'Gestão de engorda', 'Alertas sanitários'],
    highlighted: false,
  },
  {
    name: 'Completo',
    price: 'R$347',
    period: '/mês',
    description: 'A solução definitiva',
    features: ['SaaS Faturamento', 'Rastreabilidade ESG', 'Suporte prioritário 24/7'],
    highlighted: true,
  },
  {
    name: 'Família Coop',
    price: 'R$747',
    period: '/mês',
    description: 'Para grandes grupos',
    features: ['Até 5 propriedades', 'Relatórios consolidados', 'Consultoria dedicada'],
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 md:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Planos Acessíveis</h2>
          <p className="text-muted-foreground text-lg">
            Escolha o plano ideal para o tamanho e a necessidade da sua operação agropecuária.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan, index) => (
            <AnimatedSection key={index} delay={index * 100} className="flex">
              <Card
                className={cn(
                  'flex flex-col w-full relative transition-all duration-300',
                  plan.highlighted
                    ? 'border-primary shadow-elevation scale-105 z-10'
                    : 'border-border shadow-subtle hover:border-primary/50',
                )}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase">
                    Mais Popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl mb-2 text-foreground">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground mb-1">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className={cn(
                      'w-full font-bold transition-colors',
                      plan.highlighted
                        ? 'bg-[#f4d03f] hover:bg-[#f4d03f]/90 text-[#1a3c34]'
                        : 'bg-[#1a3c34] hover:bg-[#1a3c34]/90 text-white',
                    )}
                  >
                    <Link to="/cadastro">Escolher Plano</Link>
                  </Button>
                </CardFooter>{' '}
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
