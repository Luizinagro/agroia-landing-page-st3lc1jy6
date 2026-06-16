import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-[#0D1F0D] to-[#1A2E0A]">
      {/* CSS-Based Noise Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
        }}
      ></div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          <div className="w-full lg:w-[55%] space-y-8 text-center lg:text-left">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A3A0A] border border-[#4A7A2A] text-[#F5F0E8] text-sm font-medium shadow-sm">
                <span className="text-[#8BC34A] text-xs">●</span>
                Mais de 500 produtores já usam a AgroIA
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F0E8] leading-[1.1]">
                A IA que trabalha
                <br />
                <span className="text-[#6DBF4A] block mt-2">na sua roça</span>
                enquanto você dorme
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-lg md:text-xl text-[#A8B8A0] max-w-2xl mx-auto lg:mx-0 font-medium">
                Diagnóstico de praga em 30 segundos. Irrigação inteligente. Preços em tempo real.
                Tudo no celular — sem precisar de técnico.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-6">
                <div className="flex items-center gap-2 text-[#A8B8A0] text-sm font-medium">
                  <Check className="w-4 h-4 text-[#6DBF4A] stroke-[3]" /> Sem contrato
                </div>
                <div className="flex items-center gap-2 text-[#A8B8A0] text-sm font-medium">
                  <Check className="w-4 h-4 text-[#6DBF4A] stroke-[3]" /> 7 dias grátis
                </div>
                <div className="flex items-center gap-2 text-[#A8B8A0] text-sm font-medium">
                  <Check className="w-4 h-4 text-[#6DBF4A] stroke-[3]" /> Suporte em português
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/cadastro" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full h-14 px-8 bg-[#4A8A1A] text-white hover:bg-[#5A9A2A] font-bold text-lg gap-2 transition-all rounded-[6px]"
                  >
                    Começar Grátis por 7 Dias <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="#como-funciona" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-14 px-8 border border-[#4A6A3A] bg-transparent text-[#A8B8A0] hover:bg-[#4A6A3A]/10 hover:text-[#F5F0E8] font-semibold text-lg transition-all rounded-[6px]"
                  >
                    Ver como funciona <ChevronDown className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
              <p className="text-sm text-[#6A8A5A] mt-4 text-center lg:text-left font-medium">
                Cancele quando quiser. Sem burocracia.
              </p>
            </ScrollReveal>
          </div>

          <div className="w-full lg:w-[45%] flex justify-center relative mt-12 lg:mt-0">
            <style>{`
              @keyframes float-mockup {
                0%, 100% {
                  transform: perspective(1000px) rotateY(-12deg) rotateX(6deg) rotateZ(-1deg) translateY(0);
                }
                50% {
                  transform: perspective(1000px) rotateY(-12deg) rotateX(6deg) rotateZ(-1deg) translateY(-6px);
                }
              }
              .animate-float-mockup {
                animation: float-mockup 4s ease-in-out infinite;
              }
            `}</style>

            <ScrollReveal delay={400} className="relative w-full flex justify-center">
              <div className="scale-[0.8] md:scale-100 transform origin-center">
                <div className="relative w-[220px] h-[440px] bg-gradient-to-b from-[#2A2A3A] to-[#0D0D18] rounded-[32px] border-[2.5px] border-[#3A3A50] shadow-[-20px_20px_40px_rgba(0,0,0,0.5),-10px_10px_20px_rgba(0,0,0,0.4),inset_2px_2px_4px_rgba(255,255,255,0.05)] animate-float-mockup overflow-visible">
                  {/* Power Button */}
                  <div className="absolute top-[90px] -right-[4px] w-[3px] h-[25px] bg-[#3A3A50] rounded-r-md"></div>

                  {/* Volume Buttons */}
                  <div className="absolute top-[80px] -left-[4px] w-[3px] h-[20px] bg-[#3A3A50] rounded-l-md"></div>
                  <div className="absolute top-[115px] -left-[4px] w-[3px] h-[20px] bg-[#3A3A50] rounded-l-md"></div>

                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70px] h-[20px] bg-[#0A0E08] rounded-b-[12px] z-20 shadow-[inset_0_-1px_1px_rgba(255,255,255,0.05)]"></div>

                  {/* Screen */}
                  <div className="absolute inset-[3px] rounded-[28px] bg-[#0A0E08] overflow-hidden flex flex-col gap-[10px] pt-[28px] px-[12px] pb-[12px] z-10 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                    {/* Header */}
                    <div className="flex flex-col mb-1 shrink-0">
                      <span className="text-[#6DBF4A] text-[13px] font-bold">Dashboard AgroIA</span>
                      <span className="text-[#7A8A70] text-[10px] font-medium mt-0.5">
                        ☀️ 28°C · Fazenda São João, MT
                      </span>
                    </div>

                    {/* Pest Alert Card */}
                    <div className="bg-[#1C0808] border-l-[3px] border-l-[#C62828] rounded-md p-2.5 flex flex-col gap-1.5 shrink-0 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-[10px] font-bold leading-none flex items-center gap-1.5">
                          <span className="text-[12px]">🌿</span> Alerta de Praga
                        </span>
                        <span className="bg-[#C62828] text-white text-[7px] px-1.5 py-0.5 rounded leading-none font-bold">
                          URGENTE
                        </span>
                      </div>
                      <span className="text-[#E0E0E0] text-[10px] font-medium leading-tight">
                        Ferrugem · Talhão 3
                      </span>
                    </div>

                    {/* NDVI Card */}
                    <div className="bg-[#081408] border-l-[3px] border-l-[#558B2F] rounded-md p-2.5 flex flex-col shrink-0 shadow-sm">
                      <span className="text-[#B0BEC5] text-[10px] mb-1.5 font-medium leading-none">
                        Saúde da Lavoura (NDVI)
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-[#8BC34A] text-[22px] font-bold leading-none">
                          78%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1B2E1B] rounded-full mt-2.5 overflow-hidden">
                        <div className="h-full bg-[#8BC34A] w-[78%] rounded-full"></div>
                      </div>
                    </div>

                    {/* Commodity Card */}
                    <div className="bg-[#080C14] border-l-[3px] border-l-[#37474F] rounded-md p-2.5 flex flex-col relative overflow-hidden shrink-0 shadow-sm h-[50px] justify-center">
                      <span className="text-white text-[11px] font-medium leading-none z-10 relative">
                        Soja · R$ 142,80/sc
                      </span>
                      <div className="absolute right-0 bottom-0 opacity-80 pointer-events-none">
                        <svg width="70" height="25" viewBox="0 0 70 25" fill="none">
                          <polyline
                            points="0,25 20,20 35,22 50,10 70,5"
                            fill="none"
                            stroke="#546E7A"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Consultant Button */}
                    <div className="mt-auto shrink-0 pb-[2px]">
                      <div className="bg-[#2E5A1A] text-white text-[11px] font-medium py-2.5 rounded-md text-center w-full shadow-sm">
                        Consultor IA →
                      </div>
                    </div>
                  </div>

                  {/* Home Bar */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-[#3A3A50] rounded-full z-20"></div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
