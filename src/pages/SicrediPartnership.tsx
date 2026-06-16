import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'
import { HeroSection } from '@/components/sicredi/HeroSection'
import { ComparisonSection } from '@/components/sicredi/ComparisonSection'
import { PracticalFlowSection } from '@/components/sicredi/PracticalFlowSection'
import { DiscountSection } from '@/components/sicredi/DiscountSection'
import { GridsSection } from '@/components/sicredi/GridsSection'
import { ExecutiveSection } from '@/components/sicredi/ExecutiveSection'
import { SocialProofSection } from '@/components/sicredi/SocialProofSection'

export default function SicrediPartnership() {
  return (
    <>
      <SEO
        title="AgroIA × Sicredi — Parceria Estratégica"
        description="Crédito rural inteligente integrado à gestão da sua propriedade. Conheça as vantagens exclusivas."
      />
      <div className="w-full bg-[#0A1A0A] font-sans sm:rounded-2xl overflow-hidden shadow-2xl">
        <HeroSection />
        <ComparisonSection />
        <PracticalFlowSection />
        <DiscountSection />
        <GridsSection />
        <ExecutiveSection />
        <SocialProofSection />

        <footer className="bg-[#070F07] py-12 border-t border-[#1A3A0A] mt-10">
          <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col items-center">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xl font-bold tracking-tight text-white">
                AGRO<span className="text-[#6DBF4A]">IA</span>
              </span>
              <span className="text-[#F9A825] font-bold">×</span>
              <span className="text-xl font-bold tracking-tight text-[#009959]">Sicredi</span>
            </div>
            <p className="text-[#A8B8A0] italic mb-8 max-w-md">
              "Juntos, cultivamos o futuro do seu agronegócio."
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className="text-[#A8B8A0] hover:text-white hover:bg-[#1A3A0A]"
                >
                  Acessar Sistema
                </Button>
              </Link>
              <Link to="/planos">
                <Button
                  variant="ghost"
                  className="text-[#A8B8A0] hover:text-white hover:bg-[#1A3A0A]"
                >
                  Ver Planos
                </Button>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
