import { Logo } from '@/components/ui/logo'

export function Footer() {
  return (
    <footer className="bg-black text-white/60 py-16 border-t border-zinc-900">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-white font-black text-2xl">
              <Logo className="w-8 h-8 text-primary" />
              <span className="tracking-tight">AgroIA</span>
            </div>
            <p className="max-w-md text-zinc-400 font-medium leading-relaxed">
              O ecossistema definitivo para o agronegócio inteligente. Potencializando a produção
              rural com tecnologia preditiva e rastreabilidade hiperlocal.
            </p>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 tracking-wide uppercase text-sm">
              Plataforma
            </h4>
            <ul className="space-y-4 font-bold text-sm">
              <li>
                <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                  Tecnologia
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                  Parceiros
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 tracking-wide uppercase text-sm">Legal</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li>
                <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-zinc-500">
          <p>© {new Date().getFullYear()} AgroIA. Inovação para o campo.</p>
          <div className="flex gap-4">
            <span>Brasil</span>
            <span>•</span>
            <span>Agrotech</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
