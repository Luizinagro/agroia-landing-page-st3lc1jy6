import { ScrollReveal } from '@/components/ScrollReveal'
import { TrendingUp, Droplet, Clock } from 'lucide-react'

export function Results() {
  const results = [
    {
      icon: TrendingUp,
      title: 'Economia Média',
      value: 'R$ 3.200',
      suffix: '/mês',
      desc: 'Na otimização de insumos e defensivos com aplicação localizada baseada em IA.',
    },
    {
      icon: Droplet,
      title: 'Redução de Água',
      value: '30%',
      suffix: '',
      desc: 'Com alertas climáticos precisos e recomendações de irrigação inteligente.',
    },
    {
      icon: Clock,
      title: 'Agilidade',
      value: '4x',
      suffix: ' mais rápido',
      desc: 'Na identificação de doenças e pragas comparado ao método tradicional visual.',
    },
  ]

  return (
    <section className="py-20 bg-[#111A13] relative overflow-hidden border-y border-white/5">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C853]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F9A825]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-[#F9A825]/10 border border-[#F9A825]/20 text-[#F9A825] rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
            Resultados Reais
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Baseado em médias da Embrapa
          </h2>
          <p className="text-[#A0AFA3] max-w-2xl mx-auto">
            O impacto da agricultura de precisão e da IA diretamente no caixa da sua propriedade.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {results.map((res, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-[#0A0F0D] border border-white/5 rounded-2xl p-8 h-full flex flex-col justify-between hover:border-[#00C853]/20 transition-colors">
                <div>
                  <res.icon className="w-8 h-8 text-[#00C853] mb-6" />
                  <h3 className="text-lg font-medium text-[#A0AFA3] mb-2">{res.title}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black text-white">{res.value}</span>
                    <span className="text-[#A0AFA3] font-medium">{res.suffix}</span>
                  </div>
                </div>
                <p className="text-sm text-[#A0AFA3] leading-relaxed border-t border-white/5 pt-4">
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
