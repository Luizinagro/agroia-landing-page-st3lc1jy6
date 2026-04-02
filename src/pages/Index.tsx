import { Hero } from '@/components/sections/hero'
import { Pricing } from '@/components/sections/pricing'
import { Footer } from '@/components/sections/footer'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/SEO'
import { Logo } from '@/components/ui/logo'

const Index = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#050A15] text-white flex flex-col font-sans selection:bg-[#00FF94]/30">
      <SEO
        title="AgroIA | O Futuro do Campo"
        description="Transforme sua Safra com IA Hiperlocal. Previsão 92% precisa e rastreabilidade."
      />

      {/* Futuristic Header */}
      <header className="fixed top-0 z-50 w-full bg-[#050A15]/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Logo className="w-10 h-10 text-[#00FF94] drop-shadow-[0_0_15px_rgba(0,255,148,0.5)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
          </div>

          <div className="flex items-center gap-4">
            <Button
              asChild
              className="bg-[#00FF94] text-[#050A15] hover:bg-[#00FF94]/90 hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] hover:-translate-y-0.5 transition-all duration-300 font-bold rounded-full h-11 px-8 text-sm md:text-base tracking-wide"
            >
              <Link to={user ? '/dashboard' : '/login'}>{user ? 'ÁREA DO PRODUTOR' : 'LOGIN'}</Link>
            </Button>
          </div>
        </div>
      </header>

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

export default Index
