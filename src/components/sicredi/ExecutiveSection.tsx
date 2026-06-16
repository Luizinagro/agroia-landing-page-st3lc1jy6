import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from './AnimatedSection'

export function ExecutiveSection() {
  const MSG = encodeURIComponent(
    'Olá! Sou do Sicredi e tenho interesse em conhecer melhor a parceria estratégica com a AgroIA. Podemos agendar uma reunião?',
  )

  return (
    <AnimatedSection className="bg-[#0D1F0D] py-16 border-y border-[#F9A825]/20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Para Lideranças e Gestores Sicredi</h2>
          <p className="text-[#A8B8A0] max-w-2xl mx-auto">
            Como a AgroIA pode agregar valor à sua carteira de associados agro.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0A1A0A] border-l-4 border-l-[#F9A825] p-6 rounded-r-xl shadow-lg">
            <h3 className="text-white font-bold text-lg mb-3">Diferencial Competitivo</h3>
            <p className="text-[#A8B8A0] text-sm">
              Ofereça tecnologia de ponta como benefício, retendo associados de alto valor e
              atraindo novos produtores.
            </p>
          </div>
          <div className="bg-[#0A1A0A] border-l-4 border-l-[#F9A825] p-6 rounded-r-xl shadow-lg">
            <h3 className="text-white font-bold text-lg mb-3">Análise de Risco Precisa</h3>
            <p className="text-[#A8B8A0] text-sm">
              Com associados utilizando a AgroIA, os dossiês de crédito chegam mais completos, com
              viabilidade atestada por IA.
            </p>
          </div>
          <div className="bg-[#0A1A0A] border-l-4 border-l-[#F9A825] p-6 rounded-r-xl shadow-lg">
            <h3 className="text-white font-bold text-lg mb-3">Projeto Piloto</h3>
            <p className="text-[#A8B8A0] text-sm">
              Implemente um piloto em sua agência regional e mensure o aumento na contratação de
              linhas de crédito.
            </p>
          </div>
        </div>

        <div className="text-center">
          <a
            href={`https://wa.me/5511999999999?text=${MSG}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-[#F9A825] hover:bg-[#E69500] text-black font-bold px-8 py-6 rounded-full">
              Agendar Reunião Executiva <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>
      </div>
    </AnimatedSection>
  )
}
