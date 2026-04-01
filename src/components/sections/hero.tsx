import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/animated-section'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://img.usecurling.com/p/1920/1080?q=drone%20farm&color=green"
          alt="Drone view of a farm in Cascavel"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/90" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
        <AnimatedSection className="max-w-4xl space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            Transforme sua Safra com <span className="text-secondary">IA Hiperlocal</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-200 max-w-2xl mx-auto font-medium leading-relaxed">
            Previsão 92% precisa, economia R$10k/ano, rastreabilidade ESG para exportação UE 2027.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 border border-white/20 text-lg px-8 py-6 w-full sm:w-auto shadow-elevation hover:scale-105 transition-transform"
              aria-label="Iniciar teste grátis de 14 dias"
            >
              Teste Grátis 14 Dias
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-lg px-8 py-6 w-full sm:w-auto backdrop-blur-sm hover:scale-105 transition-transform"
              aria-label="Falar com consultor comercial"
            >
              Falar com Consultor
            </Button>
          </div>
        </AnimatedSection>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-slide-down" />
        </div>
      </div>
    </section>
  )
}
