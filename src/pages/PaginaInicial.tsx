import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { SEO } from '@/components/SEO'

const PaginaInicial = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-primary/30">
      <SEO
        title="AgroIA | O Futuro do Campo"
        description="Transforme sua Safra com IA Hiperlocal. Previsão 92% precisa e rastreabilidade."
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Hero />
        <div id="planos">
          <Pricing />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default PaginaInicial
