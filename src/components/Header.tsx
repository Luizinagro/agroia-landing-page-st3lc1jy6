import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Bell, Menu, Search, UserCircle, Handshake } from 'lucide-react'
import { Logo, LogoText } from '@/components/ui/logo'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

export function Header() {
  const location = useLocation()
  const isApp = !['/', '/login', '/cadastro', '/sicredi'].includes(location.pathname)

  if (!isApp) {
    return (
      <header className="fixed top-0 w-full z-50 border-b border-primary/20 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#solucoes"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Recursos
            </a>
            <a
              href="#planos"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Planos
            </a>
            <Link
              to="/sicredi"
              className="text-sm font-medium text-[#00C853] hover:text-[#009959] transition-colors flex items-center gap-1.5 bg-[#00C853]/10 px-3 py-1.5 rounded-full"
            >
              Parceria Sicredi <Handshake className="w-4 h-4" />
            </Link>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary hover:bg-primary/10 px-2 sm:px-4"
              >
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button className="bg-primary text-black hover:bg-primary/90 font-medium px-3 sm:px-4">
                Começar
              </Button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="h-16 border-b border-primary/20 bg-black/40 backdrop-blur flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black border-r border-primary/20 p-0">
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <div className="p-6 flex items-center gap-2 border-b border-primary/10">
              <Logo />
            </div>
            <nav className="p-4 space-y-2">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/pecuaria"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
              >
                Pecuária
              </Link>
              <Link
                to="/crm"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
              >
                CRM
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar informações..."
            className="w-full bg-black/40 border border-primary/20 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:bg-black transition-all text-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </Button>
        <Link to="/selecionar-plano" className="hidden md:block">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/50 text-primary hover:bg-primary/10 h-8 text-xs font-semibold"
          >
            Planos
          </Button>
        </Link>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 cursor-pointer hover:bg-primary/30 transition-colors">
          <UserCircle className="w-5 h-5 text-primary" />
        </div>
      </div>
    </header>
  )
}
