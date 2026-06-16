import {
  Banknote,
  Sprout,
  Tractor,
  TrendingUp,
  Home,
  ShieldCheck,
  SunSnow,
  ArrowRight,
} from 'lucide-react'
import { AnimatedSection } from './AnimatedSection'

export function GridsSection() {
  return (
    <AnimatedSection className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Soluções Financeiras com Inteligência
        </h2>
        <p className="text-[#A8B8A0] text-lg max-w-2xl mx-auto">
          Utilize a plataforma para organizar seus dados e acessar as melhores linhas no Sicredi.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <h3 className="text-2xl font-bold text-[#6DBF4A] mb-8 flex items-center gap-3">
            <Banknote className="w-8 h-8" /> Linhas de Crédito
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0D1F0D] border border-[#1A3A0A] p-6 rounded-xl hover:border-[#6DBF4A]/50 transition-colors">
              <Sprout className="w-6 h-6 text-[#A8B8A0] mb-3" />
              <h4 className="text-white font-medium">Custeio Agrícola</h4>
            </div>
            <div className="bg-[#0D1F0D] border border-[#1A3A0A] p-6 rounded-xl hover:border-[#6DBF4A]/50 transition-colors">
              <Tractor className="w-6 h-6 text-[#A8B8A0] mb-3" />
              <h4 className="text-white font-medium">Investimento</h4>
            </div>
            <div className="bg-[#0D1F0D] border border-[#1A3A0A] p-6 rounded-xl hover:border-[#6DBF4A]/50 transition-colors">
              <TrendingUp className="w-6 h-6 text-[#A8B8A0] mb-3" />
              <h4 className="text-white font-medium">Comercialização</h4>
            </div>
            <div className="bg-[#0D1F0D] border border-[#1A3A0A] p-6 rounded-xl hover:border-[#6DBF4A]/50 transition-colors">
              <Home className="w-6 h-6 text-[#A8B8A0] mb-3" />
              <h4 className="text-white font-medium">Compra de Terras</h4>
            </div>
          </div>
          <div className="bg-[#1A3A0A] rounded-xl p-6 border border-[#6DBF4A]/30">
            <h4 className="text-white font-bold mb-2">Relatório AgroIA para Crédito</h4>
            <p className="text-[#A8B8A0] text-sm mb-4">
              Gere um documento completo com 1 clique para apresentar ao seu gerente.
            </p>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6DBF4A] text-sm font-bold flex items-center hover:underline"
            >
              Falar com especialista AgroIA <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#009959] mb-8 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" /> Seguros Sicredi
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0D1F0D] border border-[#1A3A0A] p-6 rounded-xl hover:border-[#009959]/50 transition-colors">
              <SunSnow className="w-6 h-6 text-[#A8B8A0] mb-3" />
              <h4 className="text-white font-medium">Seguro Agrícola</h4>
            </div>
            <div className="bg-[#0D1F0D] border border-[#1A3A0A] p-6 rounded-xl hover:border-[#009959]/50 transition-colors">
              <ShieldCheck className="w-6 h-6 text-[#A8B8A0] mb-3" />
              <h4 className="text-white font-medium">Seguro Pecuário</h4>
            </div>
            <div className="bg-[#0D1F0D] border border-[#1A3A0A] p-6 rounded-xl hover:border-[#009959]/50 transition-colors">
              <Tractor className="w-6 h-6 text-[#A8B8A0] mb-3" />
              <h4 className="text-white font-medium">Máquinas</h4>
            </div>
            <div className="bg-[#0D1F0D] border border-[#1A3A0A] p-6 rounded-xl hover:border-[#009959]/50 transition-colors">
              <Home className="w-6 h-6 text-[#A8B8A0] mb-3" />
              <h4 className="text-white font-medium">Benfeitorias</h4>
            </div>
          </div>
          <div className="bg-[#0A1A0A] rounded-xl p-6 border border-[#009959]/30">
            <h4 className="text-white font-bold mb-2">Prevenção com IA</h4>
            <p className="text-[#A8B8A0] text-sm">
              A AgroIA emite alertas climáticos antecipados, ajudando você a acionar o seguro no
              momento certo e evitar perdas maiores.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
