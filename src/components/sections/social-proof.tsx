import { ScrollReveal } from '@/components/ScrollReveal'
import { CountUp } from '@/components/CountUp'

export function SocialProof() {
  const stats = [
    { label: 'Produtores ativos', value: 500, suffix: '+' },
    { label: 'Economizados (Média)', value: 15000, prefix: 'R$ ' },
    { label: 'Diagnóstico IA', value: 30, suffix: 's' },
    { label: 'Módulos IA', value: 9 },
  ]

  return (
    <section className="py-12 bg-[#111A13] border-y border-white/5 relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 100} className="text-center px-4">
              <div className="text-3xl md:text-4xl font-extrabold text-[#00C853] mb-2 drop-shadow-[0_0_10px_rgba(0,200,83,0.2)]">
                <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base text-[#A0AFA3] font-medium">{stat.label}</div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[#A0AFA3] text-xs font-medium gap-4">
          <div className="flex items-center gap-2">
            <span>Powered by:</span>
            <span className="text-white">Google Gemini</span>
            <span className="text-white/20">•</span>
            <span className="text-white">Open-Meteo</span>
            <span className="text-white/20">•</span>
            <span className="text-white">Supabase</span>
          </div>
          <div className="flex items-center gap-2 bg-[#1B5E20]/20 px-3 py-1.5 rounded-full border border-[#00C853]/10 text-[#00C853]">
            Dados em servidores brasileiros 🇧🇷
          </div>
        </div>
      </div>
    </section>
  )
}
