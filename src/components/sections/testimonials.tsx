import { Star } from 'lucide-react'
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
    <section className="py-32 bg-black overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1DB954]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <AnimatedSection className="mb-16">
          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Depoimentos</h2>
          <p className="text-[#A0A0A0] text-lg font-medium max-w-2xl">
            Veja o que os produtores e cooperativas da nossa região estão falando sobre os
            resultados com a AgroIA.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection
              key={index}
              delay={index * 150}
              className={
                index === 0 ? 'lg:col-span-5' : index === 1 ? 'lg:col-span-7' : 'lg:col-span-12'
              }
            >
              <div className="h-full bg-[#050505] border border-white/5 rounded-[32px] p-8 md:p-10 flex flex-col justify-between hover:border-[#1DB954]/30 transition-colors duration-500">
                <div className="flex text-[#1DB954] mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed mb-10 flex-1">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 border-2 border-[#1DB954]/20 bg-black">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                      className={testimonial.isCompany ? 'object-contain p-2' : 'object-cover'}
                    />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-black text-lg text-white">{testimonial.name}</h3>
                    <p className="text-sm font-medium text-[#A0A0A0]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
