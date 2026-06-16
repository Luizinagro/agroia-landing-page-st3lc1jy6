import { ArrowDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from './AnimatedSection'

export function HeroSection() {
  return (
    <AnimatedSection className="max-w-[1200px] mx-auto px-6 py-12 md:py-20 text-center">
      <div className="inline-flex items-center justify-center gap-4 mb-8 bg-[#1A3A0A]/50 px-6 py-2 rounded-full border border-[#2E5A1A]">
        <span className="text-2xl font-bold tracking-tight text-white">
          AGRO<span className="text-[#6DBF4A]">IA</span>
        </span>
        <span className="text-[#F9A825] font-bold text-xl">×</span>
        <span className="text-2xl font-bold tracking-tight text-[#009959]">Sicredi</span>
      </div>

      <div className="mb-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#1A3A0A] border border-[#F9A825]/30 text-[#F9A825] font-medium text-sm">
          ✦ Parceria Estratégica para o Agronegócio Brasileiro
        </span>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
        <span className="text-white block">AgroIA × Sicredi:</span>
        <span className="text-[#6DBF4A] block">Tecnologia e Crédito para o Campo</span>
      </h1>

      <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
        <div className="text-center">
          <p className="text-3xl font-bold text-white mb-1">500+</p>
          <p className="text-sm text-[#A8B8A0]">Produtores</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[#6DBF4A] mb-1">R$ 15.000</p>
          <p className="text-sm text-[#A8B8A0]">Economizados</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[#F9A825] mb-1">30s</p>
          <p className="text-sm text-[#A8B8A0]">Diagnóstico</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          onClick={() => document.getElementById('flow')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#6DBF4A] hover:bg-[#5CA83A] text-[#0A1A0A] font-bold px-8 py-6 text-lg rounded-full"
        >
          Ver Como Funciona <ArrowDown className="ml-2 w-5 h-5" />
        </Button>
        <Button
          onClick={() =>
            document.getElementById('discount')?.scrollIntoView({ behavior: 'smooth' })
          }
          variant="outline"
          className="border-[#009959] text-[#009959] hover:bg-[#009959]/10 font-bold px-8 py-6 text-lg rounded-full"
        >
          Sou Associado Sicredi <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </AnimatedSection>
  )
}
