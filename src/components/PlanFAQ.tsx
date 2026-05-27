import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Shield, CreditCard, HeadphonesIcon } from 'lucide-react'
import { FAQS } from '@/data/plans-data'

export function PlanFAQ() {
  return (
    <div className="mt-24 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 text-center transition-all hover:bg-zinc-900">
          <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
          <h4 className="font-bold text-white mb-2">Cancele quando quiser</h4>
          <p className="text-sm text-zinc-400">
            Sem multas ou fidelidade obrigatória nos planos mensais.
          </p>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 text-center transition-all hover:bg-zinc-900">
          <CreditCard className="w-8 h-8 text-primary mx-auto mb-4" />
          <h4 className="font-bold text-white mb-2">7 dias grátis</h4>
          <p className="text-sm text-zinc-400">
            Comece pelo plano Explorador sem cadastrar cartão de crédito.
          </p>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 text-center transition-all hover:bg-zinc-900">
          <HeadphonesIcon className="w-8 h-8 text-primary mx-auto mb-4" />
          <h4 className="font-bold text-white mb-2">Suporte 100% no Brasil</h4>
          <p className="text-sm text-zinc-400">
            Nossa equipe é formada por especialistas e agrônomos brasileiros.
          </p>
        </div>
      </div>

      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-4">Perguntas Frequentes</h3>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
            <AccordionTrigger className="text-left text-zinc-200 hover:text-white hover:no-underline font-medium py-4">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 leading-relaxed pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
