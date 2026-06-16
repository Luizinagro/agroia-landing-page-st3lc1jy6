import { Logo } from '@/components/ui/logo'

export function Footer() {
  return (
    <footer className="border-t border-[#1E3A1E] bg-[#070F07] pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-6" />
            <p className="text-[#A8B8A0] max-w-sm leading-relaxed">
              Revolucionando o agronegócio com Inteligência Artificial, dados precisos e tecnologia
              100% focada no produtor rural.
            </p>
          </div>
          <div>
            <h4 className="text-[#F5F0E8] font-semibold mb-6">Produto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#como-funciona"
                  className="text-[#A8B8A0] hover:text-[#6DBF4A] transition-colors"
                >
                  Recursos
                </a>
              </li>
              <li>
                <a href="#planos" className="text-[#A8B8A0] hover:text-[#6DBF4A] transition-colors">
                  Planos
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A8B8A0] hover:text-[#6DBF4A] transition-colors">
                  Comunidade
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A8B8A0] hover:text-[#6DBF4A] transition-colors">
                  Calculadora ROI
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#F5F0E8] font-semibold mb-6">Contato</h4>
            <ul className="space-y-3">
              <li className="text-[#A8B8A0]">suporte@agroia.com.br</li>
              <li className="text-[#A8B8A0]">0800 123 4567</li>
              <li className="text-[#A8B8A0]">Av. Paulista, 1000 - SP</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[#1E3A1E] flex flex-col md:flex-row items-center justify-between gap-4 text-[#A8B8A0] text-sm">
          <div>&copy; {new Date().getFullYear()} AgroIA. Todos os direitos reservados.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#F5F0E8] transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-[#F5F0E8] transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
