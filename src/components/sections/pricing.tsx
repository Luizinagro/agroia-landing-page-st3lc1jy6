import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const plans = [
  {
    nome: 'Explorador',
    precoMensal: 0,
    precoAnual: 0,
    descricao: 'Ideal para quem quer descobrir o poder da plataforma.',
    features: [
      'Dashboard básico',
      'Cadastro 1 propriedade',
      'Clima em tempo real',
      'Comunidade (Leitura)',
    ],
    featuresOff: ['AI Avançada', 'Análise de Satélite', 'Calculadora ROI'],
    botao: 'Começar Grátis Agora →',
    destaque: false,
    savingsInfo: null,
    subText: 'Não precisa de cartão de crédito',
  },
  {
    nome: 'Lavoura',
    precoMensal: 149,
    precoAnual: 124,
    descricao: 'Para o produtor focado na lavoura e na terra.',
    features: [
      'Tudo do Explorador',
      'Satélite (NDVI + umidade)',
      'Consultor IA (15/mês)',
      'Pragas e Doenças',
      'Calendário e Irrigação',
      'Calculadora ROI',
    ],
    featuresOff: ['Gestão de Rebanho'],
    botao: 'Assinar Lavoura →',
    destaque: false,
    savingsInfo: 'Você economiza R$ 300/ano',
    subText: null,
  },
  {
    nome: 'Rebanho',
    precoMensal: 149,
    precoAnual: 124,
    descricao: 'Para quem cria gado com inteligência.',
    features: [
      'Tudo do Explorador',
      'Gestão de rebanho',
      'Rastreamento individual',
      'Alertas de Cio',
      'Nutrição e saúde',
      'Doenças por foto',
    ],
    featuresOff: ['Análise de Satélite'],
    botao: 'Assinar Rebanho →',
    destaque: false,
    savingsInfo: 'Você economiza R$ 300/ano',
    subText: null,
  },
  {
    nome: 'Fazendeiro Completo',
    precoMensal: 349,
    precoAnual: 291,
    descricao: 'Visão total e ferramentas avançadas unificadas.',
    features: [
      'TUDO ILIMITADO',
      'Calculadora de Carbono',
      'CRM de Vendas',
      'Dashboard Consolidado',
      'Consultoria mensal VIP',
      'Histórico ilimitado',
    ],
    featuresOff: ['Múltiplos usuários'],
    botao: 'Quero o Fazendeiro Completo →',
    destaque: true,
    savingsInfo: 'Você economiza R$ 696/ano',
    subText: 'Mais escolhido pelos produtores',
  },
  {
    nome: 'Cooperativa',
    precoMensal: 799,
    precoAnual: 666,
    descricao: 'Famílias, grupos e grandes operações.',
    features: [
      'Tudo do Completo',
      'Até 5 usuários',
      'Até 10 propriedades',
      'Acesso API customizada',
      'Backup real-time',
      'Gestão de permissões',
      'Treinamento dedicado',
    ],
    featuresOff: [],
    botao: 'Falar com Consultor →',
    destaque: false,
    savingsInfo: 'Você economiza R$ 1.596/ano',
    subText: null,
  },
]

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="planos" className="py-12 md:py-24 bg-[#0A1A0A] border-t border-[#1E3A1E]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#F5F0E8] mb-6 tracking-tight">
            Planos simples e justos
          </h2>
          <p className="text-[#A8B8A0] max-w-2xl mx-auto text-lg mb-10">
            Comece grátis e evolua conforme a sua operação cresce. Tecnologia B2B de ponta.
          </p>

          <div className="flex items-center justify-center gap-4 bg-[#0D1F0D] inline-flex p-2.5 rounded-full border border-[#1E3A1E] shadow-sm">
            <span
              className={cn(
                'text-sm font-semibold',
                !isAnnual ? 'text-[#F5F0E8]' : 'text-[#A8B8A0]',
              )}
            >
              Mensal
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-[#6DBF4A]"
            />
            <span
              className={cn(
                'text-sm font-semibold flex items-center gap-2',
                isAnnual ? 'text-[#F5F0E8]' : 'text-[#A8B8A0]',
              )}
            >
              Anual{' '}
              <span className="bg-[#4A8A1A]/20 text-[#6DBF4A] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-[#6DBF4A]/20">
                Até 17% OFF
              </span>
            </span>
          </div>
        </ScrollReveal>

        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1200px] mx-auto">
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.precoAnual : plan.precoMensal
            return (
              <ScrollReveal
                key={plan.nome}
                delay={idx * 100}
                className="min-w-[300px] snap-center shrink-0 h-full"
              >
                <div
                  className={cn(
                    'bg-[#0D1F0D] border flex flex-col rounded-2xl px-8 py-8 h-full transition-transform hover:-translate-y-1',
                    plan.destaque
                      ? 'border-[#6DBF4A] shadow-[0_0_30px_rgba(109,191,74,0.15)] md:scale-105 z-10 relative border-2'
                      : 'border-[#1E3A1E]',
                  )}
                >
                  {plan.destaque && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6DBF4A] text-[#0D1F0D] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      Mais Popular
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#F5F0E8] mb-3">{plan.nome}</h3>
                    <p className="text-[#A8B8A0] text-sm min-h-[44px] leading-relaxed">
                      {plan.descricao}
                    </p>
                    <div className="mt-8 flex flex-col min-h-[80px]">
                      <div className="flex items-end gap-2 text-[#F5F0E8]">
                        <span className="text-lg font-medium text-[#A8B8A0] mb-2">R$</span>
                        <span className="text-5xl font-black tracking-tight">
                          {price === 0 ? '0' : price}
                        </span>
                        <div className="flex flex-col mb-2">
                          {isAnnual && price > 0 && (
                            <span className="text-[#A8B8A0] text-xs line-through mb-0.5">
                              R$ {plan.precoMensal}
                            </span>
                          )}
                          <span className="text-[#A8B8A0] font-medium text-sm">/mês</span>
                        </div>
                      </div>
                      {isAnnual && plan.savingsInfo && (
                        <div className="text-[#6DBF4A] text-xs font-semibold mt-3">
                          {plan.savingsInfo}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 mb-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start text-[#A8B8A0]">
                          <Check className="w-5 h-5 text-[#6DBF4A] mr-3 shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                      {plan.featuresOff.map((feature, j) => (
                        <li key={`off-${j}`} className="flex items-start text-[#4A8A1A]/60">
                          <X className="w-5 h-5 text-red-500/40 mr-3 shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto pt-8 border-t border-[#1E3A1E] flex flex-col items-center gap-3">
                    <Link to="/cadastro" className="w-full block">
                      <Button
                        size="lg"
                        className={cn(
                          'w-full font-bold h-12 rounded-xl transition-all text-sm',
                          plan.destaque
                            ? 'bg-[#6DBF4A] text-[#0D1F0D] hover:bg-[#6DBF4A]/90 shadow-lg'
                            : 'bg-[#1A331A] text-[#F5F0E8] hover:bg-[#254A25] border border-[#2E5A2E]',
                        )}
                      >
                        {plan.botao}
                      </Button>
                    </Link>
                    {plan.subText && (
                      <span
                        className={cn(
                          'text-xs text-center font-medium mt-1',
                          plan.destaque ? 'text-[#6DBF4A]' : 'text-[#A8B8A0]',
                        )}
                      >
                        {plan.subText}
                      </span>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
      <style
        dangerouslySetInlineStyle={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </section>
  )
}
