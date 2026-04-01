import { TrendingUp, Users, FileText, Tractor, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/animated-section'

const modules = [
  {
    title: 'Previsão IA',
    description: 'Modelos preditivos de alta precisão baseados em microclimas locais.',
    icon: TrendingUp,
    delay: 0,
  },
  {
    title: 'Comunidade Agro-Futuro',
    description: 'Conecte-se com produtores da região e troque experiências de sucesso.',
    icon: Users,
    delay: 100,
  },
  {
    title: 'SaaS Faturamento',
    description: 'Gestão financeira inteligente, integrada e simplificada para sua propriedade.',
    icon: FileText,
    delay: 200,
  },
  {
    title: 'Pecuária',
    description: 'Monitoramento de rebanho e otimização de pastagens com visão computacional.',
    icon: Tractor,
    delay: 300,
  },
]

export function Modules() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">4 Módulos Principais</h2>
          <p className="text-muted-foreground text-lg">
            Nossa plataforma oferece ferramentas essenciais para modernizar e potencializar os
            resultados da sua propriedade.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod, index) => (
            <AnimatedSection key={index} delay={mod.delay}>
              <Card className="h-full flex flex-col border-none shadow-subtle hover:shadow-elevation transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                    <mod.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl">{mod.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-base mb-6 flex-1 line-clamp-2">
                    {mod.description}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    className="w-full group/btn justify-between text-primary hover:text-primary hover:bg-primary/5"
                  >
                    Saiba Mais
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
