import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AnimatedSection } from '@/components/animated-section'

const testimonials = [
  {
    name: 'João Batista',
    role: 'Produtor de Soja, Cascavel - PR',
    content:
      'A precisão da inteligência artificial nas previsões climáticas mudou nossa janela de plantio. Economizamos muito em insumos nesta safra.',
    image: 'https://img.usecurling.com/ppl/medium?seed=12',
  },
  {
    name: 'Cooperativa AgroOeste',
    role: 'Gestão Cooperativa, Toledo - PR',
    content:
      'O módulo de faturamento em nuvem integrou nossos 50 cooperados perfeitamente. A rastreabilidade exigida pela UE agora é automática.',
    image: 'https://img.usecurling.com/i?q=farm&color=green&shape=fill',
    isCompany: true,
  },
  {
    name: 'Carlos Mendes',
    role: 'Pecuarista, Região Oeste',
    content:
      'O monitoramento do pasto por imagem reduziu nossa perda nutricional. O gado está ganhando peso mais rápido e com menos custo operacional.',
    image: 'https://img.usecurling.com/ppl/medium?seed=45',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-primary/5">
      <div className="container px-4 md:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Depoimentos</h2>
          <p className="text-muted-foreground text-lg">
            Veja o que os produtores e cooperativas da nossa região estão falando sobre os
            resultados com a AgroIA.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={index} delay={index * 150}>
              <Card className="h-full bg-white border-none shadow-elevation relative pt-6">
                <div className="absolute -top-6 left-6">
                  <Avatar className="w-16 h-16 border-4 border-white shadow-sm bg-muted">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                      className={testimonial.isCompany ? 'object-contain p-2' : 'object-cover'}
                    />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="pt-6 pb-2">
                  <div className="flex text-secondary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed italic line-clamp-4">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
