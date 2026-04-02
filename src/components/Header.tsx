import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="fixed top-0 z-[100] w-full bg-[#000000] border-b border-[#1DB954]/20 transition-all duration-300 ease-out">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-90 group"
            >
              <Logo className="w-8 h-8 text-[#1DB954]" />
              <span className="text-xl font-bold tracking-tight text-[#FFFFFF] transition-transform duration-300 ease-out">
                AgroIA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-[#E0E0E0] hover:text-[#1DB954] transition-colors duration-300 ease-out"
            >
              Funcionalidades
            </a>
            <a
              href="#planos"
              className="text-sm font-medium text-[#E0E0E0] hover:text-[#1DB954] transition-colors duration-300 ease-out"
            >
              Planos
            </a>
            <Link
              to="/login"
              className="text-sm font-medium text-[#E0E0E0] hover:text-[#1DB954] transition-colors duration-300 ease-out"
            >
              Login
            </Link>
            <Link to="/cadastro" className="btn-agro-primary">
              Começar Agora
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="text-[#E0E0E0] hover:text-[#1DB954] hover:bg-white/5"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#000000] shadow-lg animate-in slide-in-from-top-2 border-b border-[#1DB954]/20">
          <div className="flex flex-col space-y-2 px-4 pb-6 pt-4">
            <a
              href="#features"
              className="px-4 py-3 text-base font-medium text-[#E0E0E0] hover:bg-white/5 hover:text-[#1DB954] rounded-[12px] transition-colors duration-300 ease-out"
              onClick={toggleMenu}
            >
              Funcionalidades
            </a>
            <a
              href="#planos"
              className="px-4 py-3 text-base font-medium text-[#E0E0E0] hover:bg-white/5 hover:text-[#1DB954] rounded-[12px] transition-colors duration-300 ease-out"
              onClick={toggleMenu}
            >
              Planos
            </a>
            <Link
              to="/login"
              className="px-4 py-3 text-base font-medium text-[#E0E0E0] hover:bg-white/5 hover:text-[#1DB954] rounded-[12px] transition-colors duration-300 ease-out"
              onClick={toggleMenu}
            >
              Login
            </Link>
            <div className="px-4 pt-4 pb-2">
              <Link to="/cadastro" className="btn-agro-primary w-full text-center block text-base">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
