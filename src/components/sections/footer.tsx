import { Logo } from '@/components/ui/logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#000000] text-white/60 py-16 border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#1DB954]/5 to-transparent pointer-events-none" />

      <div className="container max-w-7xl mx-auto relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-white font-black text-2xl">
              <div className="bg-[#1DB954] p-1.5 rounded-xl inline-block">
                <Logo className="w-6 h-6 text-black" />
              </div>
              <span className="tracking-tight">AgroIA</span>
            </div>
            <p className="max-w-md text-[#A0A0A0] font-medium leading-relaxed">
              O ecossistema definitivo para o agronegócio inteligente. Potencializando a produção
              rural com tecnologia preditiva e rastreabilidade hiperlocal.
            </p>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 tracking-wide uppercase text-xs">
              Plataforma
            </h4>
            <ul className="space-y-4 font-bold text-sm">
              <li>
                <a
                  href="#"
                  className="text-[#A0A0A0] hover:text-[#1DB954] transition-colors focus-visible:outline-none focus-visible:text-[#1DB954]"
                >
                  Sobre nós
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#A0A0A0] hover:text-[#1DB954] transition-colors focus-visible:outline-none focus-visible:text-[#1DB954]"
                >
                  Tecnologia
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#A0A0A0] hover:text-[#1DB954] transition-colors focus-visible:outline-none focus-visible:text-[#1DB954]"
                >
                  Parceiros
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 tracking-wide uppercase text-xs">Legal</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li>
                <a
                  href="#"
                  className="text-[#A0A0A0] hover:text-[#1DB954] transition-colors focus-visible:outline-none focus-visible:text-[#1DB954]"
                >
                  Contato
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#A0A0A0] hover:text-[#1DB954] transition-colors focus-visible:outline-none focus-visible:text-[#1DB954]"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#A0A0A0] hover:text-[#1DB954] transition-colors focus-visible:outline-none focus-visible:text-[#1DB954]"
                >
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-[#A0A0A0]">
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
