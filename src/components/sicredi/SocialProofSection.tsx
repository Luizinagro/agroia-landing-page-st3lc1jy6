import { Link } from 'react-router-dom'
import { Banknote, ShieldCheck, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from './AnimatedSection'

export function SocialProofSection() {
  return (
    <AnimatedSection className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Quem Usa, Recomenda</h2>
      </div>

      <div className="mb-20">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-white">AgroIA em números reais</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A3A0A]/30 border border-[#2E5A1A] p-8 rounded-2xl text-center flex flex-col justify-center">
            <span className="text-5xl font-extrabold text-[#6DBF4A] mb-2">9</span>
            <p className="text-[#E8F0E4] font-medium">Produtores já usando a plataforma</p>
          </div>
          <div className="bg-[#1A3A0A]/30 border border-[#2E5A1A] p-8 rounded-2xl text-center flex flex-col justify-center">
            <span className="text-5xl font-extrabold text-[#6DBF4A] mb-2">28</span>
            <p className="text-[#E8F0E4] font-medium">Análises de satélite realizadas</p>
          </div>
          <div className="bg-[#1A3A0A]/30 border border-[#2E5A1A] p-8 rounded-2xl text-center flex flex-col justify-center">
            <span className="text-5xl font-extrabold text-[#6DBF4A] mb-2">6</span>
            <p className="text-[#E8F0E4] font-medium">Propriedades monitoradas em tempo real</p>
          </div>
        </div>
        <p className="text-center text-[#A8B8A0] text-sm max-w-2xl mx-auto italic">
          Estamos em fase inicial de validação com produtores reais. Cada número aqui é uso genuíno
          da plataforma, não projeção.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#009959]/10 border border-[#009959]/30 rounded-xl p-8 text-center hover:bg-[#009959]/20 transition-colors cursor-pointer">
          <Banknote className="w-10 h-10 text-[#009959] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Quero Crédito</h3>
          <p className="text-[#A8B8A0] text-sm">Veja as linhas disponíveis.</p>
        </div>
        <div className="bg-[#009959]/10 border border-[#009959]/30 rounded-xl p-8 text-center hover:bg-[#009959]/20 transition-colors cursor-pointer">
          <ShieldCheck className="w-10 h-10 text-[#009959] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Quero Proteger</h3>
          <p className="text-[#A8B8A0] text-sm">Conheça os seguros.</p>
        </div>
        <div className="bg-[#6DBF4A]/10 border border-[#6DBF4A]/30 rounded-xl p-8 text-center hover:bg-[#6DBF4A]/20 transition-colors cursor-pointer">
          <Users className="w-10 h-10 text-[#6DBF4A] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Sou Associado</h3>
          <p className="text-[#A8B8A0] text-sm">Quero meu desconto AgroIA.</p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/planos">
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-black font-bold px-10 py-6 text-lg rounded-full"
          >
            Conhecer os Planos da AgroIA <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </AnimatedSection>
  )
}
