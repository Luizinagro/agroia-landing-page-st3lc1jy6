import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#0A0F0D]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,200,83,0.15)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          <div className="w-full lg:w-[60%] space-y-8 text-center lg:text-left">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B5E20]/40 border border-[#00C853]/20 text-white text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C853] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C853]"></span>
                </span>
                Mais de 500 produtores já usam a AgroIA
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-sm">
                A IA que trabalha
                <br />
                <span className="text-[#00C853] block mt-2 drop-shadow-[0_0_20px_rgba(0,200,83,0.3)]">
                  na sua roça
                </span>
                enquanto você dorme
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-lg md:text-xl text-[#A0AFA3] max-w-2xl mx-auto lg:mx-0 font-medium">
                Diagnóstico de pragas em 30 segundos, irrigação inteligente, preços em tempo real e
                rastreabilidade total. Tome decisões baseadas em dados e multiplique seu lucro.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to="/cadastro" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full h-14 px-8 bg-[#00C853] text-[#0A0F0D] hover:bg-[#00C853]/90 font-bold text-lg gap-2 shadow-[0_0_25px_rgba(0,200,83,0.4)] hover:shadow-[0_0_35px_rgba(0,200,83,0.6)] transition-all hover:-translate-y-0.5 rounded-xl"
                  >
                    Começar Grátis por 7 Dias <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="#como-funciona" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-14 px-8 border-white/20 text-white hover:bg-white/10 hover:text-white font-semibold text-lg transition-all rounded-xl"
                  >
                    Ver como funciona <ChevronDown className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="w-full lg:w-[40%] flex justify-center relative mt-10 lg:mt-0">
            <ScrollReveal delay={400} className="relative w-full max-w-[320px]">
              <div className="absolute inset-0 bg-[#00C853] rounded-full blur-[100px] opacity-20 animate-pulse-glow"></div>

              <div className="relative z-10 bg-[#111A13] border-[6px] border-[#2E7D32] rounded-[40px] overflow-hidden shadow-2xl aspect-[9/19] w-full transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 inset-x-0 h-6 bg-[#2E7D32] rounded-b-xl w-32 mx-auto z-20"></div>
                <img
                  src="https://img.usecurling.com/p/400/800?q=dashboard%20app%20interface%20agriculture%20green&color=green"
                  alt="AgroIA Dashboard App"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F0D] via-transparent to-transparent opacity-80"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
