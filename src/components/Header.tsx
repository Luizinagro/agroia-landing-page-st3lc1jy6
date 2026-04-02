import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="fixed top-0 z-50 w-full bg-[#111827]/80 backdrop-blur-md border-b border-white/10 transition-all duration-400 ease-bounce">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
              <span className="text-2xl font-bold tracking-tight text-white">AgroIA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-semibold text-white/80 hover:text-agro-green transition-colors"
            >
              Features
            </a>
            <a
              href="#modules"
              className="text-sm font-semibold text-white/80 hover:text-agro-green transition-colors"
            >
              Modules
            </a>
            <a
              href="#pricing"
              className="text-sm font-semibold text-white/80 hover:text-agro-green transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-sm font-semibold text-white/80 hover:text-agro-green transition-colors"
            >
              Testimonials
            </a>
            <Button className="bg-agro-green text-white hover:bg-agro-green-hover h-10 px-6 font-semibold shadow-sm">
              Get Started
            </Button>
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
              className="px-4 py-3 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              onClick={toggleMenu}
            >
              Features
            </a>
            <a
              href="#modules"
              className="px-4 py-3 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              onClick={toggleMenu}
            >
              Modules
            </a>
            <a
              href="#pricing"
              className="px-4 py-3 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              onClick={toggleMenu}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="px-4 py-3 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              onClick={toggleMenu}
            >
              Testimonials
            </a>
            <div className="px-4 pt-4 pb-2">
              <Button className="w-full bg-agro-green text-white hover:bg-agro-green-hover h-12 text-lg font-semibold shadow-sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
