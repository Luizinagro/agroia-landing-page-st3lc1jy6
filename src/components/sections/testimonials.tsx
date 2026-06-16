import { ScrollReveal } from '@/components/ScrollReveal'
import { Star } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: 'João Silva',
      role: 'Produtor de Soja - MT',
      content:
        'A previsão de IA mudou completamente a forma como decido a hora da colheita. Minha lucratividade aumentou significativamente na última safra.',
      image: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
    },
    {
      name: 'Mariana Costa',
      role: 'Pecuária de Corte - GO',
      content:
        'Gerenciar o rebanho nunca foi tão fácil. O sistema é impecável e muito simples de usar no dia a dia com a equipe da fazenda.',
      image: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    },
    {
      name: 'Carlos Mendes',
      role: 'Cooperativa Agro - PR',
      content:
        'Integrar nossos cooperados com a plataforma nos deu uma visão em tempo real da produção da região. Foi um divisor de águas.',
      image: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    },
  ]

  return (
    <section className="py-24 bg-[#0A0F0D]">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            O que dizem nossos produtores
          </h2>
          <p className="text-[#A0AFA3] max-w-2xl mx-auto text-lg">
            Pessoas reais colhendo resultados reais em todos os cantos do Brasil.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 150} className="h-full">
              <div className="bg-[#111A13] border border-white/5 rounded-2xl p-8 shadow-sm hover:border-[#00C853]/20 transition-colors flex flex-col h-full relative group">
                <div className="absolute top-0 right-8 w-12 h-1 bg-[#00C853] rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#F9A825] text-[#F9A825]" />
                  ))}
                </div>
                <p className="text-white text-lg mb-8 italic leading-relaxed flex-1">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#1B5E20]"
                  />
                  <div>
                    <p className="text-white font-bold">{t.name}</p>
                    <p className="text-[#00C853] text-sm font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
