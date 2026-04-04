import { Logo, LogoText } from '@/components/ui/logo'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-black border-t border-primary/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
              <LogoText className="text-xl" />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Transformando o agronegócio com tecnologia, inteligência artificial e sustentabilidade
              para um futuro mais verde e produtivo.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Produto</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Preços
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Casos de Uso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Comunidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacidade
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} <LogoText />. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Feito com <span className="text-red-500">❤️</span> no Brasil
          </div>
        </div>
      </div>
    </footer>
  )
}
