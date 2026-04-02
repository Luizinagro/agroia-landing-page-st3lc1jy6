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
      <header className="navbar-glass !border-b !border-[#1DB954]/20">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-[#FFFFFF] transition-transform duration-300 ease-out" />
              <span className="text-xl font-medium text-[#FFFFFF]">AgroIA</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#planos"
              className="hidden md:block text-sm font-medium text-[#E0E0E0] hover:text-[#1DB954] transition-colors"
            >
              Planos
            </a>
            <Link
              to={user ? '/dashboard' : '/login'}
              className="btn-agro-primary px-8 py-2.5 text-sm md:text-base tracking-wide"
            >
              {user ? 'ÁREA DO PRODUTOR' : 'LOGIN'}
            </Link>
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
