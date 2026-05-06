import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { Pricing } from '@/components/sections/pricing'
import { Testimonials } from '@/components/sections/testimonials'
import { Footer } from '@/components/sections/footer'

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 flex flex-col">
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

export default Index
