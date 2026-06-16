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
    <section className="py-24 bg-[#111A13] border-y border-white/5">
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">A diferença é clara</h2>
          <p className="text-[#A0AFA3] max-w-2xl mx-auto text-lg">
            Veja o impacto direto de implementar tecnologia na sua rotina.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          <ScrollReveal delay={100}>
            <div className="bg-[#0A0F0D] border border-red-500/20 rounded-3xl p-8 md:p-10 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-red-400 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </span>
                Fazenda Tradicional
              </h3>
              <ul className="space-y-6 flex-1">
                {without.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[#A0AFA3]">
                    <X className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-[#1B5E20]/10 border border-[#00C853]/30 rounded-3xl p-8 md:p-10 h-full flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(0,200,83,0.1)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C853]/10 rounded-bl-full pointer-events-none"></div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C853] text-[#0A0F0D] px-4 py-1 rounded-b-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-sm">
                Com AgroIA
              </div>
              <h3 className="text-2xl font-bold text-[#00C853] mb-8 flex items-center gap-3 mt-4">
                <span className="w-10 h-10 rounded-full bg-[#00C853]/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#00C853]" />
                </span>
                Fazenda do Futuro
              </h3>
              <ul className="space-y-6 flex-1">
                {withAgroia.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-white">
                    <Check className="w-5 h-5 text-[#00C853] shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(0,200,83,0.5)]" />
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
