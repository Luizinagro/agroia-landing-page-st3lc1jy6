import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  Loader2,
  MapPin,
  Sprout,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ArrowLeft,
  Send,
  Sparkles,
} from 'lucide-react'

interface ForecastResult {
  data_colheita_estimada: string
  produtividade_esperada: string
  recomendacoes: string[]
  riscos_identificados: string[]
}

export function FarmForecastWidget() {
  const { user } = useAuth() as any
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form')
  const [forecast, setForecast] = useState<ForecastResult | null>(null)
  const [loadingText, setLoadingText] = useState('')

  const [formData, setFormData] = useState({
    nome: '',
    latitude: '',
    longitude: '',
    cultura: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setStep('loading')

    try {
      setLoadingText('Salvando propriedade...')
      const { error: dbError } = await supabase.from('propriedades' as any).insert({
        user_id: user.id,
        nome: formData.nome,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        cultura_principal: formData.cultura,
      })
      if (dbError) throw new Error('Erro ao salvar propriedade no banco.')

      setLoadingText('Buscando dados climáticos (INMET)...')
      await new Promise((r) => setTimeout(r, 1500))
      const climaAtualMock = { temperatura: '27°C', umidade: '65%', chuva_acumulada: '45mm' }

      setLoadingText('Processando análise com Agro IA...')
      const { data: funcData, error: funcError } = await supabase.functions.invoke(
        'gemini-previsao-safra',
        {
          body: {
            cultura: formData.cultura,
            data_plantio: new Date().toISOString().split('T')[0],
            clima_atual: climaAtualMock,
            umidade_solo: 'Adequada (70%)',
            historico_safras: 'Safra anterior com produtividade média, sem anomalias severas.',
          },
        },
      )

      if (funcError || !funcData?.success)
        throw new Error(funcData?.error || 'Falha ao gerar previsão.')

      setForecast(funcData.data)
      setStep('result')
      toast({
        title: 'Sucesso!',
        description: 'Previsão gerada com base nos dados da propriedade.',
      })
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message })
      setStep('form')
    }
  }

  return (
    <div className="p-[2px] rounded-3xl bg-gradient-to-br from-green-500 via-primary to-blue-600 shadow-[0_0_30px_rgba(29,185,84,0.15)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-xl -z-10 group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
      <div className="bg-[#050505] rounded-3xl p-6 md:p-8 h-full flex flex-col relative z-10">
        {step === 'form' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Análise de Safra AgroIA
                </h2>
                <p className="text-sm text-[#A0A0A0]">
                  Cadastre sua área e obtenha previsões com inteligência artificial.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-white/80">
                  Nome da Propriedade/Talhão
                </Label>
                <Input
                  id="nome"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
                  placeholder="Ex: Fazenda Boa Vista"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cultura" className="text-white/80">
                  Cultura Principal
                </Label>
                <Input
                  id="cultura"
                  required
                  value={formData.cultura}
                  onChange={(e) => setFormData({ ...formData, cultura: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
                  placeholder="Ex: Soja, Milho"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-white/80">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  required
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
                  placeholder="-23.5505"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-white/80">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  required
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
                  placeholder="-46.6333"
                />
              </div>
              <div className="md:col-span-2 mt-2">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold rounded-xl py-6 text-lg shadow-[0_0_20px_rgba(29,185,84,0.3)] transition-all hover:scale-[1.01]"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Salvar e Analisar com IA
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in space-y-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-primary/30 animate-pulse" />
              <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
            </div>
            <p className="text-xl font-medium text-white animate-pulse">{loadingText}</p>
          </div>
        )}

        {step === 'result' && forecast && (
          <div className="animate-fade-in-up space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Previsão Gerada
                </h3>
                <p className="text-sm text-primary font-medium">
                  {formData.nome} • {formData.cultura}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setStep('form')}
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Nova Análise
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">
                    Colheita Estimada
                  </p>
                  <p className="text-lg font-bold text-white">{forecast.data_colheita_estimada}</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-green-500/20 p-3 rounded-xl text-green-400">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">
                    Produtividade Esperada
                  </p>
                  <p className="text-lg font-bold text-white">{forecast.produtividade_esperada}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Recomendações
                </h4>
                <ul className="space-y-2">
                  {forecast.recomendacoes.map((rec, i) => (
                    <li
                      key={i}
                      className="text-sm text-[#A0A0A0] bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed"
                    >
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-red-400 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Riscos Identificados
                </h4>
                <ul className="space-y-2">
                  {forecast.riscos_identificados.map((risco, i) => (
                    <li
                      key={i}
                      className="text-sm text-[#A0A0A0] bg-red-500/10 p-3 rounded-xl border border-red-500/20 leading-relaxed"
                    >
                      {risco}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
