import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Heart, Calendar, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function Reproducao() {
  const [tipo, setTipo] = useState('')
  const [dataCio, setDataCio] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<any>(null)

  const [alertas, setAlertas] = useState<any[]>([])
  const [loadingAlertas, setLoadingAlertas] = useState(false)
  const { toast } = useToast()

  const calcularCio = async () => {
    if (!tipo || !dataCio) {
      toast({ title: 'Atenção', description: 'Preencha o tipo e a data.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('calcular-cio', {
        body: { tipo, ultima_data_cio: dataCio },
      })
      if (error) throw error
      if (!data?.success) throw new Error(data?.error || 'Erro ao calcular cio')

      setResultado(data.data)
      toast({ title: 'Sucesso', description: 'Cálculo realizado com sucesso!' })
    } catch (e: any) {
      if (e.message?.toLowerCase().includes('limite')) {
        toast({
          title: 'Aviso de Limite',
          description: e.message,
          className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        })
      } else {
        toast({ title: 'Erro', description: e.message, variant: 'destructive' })
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchAlertas = async () => {
    setLoadingAlertas(true)
    try {
      await supabase.functions.invoke('gerar-alertas-cio')
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) return

      const { data, error } = await supabase
        .from('alertas_cio')
        .select('id, mensagem, data_alerta, animal_id, animais(nome, tipo, proximo_cio_estimado)')
        .eq('user_id', userData.user.id)
        .order('data_alerta', { ascending: false })

      if (error) throw error
      setAlertas(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingAlertas(false)
    }
  }

  useEffect(() => {
    fetchAlertas()
  }, [])

  return (
    <div className="p-2 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Heart className="w-8 h-8 text-rose-500" /> Reprodução
        </h1>
        <p className="text-muted-foreground mt-1">
          Controle de ciclos reprodutivos e alertas de cio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-white/10 text-white">
          <CardHeader>
            <CardTitle>Calculadora de Cio (IA)</CardTitle>
            <CardDescription className="text-zinc-400">
              Estime a próxima data de cio com base no tipo de animal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Tipo de Animal</label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="Bovino">Bovino</SelectItem>
                  <SelectItem value="Suíno">Suíno</SelectItem>
                  <SelectItem value="Equino">Equino</SelectItem>
                  <SelectItem value="Ovino">Ovino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Data do Último Cio</label>
              <Input
                type="date"
                value={dataCio}
                onChange={(e) => setDataCio(e.target.value)}
                className="bg-zinc-900 border-white/10 text-white"
              />
            </div>
            <Button
              onClick={calcularCio}
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Calcular Próximo Cio
            </Button>

            {resultado && (
              <Alert className="bg-rose-500/10 border-rose-500/20 mt-4">
                <Heart className="w-4 h-4 text-rose-500" />
                <AlertTitle className="text-rose-400">
                  Previsão:{' '}
                  {resultado.proximo_cio_estimado
                    ? new Date(resultado.proximo_cio_estimado).toLocaleDateString('pt-BR', {
                        timeZone: 'UTC',
                      })
                    : 'N/D'}
                </AlertTitle>
                <AlertDescription className="text-rose-200/80">
                  Recomendações:{' '}
                  {resultado.recomendacoes ||
                    'Monitore o comportamento do animal nos próximos dias.'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 text-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Alertas de Cio (7 dias)</CardTitle>
                <CardDescription className="text-zinc-400">
                  Animais com cio previsto para os próximos dias.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAlertas}
                disabled={loadingAlertas}
                className="border-white/10 text-zinc-300 bg-transparent hover:bg-white/5 hover:text-white"
              >
                <Loader2 className={`w-4 h-4 ${loadingAlertas ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {alertas.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <Heart className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>Nenhum alerta para os próximos 7 dias.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
                {alertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 flex gap-3 items-start"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-rose-400">
                        {alerta.animais?.nome || 'Animal'} ({alerta.animais?.tipo})
                      </h4>
                      <p className="text-sm text-rose-200/80 mt-1">{alerta.mensagem}</p>
                      <p className="text-xs text-rose-500/60 mt-2">
                        Previsão:{' '}
                        {alerta.animais?.proximo_cio_estimado
                          ? new Date(alerta.animais.proximo_cio_estimado).toLocaleDateString(
                              'pt-BR',
                              { timeZone: 'UTC' },
                            )
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
