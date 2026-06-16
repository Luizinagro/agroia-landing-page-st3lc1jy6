import { ScrollReveal } from '@/components/ScrollReveal'
import { Star } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: 'João Silva',
      role: 'Produtor de Soja',
      state: 'MT',
      content:
        'A previsão de IA mudou completamente a forma como decido a hora da colheita. Minha lucratividade aumentou significativamente na última safra.',
      image: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
    },
    {
      name: 'Mariana Costa',
      role: 'Pecuária de Corte',
      state: 'GO',
      content:
        'Gerenciar o rebanho nunca foi tão fácil. O sistema é impecável e muito simples de usar no dia a dia com a equipe da fazenda.',
      image: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    },
    {
      name: 'Carlos Mendes',
      role: 'Cooperativa Agro',
      state: 'PR',
      content:
        'Integrar nossos cooperados com a plataforma nos deu uma visão em tempo real da produção da região. Foi um divisor de águas.',
      image: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-[#0A1A0A]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-4">
            O que dizem nossos produtores
          </h2>
          <p className="text-[#A8B8A0] max-w-2xl mx-auto text-lg">
            Pessoas reais colhendo resultados reais em todos os cantos do Brasil.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 150} className="h-full">
              <div className="bg-[#0D1F0D] border border-[#1E3A1E] rounded-xl px-6 py-7 shadow-sm hover:border-[#6DBF4A]/30 transition-colors flex flex-col h-full relative group">
                <div className="absolute top-0 right-8 w-12 h-1 bg-[#6DBF4A] rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#FFB74D] text-[#FFB74D]" />
                  ))}
                </div>
                <p className="text-[#F5F0E8] text-lg mb-8 italic leading-relaxed flex-1">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-[#1E3A1E]">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#4A8A1A]"
                  />
                  <div className="flex flex-col">
                    <p className="text-[#F5F0E8] font-bold">{t.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[#A8B8A0] text-sm font-medium">{t.role}</p>
                      <span className="text-[#6DBF4A] font-bold text-sm">• {t.state}</span>
                    </div>
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
