import { Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from './AnimatedSection'

export function DiscountSection() {
  const WHATSAPP_NUMBER = '5511999999999'
  const MSG = encodeURIComponent(
    'Olá! Sou associado Sicredi e quero ativar meu desconto exclusivo de 25% na AgroIA. Pode me ajudar?',
  )

  return (
    <AnimatedSection className="max-w-[1200px] mx-auto px-6 py-12 md:py-20" id="discount">
      <div className="bg-gradient-to-br from-[#0D1F0D] to-[#1A3A0A] border border-[#009959]/30 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#009959]/20 rounded-full blur-3xl"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#009959]/20 text-[#00C853] px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <Users className="w-4 h-4" />
              Exclusivo para Associados
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              25% de Desconto no Plano Fazendeiro Completo
            </h2>
            <p className="text-xl text-[#A8B8A0] mb-8">
              Acesse todas as ferramentas de IA, satélite e gestão por um valor especial para você
              que é Sicredi.
            </p>

            <div className="flex items-end gap-4 mb-8">
              <div className="text-gray-500 line-through text-2xl font-medium">R$ 349/mês</div>
              <div className="text-5xl font-bold text-[#6DBF4A]">
                R$ 262<span className="text-2xl text-[#A8B8A0] font-normal">/mês</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto"
            >
              <Button className="w-full bg-[#009959] hover:bg-[#007A47] text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg shadow-[#009959]/20">
                Quero Meu Desconto Sicredi <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>

          <div className="bg-[#0A1A0A]/60 backdrop-blur-sm rounded-2xl p-8 border border-[#2E5A1A]">
            <h3 className="text-xl font-bold text-white mb-6">Como Ativar:</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#009959] flex items-center justify-center text-white font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Clique no botão verde ao lado</p>
                  <p className="text-[#A8B8A0] text-sm mt-1">
                    Você será redirecionado para nosso WhatsApp.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#009959] flex items-center justify-center text-white font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Envie a mensagem pronta</p>
                  <p className="text-[#A8B8A0] text-sm mt-1">
                    Nossa equipe identificará sua solicitação automaticamente.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#009959] flex items-center justify-center text-white font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Confirme sua associação</p>
                  <p className="text-[#A8B8A0] text-sm mt-1">
                    Basta informar a sua agência Sicredi.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#009959] flex items-center justify-center text-white font-bold shrink-0">
                  4
                </div>
                <div>
                  <p className="text-white font-medium">Acesso Liberado!</p>
                  <p className="text-[#A8B8A0] text-sm mt-1">
                    Seu plano Fazendeiro Completo estará ativo com desconto.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
