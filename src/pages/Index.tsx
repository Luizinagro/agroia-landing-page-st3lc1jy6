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
    <div className="min-h-screen bg-bg-dark text-white flex flex-col font-sans selection:bg-agro-green/30">
      <SEO
        title="AgroIA | O Futuro do Campo"
        description="Transforme sua Safra com IA Hiperlocal. Previsão 92% precisa e rastreabilidade."
      />

      {/* Futuristic Header */}
      <header className="fixed top-0 z-[100] w-full bg-[#111827]/60 backdrop-blur-[20px] border-b border-white/10 transition-all duration-400 ease-bounce">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Logo className="w-10 h-10 text-[#22C55E] drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-400 ease-bounce" />
          </div>

          <div className="flex items-center gap-4">
            <Button asChild className="font-bold h-11 px-8 text-sm md:text-base tracking-wide">
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
