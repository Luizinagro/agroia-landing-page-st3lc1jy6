import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  BrainCircuit,
  BellRing,
  RefreshCw,
  Trash2,
  Plus,
  AlertTriangle,
  Cpu,
  MessageCircle,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getForecast, getAlerts, createAlert, deleteAlert } from '@/services/aiForecast'
import { sendWhatsAppNotification } from '@/services/whatsapp'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function PrevisaoIA() {
  const [commodity, setCommodity] = useState('Soja')
  const [forecast, setForecast] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [notifiedAlerts, setNotifiedAlerts] = useState<Set<string>>(new Set())

  const [alertTargetPrice, setAlertTargetPrice] = useState('')
  const [alertCondition, setAlertCondition] = useState('above')

  const fetchData = async (force = false) => {
    setLoading(true)
    try {
      const { data, error } = await getForecast(commodity, force)
      if (error) throw error
      setForecast(data)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const fetchAlerts = async () => {
    const { data } = await getAlerts()
    if (data) setAlerts(data)
  }

  useEffect(() => {
    fetchData()
  }, [commodity])
  useEffect(() => {
    if (user) fetchAlerts()
  }, [user])

  const triggeredAlerts = alerts.filter(
    (a) =>
      a.is_active &&
      a.commodity === forecast?.commodity &&
      ((a.condition === 'above' && forecast.current_price >= a.target_price) ||
        (a.condition === 'below' && forecast.current_price <= a.target_price)),
  )

  useEffect(() => {
    if (triggeredAlerts.length > 0 && user && forecast) {
      triggeredAlerts.forEach(async (alert) => {
        if (!notifiedAlerts.has(alert.id)) {
          // Send WhatsApp Notification
          const { error } = await sendWhatsAppNotification({
            event_type: 'PRICE_ALERT',
            user_id: user.id,
            data: {
              commodity: alert.commodity,
              target_price: alert.target_price,
              current_price: forecast.current_price,
            },
          })

          if (!error) {
            toast({
              title: 'Notificação WhatsApp Enviada!',
              description: `Alerta para ${alert.commodity}`,
            })
          } else {
            console.error('WhatsApp Error:', error)
          }

          setNotifiedAlerts((prev) => new Set(prev).add(alert.id))
        }
      })
    }
  }, [triggeredAlerts, user, notifiedAlerts, forecast, toast])

  const handleTestRecommendation = async () => {
    if (!user || !forecast) return
    toast({ title: 'Enviando notificação WhatsApp...' })
    const { error, data } = await sendWhatsAppNotification({
      event_type: 'AI_RECOMMENDATION',
      user_id: user.id,
      data: {
        commodity: forecast.commodity,
        recommendation: forecast.recommendation,
      },
    })

    if (error || data?.results?.[0]?.error) {
      const errorMsg = error?.message || data?.results?.[0]?.error
      toast({
        title: 'Erro ao enviar',
        description:
          errorMsg === 'User has no phone number'
            ? 'Cadastre seu telefone no perfil para receber notificações.'
            : errorMsg,
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Notificação enviada com sucesso!' })
    }
  }

  const handleAddAlert = async () => {
    if (!user) return
    try {
      await createAlert(user.id, commodity, parseFloat(alertTargetPrice), alertCondition)
      toast({ title: 'Alerta criado!' })
      setAlertTargetPrice('')
      fetchAlerts()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const chartConfig = {
    price: { label: 'Preço', color: 'hsl(var(--primary))' },
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Cpu className="h-8 w-8 text-primary" /> Previsão IA Gemini
          </h1>
          <p className="text-muted-foreground mt-1">
            Análise preditiva de preços de commodities para os próximos 30 dias.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={commodity} onValueChange={setCommodity}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {['Soja', 'Milho', 'Trigo', 'Café'].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => fetchData(true)} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {triggeredAlerts.length > 0 && (
        <div className="bg-destructive/15 text-destructive border border-destructive/30 p-4 rounded-lg flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-5 w-5" /> Alertas Atingidos!
          </div>
          <ul className="list-disc pl-5 text-sm">
            {triggeredAlerts.map((a) => (
              <li key={a.id}>
                {a.commodity} está {a.condition === 'above' ? 'acima' : 'abaixo'} de R${' '}
                {a.target_price} (Atual: R$ {forecast?.current_price})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Preços - {commodity}</CardTitle>
              <CardDescription>Projeção para os próximos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && !forecast ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Processando IA...
                </div>
              ) : forecast?.trend_data ? (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <LineChart
                    data={forecast.trend_data}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => format(parseISO(v), 'dd/MM', { locale: ptBR })}
                    />
                    <YAxis tickFormatter={(v) => `R$ ${v}`} domain={['auto', 'auto']} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="var(--color-price)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="flex items-center gap-2 text-primary">
                <BrainCircuit className="h-5 w-5" /> Recomendação da IA
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestRecommendation}
                disabled={!forecast || loading}
                className="text-xs"
              >
                <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                Testar WhatsApp
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {loading
                  ? 'Analisando cenários...'
                  : forecast?.recommendation || 'Selecione uma commodity para obter recomendações.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5" /> Criar Alerta
              </CardTitle>
              <CardDescription>Notificação quando atingir meta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preço Alvo (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  placeholder="Ex: 150.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Condição</Label>
                <Select value={alertCondition} onValueChange={setAlertCondition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Maior ou igual a</SelectItem>
                    <SelectItem value="below">Menor ou igual a</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddAlert}
                className="w-full"
                disabled={!alertTargetPrice || loading}
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Alerta
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold px-1">Meus Alertas</h3>
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground px-1">Nenhum alerta configurado.</p>
            ) : (
              alerts.map((a) => (
                <Card key={a.id} className="p-4 flex items-center justify-between">
                  <div className="font-medium flex items-center gap-2 text-sm">
                    {a.commodity}{' '}
                    <Badge variant="outline">
                      {a.condition === 'above' ? '≥' : '≤'} R$ {a.target_price}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive h-8 w-8"
                    onClick={() => deleteAlert(a.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
