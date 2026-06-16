import { Smartphone, BarChart2, CheckCircle, BadgePercent } from 'lucide-react'
import { AnimatedSection } from './AnimatedSection'

export function PracticalFlowSection() {
  return (
    <AnimatedSection className="bg-[#070F07] py-16 md:py-24 border-y border-[#1A3A0A]" id="flow">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
          Como Funciona na Prática
        </h2>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#6DBF4A] via-[#F9A825] to-[#009959] z-0"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#0A1A0A] border-4 border-[#6DBF4A] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(109,191,74,0.2)]">
              <Smartphone className="w-10 h-10 text-[#6DBF4A]" />
            </div>
            <div className="bg-[#6DBF4A] text-[#0A1A0A] text-sm font-bold px-3 py-1 rounded-full mb-4">
              Passo 01
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Usa a AgroIA na Fazenda</h3>
            <p className="text-[#A8B8A0]">
              Alimente o sistema com os dados da sua propriedade e acompanhe a safra.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#0A1A0A] border-4 border-[#F9A825] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(249,168,37,0.2)]">
              <BarChart2 className="w-10 h-10 text-[#F9A825]" />
            </div>
            <div className="bg-[#F9A825] text-[#0A1A0A] text-sm font-bold px-3 py-1 rounded-full mb-4">
              Passo 02
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gera Relatório de Viabilidade</h3>
            <p className="text-[#A8B8A0]">
              A IA cruza dados climáticos e produtivos gerando um dossiê completo.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#0A1A0A] border-4 border-[#009959] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,153,89,0.2)]">
              <CheckCircle className="w-10 h-10 text-[#009959]" />
            </div>
            <div className="bg-[#009959] text-white text-sm font-bold px-3 py-1 rounded-full mb-4">
              Passo 03
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aprovação Mais Rápida no Sicredi</h3>
            <p className="text-[#A8B8A0]">
              Leve o relatório à agência e obtenha condições melhores e mais ágeis.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-[#0D1F0D] border border-[#F9A825] rounded-xl p-6 md:p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <BadgePercent className="w-16 h-16 text-[#F9A825] shrink-0" />
          <div>
            <h4 className="text-[#F9A825] font-bold text-xl mb-2">Insight Estratégico</h4>
            <p className="text-[#E8F0E4]">
              Ao usar dados concretos e inteligência artificial para comprovar a viabilidade e
              gestão de risco da sua lavoura, seu perfil de crédito no Sicredi torna-se muito mais
              atraente, facilitando liberações e reduzindo taxas.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
