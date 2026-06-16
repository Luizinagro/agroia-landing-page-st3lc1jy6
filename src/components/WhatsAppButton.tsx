import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Tenho%20interesse%20na%20AgroIA.%20Pode%20me%20ajudar?"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#00C853] text-[#0A0F0D] p-4 rounded-full shadow-[0_0_20px_rgba(0,200,83,0.4)] hover:shadow-[0_0_30px_rgba(0,200,83,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-4 bg-[#111A13] text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
        Fale com um consultor
      </span>
    </a>
  )
}
