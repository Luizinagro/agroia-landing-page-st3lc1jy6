import { AnimatedSection } from '@/components/animated-section'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Tractor, Users } from 'lucide-react'
import { NeonParticles } from '@/components/ui/neon-particles'
import { useRef } from 'react'
import { useGsapAnimations } from '@/hooks/use-gsap-animations'
import { NeonLink, NeonButton } from '@/components/ui/neon-button'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  useGsapAnimations(heroRef)

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#000000] pt-32 pb-16"
    >
      <NeonParticles className="z-0 opacity-50" />

      <div className="absolute inset-0 z-0 pointer-events-none gsap-parallax-hero">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1920/1080?q=satellite%20farm')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/90 via-[#000000]/70 to-[#000000]" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Main Content Block */}
          <div className="lg:col-span-7 bg-[#050505]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-14 flex flex-col justify-center relative overflow-hidden group hover:border-[#1DB954]/20 transition-colors duration-500 gsap-grow">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 w-fit">
              <span className="flex h-2 w-2 rounded-full bg-[#1DB954] animate-pulse"></span>
              <span className="text-xs font-bold text-[#E0E0E0] tracking-wider uppercase">
                Agro IA OS
              </span>
            </div>

            <h1 className="text-[#FFFFFF] mb-6 font-black tracking-tighter leading-[1.1]">
              Inteligência <br className="hidden md:block" /> Artificial{' '}
              <span className="text-[#1DB954]">Agronômica</span>
            </h1>

            <p className="text-lg md:text-xl text-[#A0A0A0] max-w-lg mb-10 font-medium leading-relaxed">
              O primeiro sistema operacional inteligente para o campo. Maximize seus lucros com IA
              hiperlocal e precisão de 92%.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <NeonLink
                to="/cadastro"
                variant="solid"
                className="flex items-center justify-center gap-2 group/btn py-4 px-8 text-base bg-[#1DB954] hover:bg-[#1DB954]/90 text-black font-black"
              >
                Comece Agora
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </NeonLink>

              <NeonButton
                variant="ghost"
                onClick={() => {
                  document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex items-center justify-center bg-white/5 backdrop-blur-md py-4 px-8 text-base hover:bg-white/10 transition-colors text-white"
              >
                Ver Planos
              </NeonButton>
            </div>
          </div>

          {/* Bento Widgets */}
          <div className="lg:col-span-5 grid grid-rows-2 gap-6 gsap-stagger-container">
            {/* Top Widget */}
            <div className="bg-[#050505]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between group hover:border-[#1DB954]/30 transition-colors duration-500 gsap-stagger-item">
              <div className="flex justify-between items-start mb-4 z-10 relative">
                <div className="w-12 h-12 rounded-full bg-[#1DB954]/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#1DB954]" />
                </div>
                <span className="text-[#1DB954] font-black text-sm bg-[#1DB954]/10 px-3 py-1 rounded-full">
                  +14.5%
                </span>
              </div>
              <div className="z-10 relative">
                <p className="text-[#A0A0A0] font-bold text-sm mb-1 uppercase tracking-wider">
                  Previsão Soja
                </p>
                <p className="text-5xl font-black text-white tracking-tighter">
                  <span className="text-2xl text-[#A0A0A0] mr-1">R$</span>142
                  <span className="text-2xl text-[#A0A0A0]">,50</span>
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1DB954]/20 to-transparent opacity-50" />
            </div>

            {/* Bottom Widgets */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#1DB954] rounded-[32px] p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 gsap-stagger-item">
                <Tractor className="w-8 h-8 text-black mb-4" />
                <div>
                  <p className="text-black/70 font-bold text-sm mb-1 uppercase tracking-wider">
                    Precisão IA
                  </p>
                  <p className="text-4xl font-black text-black tracking-tighter">92%</p>
                </div>
              </div>

              <div className="bg-[#050505]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex flex-col justify-between group hover:border-[#1DB954]/30 transition-colors duration-500 gsap-stagger-item">
                <Users className="w-8 h-8 text-white/40 mb-4" />
                <div>
                  <p className="text-[#A0A0A0] font-bold text-sm mb-1 uppercase tracking-wider">
                    Produtores
                  </p>
                  <p className="text-4xl font-black text-white tracking-tighter">5k+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
