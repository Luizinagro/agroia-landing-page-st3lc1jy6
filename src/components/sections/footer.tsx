import { Tractor } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#112a24] text-white/80 py-12 border-t border-white/10">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-2xl mb-4">
              <Tractor className="w-8 h-8 text-secondary" />
              <span>AgroIA</span>
            </div>
            <p className="max-w-md text-white/60">
              Transformando a agricultura brasileira com inteligência artificial hiperlocal,
              garantindo maior produtividade e adequação às normas globais.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Institucional</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Parcerias Coops
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Suporte & Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Termos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© {currentYear} AgroIA Tecnologias Ltda. Todos os direitos reservados.</p>
          <p>Desenvolvido para as regiões de Cascavel e Toledo - PR</p>
        </div>
      </div>
    </footer>
  )
}
