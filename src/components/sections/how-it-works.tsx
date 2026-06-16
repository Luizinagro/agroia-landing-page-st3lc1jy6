import { ScrollReveal } from '@/components/ScrollReveal'
import { Map, Zap, LineChart } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Map,
      title: '1. Cadastre sua propriedade',
      desc: 'Mapeie sua fazenda, defina as culturas e insira os dados básicos da sua operação em poucos cliques.',
    },
    {
      icon: Zap,
      title: '2. Conecte seus dados',
      desc: 'Integre sensores, insira fotos de pragas ou dados manuais. Nossa plataforma processa tudo em tempo real.',
    },
    {
      icon: LineChart,
      title: '3. Receba insights da IA',
      desc: 'Acesse previsões de safra, alertas climáticos e recomendações de manejo para maximizar seus lucros.',
    },
  ]

  return (
    <section id="como-funciona" className="py-24 bg-[#0A0F0D]">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Como começar em <span className="text-[#00C853]">3 passos</span>
          </h2>
          <p className="text-[#A0AFA3] text-lg max-w-2xl mx-auto">
            Uma plataforma robusta, mas desenhada para ser simples. Você não precisa ser um expert
            em tecnologia para usar a AgroIA.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#00C853]/10 via-[#00C853]/40 to-[#00C853]/10 z-0"></div>

          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 150} className="relative z-10">
              <div className="bg-[#111A13] border border-white/5 hover:border-[#00C853]/30 transition-all duration-300 rounded-2xl p-8 h-full flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,200,83,0.1)]">
                <div className="w-20 h-20 bg-[#1B5E20]/30 rounded-full flex items-center justify-center mb-6 border border-[#00C853]/20 group-hover:bg-[#00C853] transition-colors duration-300">
                  <step.icon className="w-10 h-10 text-[#00C853] group-hover:text-[#0A0F0D] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-[#A0AFA3] leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
