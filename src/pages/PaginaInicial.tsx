import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { InteractiveMap } from '@/components/sections/map'
import { Testimonials } from '@/components/sections/testimonials'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/Header'

export default function PaginaInicial() {
  return (
    <div className="min-h-screen bg-[#000000] text-foreground">
      <Header />
      <main className="flex flex-col w-full bg-black">
        <Hero />
        <Features />
        <InteractiveMap />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
