import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/Header'

export default function PaginaInicial() {
  return (
    <div className="min-h-screen bg-[#000000] text-foreground">
      <Header />
      <main>
        <Hero />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
