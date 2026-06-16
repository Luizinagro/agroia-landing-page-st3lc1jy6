import { ScrollReveal } from '@/components/ScrollReveal'
import { CountUp } from '@/components/CountUp'

export function SocialProof() {
  const stats = [
    { label: 'Produtores Confiam', value: 500, suffix: '+' },
    { label: 'Economizados por Safra', value: 15000, prefix: 'R$ ' },
    { label: 'Para Diagnóstico de Praga', value: 30, suffix: 's' },
    { label: 'Módulos de Inteligência', value: 9 },
  ]

  return (
    <>
      <section className="bg-[#0D1F0D] border-t border-[#1E3A1E] relative z-20 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-[#6DBF4A] mb-2 drop-shadow-[0_0_10px_rgba(109,191,74,0.2)]">
                  <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-sm md:text-base text-[#A8B8A0] font-medium">{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A1A0A] border-t border-[#1E3A1E] py-4">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="flex flex-col md:flex-row items-center justify-between text-[#A8B8A0] text-xs font-medium gap-4">
            <div className="flex items-center gap-2">
              <span>Powered by:</span>
              <span className="text-[#F5F0E8]">Google Gemini</span>
              <span className="text-white/20">•</span>
              <span className="text-[#F5F0E8]">Open-Meteo</span>
              <span className="text-white/20">•</span>
              <span className="text-[#F5F0E8]">Supabase</span>
            </div>
            <div className="flex items-center gap-2 bg-[#4A8A1A]/20 px-3 py-1.5 rounded-full border border-[#6DBF4A]/20 text-[#6DBF4A]">
              Dados em servidores brasileiros 🇧🇷
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
