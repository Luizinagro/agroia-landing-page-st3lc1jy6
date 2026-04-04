import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'João Batista',
    role: 'Produtor de Soja',
    content:
      'A precisão da inteligência artificial mudou nossa janela de plantio. Economizamos muito em insumos nesta safra.',
    image: 'https://img.usecurling.com/ppl/medium?seed=12',
  },
  {
    name: 'Cooperativa AgroOeste',
    role: 'Gestão Cooperativa',
    content:
      'O módulo de faturamento em nuvem integrou nossos 50 cooperados perfeitamente. A rastreabilidade agora é automática.',
    image: 'https://img.usecurling.com/i?q=farm&color=green&shape=fill',
  },
  {
    name: 'Carlos Mendes',
    role: 'Pecuarista',
    content:
      'O monitoramento do pasto reduziu nossa perda nutricional. O gado está ganhando peso mais rápido e com menos custo.',
    image: 'https://img.usecurling.com/ppl/medium?seed=45',
  },
]

export function Testimonials() {
  return (
    <section className="py-32 bg-zinc-950 relative">
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
            Depoimentos
          </h2>
          <p className="text-zinc-400 text-lg font-medium max-w-2xl">
            Veja o que os produtores e cooperativas da nossa região estão falando sobre os
            resultados com a AgroIA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-black border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between hover:border-primary/50 transition-colors duration-300"
            >
              <div className="flex text-primary mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-white text-lg font-semibold leading-relaxed mb-10 flex-1">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarImage src={testimonial.image} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black text-base text-white">{testimonial.name}</h3>
                  <p className="text-sm font-medium text-zinc-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
