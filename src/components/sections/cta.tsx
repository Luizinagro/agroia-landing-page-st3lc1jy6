import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ScrollReveal'

export function CTA() {
  return (
    <section className="py-12 md:py-20 bg-[#0A1A0A] border-t border-[#1E3A1E]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <ScrollReveal className="bg-[#0D1F0D] border border-[#6DBF4A]/30 rounded-xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6DBF4A]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4A8A1A]/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-[#F5F0E8] mb-6">
              Pronto para colocar a IA para trabalhar na sua lavoura?
            </h2>
            <p className="text-[#A8B8A0] text-lg mb-10">
              Junte-se aos produtores que já estão economizando milhares de reais por safra com
              decisões baseadas em dados precisos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/cadastro">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-[#6DBF4A] text-[#0D1F0D] hover:bg-[#6DBF4A]/90 shadow-lg shadow-[#6DBF4A]/20"
                >
                  Começar Grátis Agora
                </Button>
              </Link>
              <span className="text-[#A8B8A0] text-sm font-medium">
                Não precisa de cartão de crédito
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
