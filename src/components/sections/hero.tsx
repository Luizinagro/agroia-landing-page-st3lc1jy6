import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/animated-section'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-bg-dark pt-20">
      {/* Abstract Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-agro-green/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float"
        style={{ animationDelay: '2s' }}
      />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgyMHYyMEgxVjF6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />

      {/* Content */}
      <div className="container relative z-10 flex flex-col items-center text-center">
        <AnimatedSection className="max-w-5xl space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-md mb-4 animate-fade-in-down">
            <span className="flex h-2 w-2 rounded-full bg-agro-green animate-pulse"></span>
            <span className="text-sm font-semibold text-white/90 tracking-wide">
              Tecnologia de Ponta para o Agronegócio
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 pb-2">
            O Futuro da Safra com <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-green to-neon-purple drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              IA Hiperlocal
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed">
            Previsão 92% precisa, maximização de ROI e rastreabilidade automatizada. Revolucione o
            campo com dados inteligentes.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-agro-green text-white hover:bg-agro-green-hover text-lg px-10 py-8 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] font-bold group"
            >
              <Link to="/cadastro">
                Comece Agora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:w-auto bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white text-lg px-10 py-8 backdrop-blur-md font-bold"
            >
              Conheça os Planos
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
