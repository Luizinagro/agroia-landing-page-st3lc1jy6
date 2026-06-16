import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Switch } from '@/components/ui/switch'

const plans = [
  {
    nome: 'Explorador',
    precoMensal: 0,
    precoAnual: 0,
    descricao: 'Ideal para quem quer descobrir o poder da plataforma.',
    features: [
      '✅ Dashboard básico',
      '✅ Cadastro 1 propriedade',
      '✅ Clima em tempo real',
      '✅ Comunidade (Leitura)',
      '❌ AI Avançada',
      '❌ Análise de Satélite',
      '❌ Calculadora ROI',
    ],
    botao: 'Começar Grátis',
    destaque: false,
  },
  {
    nome: 'Lavoura',
    precoMensal: 149,
    precoAnual: 124,
    descricao: 'Para o produtor focado na lavoura e na terra.',
    features: [
      '✅ Tudo do Explorador +',
      '✅ Satélite (NDVI + umidade)',
      '✅ Consultor IA (15/mês)',
      '✅ Pragas e Doenças',
      '✅ Calendário e Irrigação',
      '✅ Calculadora ROI',
      '❌ Gestão de Rebanho',
    ],
    botao: 'Assinar Lavoura',
    destaque: false,
  },
  {
    nome: 'Rebanho',
    precoMensal: 199,
    precoAnual: 165,
    descricao: 'Para quem cria gado com inteligência.',
    features: [
      '✅ Tudo do Explorador +',
      '✅ Gestão de rebanho',
      '✅ Rastreamento individual',
      '✅ Alertas de Cio',
      '✅ Nutrição e saúde',
      '✅ Doenças por foto',
      '❌ Análise de Satélite',
    ],
    botao: 'Assinar Rebanho',
    destaque: false,
  },
  {
    nome: 'Fazendeiro Completo',
    precoMensal: 349,
    precoAnual: 290,
    descricao: 'Visão total e ferramentas avançadas unificadas.',
    features: [
      '✅ TUDO ILIMITADO',
      '✅ Calculadora de Carbono 🌱',
      '✅ CRM de Vendas',
      '✅ Dashboard Consolidado',
      '✅ Consultoria mensal VIP',
      '✅ Histórico ilimitado',
      '❌ Múltiplos usuários',
    ],
    botao: 'Escolher Completo',
    destaque: true,
  },
  {
    nome: 'Cooperativa',
    precoMensal: 799,
    precoAnual: 663,
    descricao: 'Famílias, grupos e grandes operações.',
    features: [
      '✅ Tudo do Completo +',
      '✅ Até 5 usuários',
      '✅ Até 10 propriedades',
      '✅ Acesso API customizada',
      '✅ Backup real-time',
      '✅ Gestão de permissões',
      '✅ Treinamento dedicado',
    ],
    botao: 'Falar com Consultor',
    destaque: false,
  },
]

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="planos" className="py-24 bg-[#111A13] border-t border-white/5">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Planos simples e justos
          </h2>
          <p className="text-[#A0AFA3] max-w-2xl mx-auto text-lg mb-8">
            Comece grátis e evolua conforme a sua operação cresce.
          </p>

          <div className="flex items-center justify-center gap-4 bg-[#0A0F0D] inline-flex p-2 rounded-full border border-white/5">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-[#A0AFA3]'}`}>
              Mensal
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-[#00C853]"
            />
            <span
              className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-[#A0AFA3]'}`}
            >
              Anual{' '}
              <span className="bg-[#00C853]/20 text-[#00C853] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                2 meses grátis
              </span>
            </span>
          </div>
        </ScrollReveal>

        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1400px] mx-auto">
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.precoAnual : plan.precoMensal
            return (
              <ScrollReveal
                key={plan.nome}
                delay={idx * 100}
                className="min-w-[300px] snap-center shrink-0"
              >
                <div
                  className={`bg-[#0A0F0D] border ${
                    plan.destaque
                      ? 'border-[#00C853] shadow-[0_0_30px_rgba(0,200,83,0.15)] md:scale-105 z-10 relative'
                      : 'border-white/5'
                  } flex flex-col rounded-3xl p-8 h-full transition-transform hover:-translate-y-1`}
                >
                  {plan.destaque && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00C853] text-[#0A0F0D] px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap shadow-lg">
                      Mais Escolhido
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.nome}</h3>
                    <p className="text-[#A0AFA3] text-sm min-h-[40px] leading-relaxed">
                      {plan.descricao}
                    </p>
                    <div className="mt-6 flex flex-col">
                      <div className="flex items-baseline text-white">
                        <span className="text-lg font-medium mr-1 text-[#A0AFA3]">R$</span>
                        <span className="text-5xl font-extrabold tracking-tight">
                          {price === 0 ? '0' : price}
                        </span>
                        <span className="text-[#A0AFA3] ml-2 font-medium text-sm">/mês</span>
                      </div>
                      {isAnnual && price > 0 && (
                        <div className="text-[#00C853] text-sm font-medium mt-1">
                          Faturado anualmente
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 mb-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, j) => {
                        const isNegative = feature.startsWith('❌')
                        const cleanFeature = feature.replace(/^[✅❌]\s*/, '')
                        return (
                          <li
                            key={j}
                            className={`flex items-start ${isNegative ? 'text-zinc-600' : 'text-zinc-300'}`}
                          >
                            {isNegative ? (
                              <X className="w-5 h-5 text-red-500/50 mr-3 shrink-0" />
                            ) : (
                              <Check className="w-5 h-5 text-[#00C853] mr-3 shrink-0" />
                            )}
                            <span className="text-sm font-medium">{cleanFeature}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className="mt-auto pt-6 border-t border-white/5">
                    <Link to="/cadastro" className="w-full block">
                      <Button
                        size="lg"
                        className={`w-full font-bold h-12 rounded-xl transition-all ${
                          plan.destaque
                            ? 'bg-[#00C853] text-[#0A0F0D] hover:bg-[#00C853]/90 shadow-lg'
                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {plan.botao}
                      </Button>
                    </Link>
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
