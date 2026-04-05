import { Star } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: 'João Silva',
      role: 'Produtor de Soja',
      content:
        'A previsão de IA da AgroIA mudou completamente a forma como decido a hora da colheita. Minha lucratividade aumentou significativamente em apenas uma safra!',
      image: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
    },
    {
      name: 'Mariana Costa',
      role: 'Pecuária de Corte',
      content:
        'Gerenciar o rebanho nunca foi tão fácil. O sistema de rastreabilidade é impecável e muito simples de usar no dia a dia com a equipe da fazenda.',
      image: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    },
    {
      name: 'Carlos Mendes',
      role: 'Cooperativa Agro',
      content:
        'Integrar nossos cooperados com a plataforma da AgroIA nos deu uma visão em tempo real da produção de toda a nossa região. Foi um divisor de águas.',
      image: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    },
  ]

  return (
    <section className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            O que dizem nossos produtores
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Milhares de produtores já estão transformando suas propriedades e multiplicando seus
            lucros com a AgroIA.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-black border border-white/5 rounded-2xl p-8 shadow-sm hover:border-green-500/20 transition-colors flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-zinc-300 mb-8 italic leading-relaxed flex-1">"{t.content}"</p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-green-500/30"
                />
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-zinc-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
