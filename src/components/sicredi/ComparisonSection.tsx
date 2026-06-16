import { CheckCircle, Sprout, Banknote } from 'lucide-react'
import { AnimatedSection } from './AnimatedSection'

export function ComparisonSection() {
  return (
    <AnimatedSection className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Duas Forças, Uma Solução</h2>
        <p className="text-[#A8B8A0] text-lg max-w-2xl mx-auto">
          A inteligência de dados da AgroIA aliada à solidez financeira do Sicredi.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#0D1F0D] border-2 border-[#6DBF4A] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sprout className="w-24 h-24 text-[#6DBF4A]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-[#6DBF4A]">AGROIA</span> Inteligência
          </h3>
          <ul className="space-y-4 text-[#E8F0E4] relative z-10">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#6DBF4A] shrink-0" />
              <span>Módulos de IA para gestão de pragas e safra</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#6DBF4A] shrink-0" />
              <span>Monitoramento via satélite contínuo</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#6DBF4A] shrink-0" />
              <span>Calculadoras de ROI e viabilidade</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#0D1F0D] border-2 border-[#009959] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Banknote className="w-24 h-24 text-[#009959]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-[#009959]">SICREDI</span> Financeiro
          </h3>
          <ul className="space-y-4 text-[#E8F0E4] relative z-10">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#009959] shrink-0" />
              <span>Taxas de crédito rural diferenciadas</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#009959] shrink-0" />
              <span>Seguros agrícolas e patrimoniais integrados</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#009959] shrink-0" />
              <span>Atendimento e suporte local na sua agência</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#1A3A0A]/50 border border-[#6DBF4A]/30 rounded-xl p-6 text-center max-w-3xl mx-auto">
        <p className="text-xl text-white">
          O resultado?{' '}
          <strong className="text-[#6DBF4A]">
            crédito rural + inteligência artificial integrados
          </strong>{' '}
          para multiplicar seus resultados.
        </p>
      </div>
    </AnimatedSection>
  )
}
