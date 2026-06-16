import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'

export default function SicrediPartnership() {
  const WHATSAPP_NUMBER = '5511999999999'
  const MSG = encodeURIComponent('Olá! Vi a parceria AgroIA × Sicredi e quero saber mais.')

  return (
    <>
      <SEO
        title="AgroIA × Sicredi — Parceria Estratégica"
        description="Crédito rural inteligente integrado à gestão da sua propriedade"
      />
      <div
        className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] rounded-2xl p-6 shadow-inner"
        style={{ backgroundColor: '#0D1F0D', color: '#F5F0E8' }}
      >
        <div className="text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            AgroIA × Sicredi — Parceria Estratégica
          </h1>
          <h2 className="text-xl md:text-2xl mb-8 font-medium opacity-90">
            Crédito rural inteligente integrado à gestão da sua propriedade
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-80">
            Em breve: benefícios exclusivos para cooperados Sicredi que usam a AgroIA.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="bg-[#00C853] hover:bg-[#009959] text-black font-bold px-8 py-6 text-lg rounded-full shadow-lg transition-all hover:scale-105">
              <MessageCircle className="mr-2 w-6 h-6" />
              Falar com nosso time via WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </>
  )
}
