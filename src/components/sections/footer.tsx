import { Logo } from '@/components/ui/logo'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-6" />
            <p className="text-zinc-400 max-w-sm leading-relaxed">
              Revolucionando o agronegócio com Inteligência Artificial, dados precisos e tecnologia
              100% focada no produtor rural.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Produto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#solucoes"
                  className="text-zinc-400 hover:text-green-500 transition-colors"
                >
                  Recursos
                </a>
              </li>
              <li>
                <a href="#planos" className="text-zinc-400 hover:text-green-500 transition-colors">
                  Planos
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-green-500 transition-colors">
                  Comunidade
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-green-500 transition-colors">
                  Calculadora ROI
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Contato</h4>
            <ul className="space-y-3">
              <li className="text-zinc-400">suporte@agroia.com.br</li>
              <li className="text-zinc-400">0800 123 4567</li>
              <li className="text-zinc-400">Av. Paulista, 1000 - SP</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
          <div>&copy; {new Date().getFullYear()} AgroIA. Todos os direitos reservados.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
