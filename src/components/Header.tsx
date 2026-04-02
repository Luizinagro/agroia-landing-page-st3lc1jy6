import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="fixed top-0 z-[100] w-full bg-[#111827]/60 backdrop-blur-[20px] border-b border-white/10 transition-all duration-400 ease-bounce">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
              <span className="text-2xl font-bold tracking-tight text-[#22C55E] drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                AgroIA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-semibold text-white/80 hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-all duration-400"
            >
              Features
            </a>
            <a
              href="#modules"
              className="text-sm font-semibold text-white/80 hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-all duration-400"
            >
              Modules
            </a>
            <a
              href="#pricing"
              className="text-sm font-semibold text-white/80 hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-all duration-400"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-sm font-semibold text-white/80 hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-all duration-400"
            >
              Testimonials
            </a>
            <Button>Get Started</Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="text-white hover:bg-white/20 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#111827]/95 backdrop-blur-xl shadow-lg animate-in slide-in-from-top-2 border-t border-white/10">
          <div className="flex flex-col space-y-2 px-4 pb-6 pt-4">
            <a
              href="#features"
              className="px-4 py-3 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] rounded-lg transition-all duration-400"
              onClick={toggleMenu}
            >
              Features
            </a>
            <a
              href="#modules"
              className="px-4 py-3 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] rounded-lg transition-all duration-400"
              onClick={toggleMenu}
            >
              Modules
            </a>
            <a
              href="#pricing"
              className="px-4 py-3 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] rounded-lg transition-all duration-400"
              onClick={toggleMenu}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="px-4 py-3 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-[#8B5CF6] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] rounded-lg transition-all duration-400"
              onClick={toggleMenu}
            >
              Testimonials
            </a>
            <div className="px-4 pt-4 pb-2">
              <Button className="w-full h-12 text-lg">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
