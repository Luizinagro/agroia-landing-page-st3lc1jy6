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
            <ScrollReveal delay={400} className="relative w-full max-w-[400px]">
              <div
                id="hero-image"
                className="relative z-10 bg-[#111A13] border-2 border-dashed border-[#00C853] rounded-[16px] overflow-hidden aspect-[4/5] w-full flex flex-col items-center justify-center text-center p-6"
                style={{
                  boxShadow: '0 0 40px rgba(0, 200, 83, 0.2)',
                }}
              >
                <div className="w-16 h-16 rounded-full bg-[#00C853]/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-[#00C853]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Imagem personalizada em breve
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  Alta qualidade &middot; Gerada por IA
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
