import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#0A0F0D]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,200,83,0.15)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 z-10 relative ![background:transparent]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 ![background:transparent]">
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

          <div className="w-full lg:w-[40%] flex justify-center relative mt-10 lg:mt-0 ![background:transparent] ![background-color:transparent] ![background-image:none]">
            <style>{`
              @keyframes mockup-3d {
                0%, 100% {
                  transform: perspective(800px) rotateY(-10deg) rotateX(4deg) translateY(0);
                }
                50% {
                  transform: perspective(800px) rotateY(-10deg) rotateX(4deg) translateY(-10px);
                }
              }
              .animate-mockup-3d {
                animation: mockup-3d 3s ease-in-out infinite;
              }
              @keyframes pulse-alert {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
              }
              .animate-pulse-alert {
                animation: pulse-alert 2s ease-in-out infinite;
              }
            `}</style>
            <ScrollReveal
              delay={400}
              className="relative w-full flex justify-center ![background:transparent] ![background-color:transparent] ![background-image:none]"
            >
              <div className="scale-[0.8] md:scale-100 transform origin-center">
                <div className="relative w-[240px] h-[480px] bg-[#0D0D1A] rounded-[36px] border-2 border-[#2A2A4A] shadow-[0_0_50px_rgba(0,200,83,0.3),0_25px_50px_rgba(0,0,0,0.6)] animate-mockup-3d overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-[#0D0D1A] rounded-b-[14px] z-20"></div>

                  {/* Screen */}
                  <div className="absolute inset-0 m-[2px] rounded-[32px] bg-[#0A0F0D] overflow-hidden flex flex-col gap-[6px] pt-[28px] px-[10px] pb-[10px] z-10">
                    {/* Header */}
                    <div className="flex flex-col mb-1 shrink-0">
                      <span className="text-[#00C853] text-[11px] font-bold">Dashboard AgroIA</span>
                      <span className="text-white text-[9px]">☀️ Fazenda São João · MT</span>
                    </div>

                    {/* Pest Alert */}
                    <div className="bg-[#1a0505] border border-[#FF5252] border-l-[3px] border-l-[#FF5252] rounded-md p-2 flex items-start gap-2 animate-pulse-alert shrink-0">
                      <span className="text-[12px] leading-none mt-0.5">🚨</span>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-white text-[10px] font-bold leading-none">
                            Alerta de Praga
                          </span>
                          <span className="bg-[#FF5252] text-white text-[7px] px-1 py-0.5 rounded leading-none font-bold">
                            URGENTE
                          </span>
                        </div>
                        <span className="text-gray-300 text-[8px] leading-tight">
                          Ferrugem detectada — Talhão 3
                        </span>
                      </div>
                    </div>

                    {/* NDVI Card */}
                    <div className="bg-[#051a05] border border-[#112a11] border-l-[3px] border-l-[#00C853] rounded-md p-2 flex flex-col shrink-0">
                      <span className="text-gray-300 text-[9px] mb-1 leading-none">
                        Saúde da Lavoura (NDVI)
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-[#00C853] text-[20px] font-bold leading-none">
                          78%
                        </span>
                        <span className="text-gray-400 text-[8px]">Boa</span>
                      </div>
                      <div className="w-full h-1 bg-[#112a11] rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#00C853]/50 to-[#00C853] w-[78%]"></div>
                      </div>
                    </div>

                    {/* Commodity Card */}
                    <div className="bg-[#050a1a] border border-[#111a33] border-l-[3px] border-l-[#448AFF] rounded-md p-2 flex flex-col relative overflow-hidden shrink-0">
                      <span className="text-gray-300 text-[9px] mb-1 leading-none">
                        Soja · R$ 142,80/sc
                      </span>
                      <span className="text-[#00C853] text-[8px] mt-1">▲ +2,3% hoje</span>
                      <div className="absolute right-0 bottom-0 opacity-50">
                        <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                          <polyline
                            points="0,20 15,15 30,18 45,5 60,2"
                            fill="none"
                            stroke="#448AFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* AI Button */}
                    <div className="mt-auto shrink-0 pb-[8px]">
                      <div className="bg-[#00C853] text-black text-[9px] font-bold py-2 rounded text-center w-full shadow-[0_0_10px_rgba(0,200,83,0.3)]">
                        Consultor IA →
                      </div>
                    </div>
                  </div>

                  {/* Home Bar */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-[#444] rounded-full z-20"></div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
