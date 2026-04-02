import { Logo } from '@/components/ui/logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#050A15] text-white/60 py-16 border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#00FF94]/5 to-transparent pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-white font-bold text-2xl">
              <Logo className="w-10 h-10 text-[#00FF94]" />
            </div>
            <p className="max-w-md text-white/50 leading-relaxed">
              O ecossistema definitivo para o agronegócio inteligente. Potencializando a produção
              rural com tecnologia preditiva e rastreabilidade hiperlocal.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Plataforma</h4>
            <ul className="space-y-4 font-medium text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-[#00FF94] transition-colors focus-visible:outline-none focus-visible:text-[#00FF94]"
                >
                  Sobre nós
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#00FF94] transition-colors focus-visible:outline-none focus-visible:text-[#00FF94]"
                >
                  Tecnologia
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#00FF94] transition-colors focus-visible:outline-none focus-visible:text-[#00FF94]"
                >
                  Parceiros
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-4 font-medium text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-[#00FF94] transition-colors focus-visible:outline-none focus-visible:text-[#00FF94]"
                >
                  Contato
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#00FF94] transition-colors focus-visible:outline-none focus-visible:text-[#00FF94]"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#00FF94] transition-colors focus-visible:outline-none focus-visible:text-[#00FF94]"
                >
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-white/40">
          <p>© {currentYear} AgroIA. Inovação para o campo.</p>
          <div className="flex gap-4">
            <span>Cascavel</span>
            <span>•</span>
            <span>Toledo</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
