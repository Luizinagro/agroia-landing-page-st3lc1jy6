import { ScrollReveal } from '@/components/ScrollReveal'
import { X, Check } from 'lucide-react'

export function Comparison() {
  const without = [
    'Decisões baseadas em intuição ou métodos antigos',
    'Anotações espalhadas em cadernos e planilhas',
    'Desperdício de água e defensivos sem alvo certo',
    'Dias esperando análises de laboratório para pragas',
    'Surpresas com mudanças climáticas repentinas',
  ]

  const withAgroia = [
    'Decisões baseadas em dados precisos e predições',
    'Toda a fazenda centralizada em um app de bolso',
    'Economia de insumos com aplicação localizada',
    'Diagnóstico de doenças em 30 segundos por foto',
    'Alertas antecipados para proteger a safra',
  ]

  return (
    <section className="py-12 md:py-20 bg-[#070F07] border-y border-[#1E3A1E]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-4">
            Antes e depois da AgroIA
          </h2>
          <p className="text-[#A8B8A0] max-w-2xl mx-auto text-lg">
            Veja o impacto direto de implementar tecnologia na sua rotina.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          <ScrollReveal delay={100}>
            <div className="bg-[#0D1F0D] border border-red-500/20 rounded-xl px-6 py-7 md:p-10 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-red-400 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <X className="w-5 h-5 text-red-500" />
                </span>
                Fazenda Tradicional
              </h3>
              <ul className="space-y-6 flex-1">
                {without.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[#A8B8A0]">
                    <X className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-[#1A3A1A]/30 border border-[#6DBF4A]/30 rounded-xl px-6 py-7 md:p-10 h-full flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(109,191,74,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6DBF4A]/10 rounded-bl-full pointer-events-none"></div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#4A8A1A] border border-[#6DBF4A] text-[#F5F0E8] px-4 py-1 rounded-b-lg text-xs font-bold uppercase tracking-wider shadow-sm z-10">
                COM AGROIA
              </div>

              <h3 className="text-2xl font-bold text-[#6DBF4A] mb-8 flex items-center gap-3 mt-4">
                <span className="w-10 h-10 rounded-full bg-[#6DBF4A]/20 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-[#6DBF4A]" />
                </span>
                Fazenda do Futuro
              </h3>
              <ul className="space-y-6 flex-1">
                {withAgroia.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[#F5F0E8]">
                    <Check className="w-5 h-5 text-[#6DBF4A] shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(109,191,74,0.5)]" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
