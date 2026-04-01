import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Check, Tractor, LogOut, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

const plans = [
  {
    name: 'Plantio Solo',
    price: 'R$147',
    period: '/mês',
    description: 'Para pequenos produtores',
    features: ['Previsão IA 92% precisão', 'Alertas de pragas', 'Suporte horário comercial'],
    highlighted: false,
  },
  {
    name: 'Completo',
    price: 'R$347',
    period: '/mês',
    description: 'A solução definitiva',
    features: ['SaaS Faturamento', 'Rastreabilidade ESG', 'Suporte prioritário 24/7'],
    highlighted: true,
  },
  {
    name: 'Família Coop',
    price: 'R$747',
    period: '/mês',
    description: 'Para grandes grupos',
    features: ['Até 5 propriedades', 'Relatórios consolidados', 'Consultoria dedicada'],
    highlighted: false,
  },
]

export default function PlanSelection() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const isExpired = user?.data_trial_expira && new Date(user.data_trial_expira) < new Date()

  const handleSubscribe = (planName: string) => {
    // Remove expiration to simulate active paid plan
    updateUser({
      plano: planName,
      data_trial_expira: undefined,
    })

    toast({
      title: 'Plano atualizado com sucesso!',
      description: `Sua assinatura do plano ${planName} está ativa.`,
      className: 'bg-[#1a3c34] text-white border-[#f4d03f]',
    })

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#1a3c34] flex flex-col font-sans selection:bg-[#f4d03f]/30">
      <header className="border-b border-white/10 bg-[#1a3c34]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <Tractor className="w-6 h-6 text-[#f4d03f]" />
            <span>AgroIA</span>
          </div>
          <Button
            variant="ghost"
            onClick={logout}
            className="text-white hover:bg-white/10 hover:text-[#f4d03f]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 container px-4 py-12 md:py-24 mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {isExpired && (
            <div className="inline-flex items-center gap-2 bg-[#f4d03f] text-[#1a3c34] px-4 py-2 rounded-full font-bold mb-6 text-sm">
              <AlertCircle className="w-5 h-5" />
              Seu período de teste de 14 dias expirou.
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Escolha seu Plano AgroIA
          </h1>
          <p className="text-white/80 text-lg md:text-xl">
            Para continuar acessando as ferramentas de IA hiperlocal, previsão de clima e
            rastreabilidade ESG, selecione um de nossos planos profissionais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                'flex flex-col relative transition-all duration-300 animate-in fade-in slide-in-from-bottom-8',
                plan.highlighted
                  ? 'border-[#f4d03f] shadow-2xl scale-105 z-10 bg-white'
                  : 'border-white/10 bg-white/5 hover:border-[#f4d03f]/50 backdrop-blur-sm',
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f4d03f] text-[#1a3c34] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg">
                  Mais Popular
                </div>
              )}
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle
                  className={cn(
                    'text-2xl mb-2',
                    plan.highlighted ? 'text-[#1a3c34]' : 'text-white',
                  )}
                >
                  {plan.name}
                </CardTitle>
                <p
                  className={cn(
                    'text-sm mb-6',
                    plan.highlighted ? 'text-zinc-600' : 'text-white/60',
                  )}
                >
                  {plan.description}
                </p>
                <div className="flex items-end justify-center gap-1">
                  <span
                    className={cn(
                      'text-4xl font-bold',
                      plan.highlighted ? 'text-[#1a3c34]' : 'text-white',
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={cn(
                        'mb-1.5 font-medium',
                        plan.highlighted ? 'text-zinc-500' : 'text-white/50',
                      )}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className={cn(
                        'flex items-start gap-3 text-sm font-medium',
                        plan.highlighted ? 'text-zinc-700' : 'text-white/80',
                      )}
                    >
                      <Check
                        className={cn(
                          'w-5 h-5 shrink-0 mt-0.5',
                          plan.highlighted ? 'text-[#1a3c34]' : 'text-[#f4d03f]',
                        )}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-6 pb-8">
                <Button
                  onClick={() => handleSubscribe(plan.name)}
                  className={cn(
                    'w-full h-12 text-base font-bold transition-all shadow-md',
                    plan.highlighted
                      ? 'bg-[#f4d03f] hover:bg-[#f4d03f]/90 text-[#1a3c34] hover:scale-[1.02]'
                      : 'bg-white hover:bg-white/90 text-[#1a3c34]',
                  )}
                >
                  Assinar {plan.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
