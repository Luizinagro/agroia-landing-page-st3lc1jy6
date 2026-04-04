import { Hero } from '@/components/sections/hero'
import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/Header'

export default function Index() {
  return (
    <div className="min-h-screen bg-[#000000] text-foreground">
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  )
}
