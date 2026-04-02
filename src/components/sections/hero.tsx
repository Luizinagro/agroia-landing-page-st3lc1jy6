import { AnimatedSection } from '@/components/animated-section'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { NeonParticles } from '@/components/ui/neon-particles'
import { useRef } from 'react'
import { useGsapAnimations } from '@/hooks/use-gsap-animations'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  useGsapAnimations(heroRef)

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-black pt-20"
    >
      <NeonParticles className="z-0" />

      <div className="absolute inset-0 z-0 pointer-events-none gsap-parallax-hero bg-gradient-hero bg-cover bg-center bg-fixed">
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1DB954]/5 rounded-full blur-[120px] mix-blend-screen animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1DB954]/5 rounded-full blur-[120px] mix-blend-screen animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 flex flex-col items-center text-center">
        <AnimatedSection className="max-w-5xl space-y-8 flex flex-col items-center gsap-grow">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white/5 border border-white/10 backdrop-blur-md mb-4 animate-fade-in-down">
            <span className="flex h-2 w-2 rounded-full bg-[#1DB954] animate-pulse"></span>
            <span className="text-sm font-medium text-[#E0E0E0] tracking-wide">
              Agro IA Dashboard
            </span>
          </div>

          <h1 className="text-white pb-2">
            Agro IA: Inteligência <br className="hidden md:block" /> Artificial Agronômica
          </h1>

          <p className="text-lg md:text-xl text-[#E0E0E0] max-w-3xl mx-auto font-normal leading-relaxed">
            O primeiro sistema operacional inteligente para o campo. Maximize seus lucros com IA
            hiperlocal, previsão de 92% e rastreabilidade total.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto">
            <Link
              to="/cadastro"
              className="btn-agro-primary w-full sm:w-auto px-10 py-4 text-base flex items-center justify-center gap-2 group"
            >
              Comece Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => {
                document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-agro-secondary w-full sm:w-auto px-10 py-4 text-base flex items-center justify-center backdrop-blur-md"
            >
              Conheça os Planos
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
