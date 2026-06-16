import { ScrollReveal } from '@/components/ScrollReveal'
import { Map, Database, LineChart } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Map,
      title: 'Cadastre sua fazenda',
      desc: 'Informe o tamanho da sua propriedade, as culturas que planta e a localização. Leva menos de 5 minutos.',
    },
    {
      icon: Database,
      title: 'Conecte o que você já usa',
      desc: 'Tire fotos de pragas, insira dados manualmente ou integre sensores. A AgroIA processa tudo e entrega a análise.',
    },
    {
      icon: LineChart,
      title: 'Receba recomendações certeiras',
      desc: 'A IA analisa clima, solo, mercado e histórico da sua fazenda. Você recebe o que fazer — sem complicação.',
    },
  ]

  return (
    <section id="como-funciona" className="py-12 md:py-20 bg-[#070F07]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#F5F0E8] mb-6">
            Mais simples do que parece
          </h2>
          <p className="text-[#A8B8A0] text-lg max-w-2xl mx-auto">
            Você não precisa entender de tecnologia. Só de agronegócio.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#6DBF4A]/10 via-[#6DBF4A]/40 to-[#6DBF4A]/10 z-0"></div>

          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 150} className="relative z-10">
              <div className="bg-[#0D1F0D] border border-[#1E3A1E] hover:border-[#6DBF4A]/30 transition-all duration-300 rounded-xl px-6 py-7 h-full flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(109,191,74,0.1)]">
                <div className="w-20 h-20 bg-[#4A8A1A]/20 rounded-full flex items-center justify-center mb-6 border border-[#6DBF4A]/20 group-hover:bg-[#6DBF4A] transition-colors duration-300">
                  <step.icon className="w-10 h-10 text-[#6DBF4A] group-hover:text-[#0D1F0D] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#F5F0E8] mb-4">{step.title}</h3>
                <p className="text-[#A8B8A0] leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
