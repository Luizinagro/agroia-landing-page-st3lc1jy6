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

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        <div className="bg-[#1A3A0A]/30 border border-[#2E5A1A] p-8 rounded-2xl">
          <p className="text-[#E8F0E4] mb-6 italic">
            "O relatório gerado pela AgroIA acelerou em semanas a aprovação do meu custeio no
            Sicredi. O gerente adorou o detalhamento."
          </p>
          <div>
            <p className="text-white font-bold">Carlos Mendonça</p>
            <p className="text-[#A8B8A0] text-sm">Produtor de Soja • Sorriso, MT</p>
          </div>
        </div>
        <div className="bg-[#1A3A0A]/30 border border-[#2E5A1A] p-8 rounded-2xl">
          <p className="text-[#E8F0E4] mb-6 italic">
            "Ter os dados na palma da mão e ainda conseguir 25% de desconto por ser associado
            Sicredi foi o melhor negócio do ano."
          </p>
          <div>
            <p className="text-white font-bold">João Batista Ramos</p>
            <p className="text-[#A8B8A0] text-sm">Pecuarista • Rio Verde, GO</p>
          </div>
        </div>
        <div className="bg-[#1A3A0A]/30 border border-[#2E5A1A] p-8 rounded-2xl">
          <p className="text-[#E8F0E4] mb-6 italic">
            "Uso a IA para decidir quando plantar. Com a integração do seguro Sicredi, me sinto
            muito mais protegida contra o clima."
          </p>
          <div>
            <p className="text-white font-bold">Ana Paula Ferreira</p>
            <p className="text-[#A8B8A0] text-sm">Produtora de Milho • Cascavel, PR</p>
          </div>
        </div>
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
