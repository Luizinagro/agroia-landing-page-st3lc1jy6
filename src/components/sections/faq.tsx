import { ScrollReveal } from '@/components/ScrollReveal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'Preciso de internet rápida na roça para usar a AgroIA?',
    a: 'Não. O aplicativo foi desenhado para funcionar de forma offline nos principais módulos de coleta. Quando você chegar em uma área com sinal, ele sincroniza automaticamente com a nuvem e processa a IA.',
  },
  {
    q: 'Meus dados estarão seguros?',
    a: 'Sim. Seus dados são criptografados de ponta a ponta e armazenados em servidores seguros no Brasil, respeitando totalmente a LGPD e garantindo sua privacidade produtiva.',
  },
  {
    q: 'Como funciona os 7 dias grátis?',
    a: 'Você se cadastra sem precisar de cartão de crédito e ganha acesso completo ao plano Explorador e a alguns recursos selecionados de IA. Após 7 dias, você decide se quer assinar um plano pago ou continuar apenas com o básico gratuito.',
  },
  {
    q: 'O diagnóstico de pragas funciona para qualquer cultura?',
    a: 'Atualmente nossa IA possui mais de 98% de precisão para Soja, Milho, Algodão, Café e Cana-de-açúcar. Estamos constantemente treinando o modelo para novas culturas.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Com certeza. Os planos mensais não possuem fidelidade nem multa de cancelamento. Você tem controle total.',
  },
  {
    q: 'Funciona em área rural com internet fraca?',
    a: 'Sim. A AgroIA foi desenvolvida para funcionar em áreas rurais com sinal de 3G ou 4G. As análises mais pesadas são feitas em nuvem e você recebe os resultados de forma simples, mesmo com conexão lenta. Offline parcial também está disponível para consulta de dados já sincronizados.',
  },
]

export function FAQ() {
  return (
    <section className="py-12 md:py-20 bg-[#070F07]">
      <div className="container mx-auto px-4 max-w-[800px]">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-4">
            Dúvidas que todo produtor tem
          </h2>
          <p className="text-[#A8B8A0] text-lg">
            Tudo o que você precisa saber antes de embarcar na agricultura digital.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-[#1E3A1E] bg-[#0D1F0D] rounded-xl px-6 data-[state=open]:border-[#6DBF4A]/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-[#F5F0E8] hover:text-[#6DBF4A] hover:no-underline font-semibold py-5 text-base md:text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#A8B8A0] leading-relaxed pb-6 text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  )
}
