import { ScrollReveal } from '@/components/ScrollReveal'
import { TrendingUp, Droplet, Clock } from 'lucide-react'

export function Results() {
  const results = [
    {
      icon: TrendingUp,
      title: 'R$ 3.200',
      suffix: '/safra economizados',
      desc: 'Na redução de insumos e defensivos com aplicação localizada baseada em dados de satélite e IA.',
    },
    {
      icon: Droplet,
      title: '30%',
      suffix: 'menos água usada',
      desc: 'Com irrigação inteligente que calcula exatamente o que cada talhão precisa, sem desperdício.',
    },
    {
      icon: Clock,
      title: '4x',
      suffix: 'mais rápido',
      desc: 'Para identificar doenças e pragas. Enquanto o método tradicional demora dias, a IA responde em 30 segundos.',
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-[#0A1A0A] relative overflow-hidden border-y border-[#1E3A1E]">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6DBF4A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-[1200px]">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="inline-block px-4 py-1.5 bg-[#4A7A2A] border border-[#6DBF4A] text-[#F5F0E8] rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
            RESULTADOS COMPROVADOS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-4">
            O que muda na sua lavoura
          </h2>
          <p className="text-[#A8B8A0] max-w-2xl mx-auto text-lg">
            Baseado em médias da Embrapa e dados de produtores AgroIA.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {results.map((res, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-[#0D1F0D] border border-[#1E3A1E] border-l-[3px] border-l-[#4A8A1A] rounded-xl px-6 py-7 h-full flex flex-col justify-between hover:border-[#6DBF4A]/30 hover:border-l-[#6DBF4A] transition-colors">
                <div>
                  <res.icon className="w-8 h-8 text-[#6DBF4A] mb-6" />
                  <div className="flex flex-col items-start gap-1 mb-4">
                    <span className="text-4xl font-black text-[#6DBF4A]">{res.title}</span>
                    <span className="text-[#F5F0E8] font-bold mt-1">{res.suffix}</span>
                  </div>
                </div>
                <p className="text-sm text-[#A8B8A0] leading-relaxed border-t border-[#1E3A1E] pt-4 mt-2">
                  {res.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
