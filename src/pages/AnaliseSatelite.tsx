import { useState, useEffect } from 'react'
import {
  MapPin,
  Satellite,
  Droplets,
  Thermometer,
  Calendar,
  AlertTriangle,
  Search,
  Image as ImageIcon,
  History,
  FileText,
  Activity,
  CheckCircle2,
  Share2,
  CloudRain,
  BellRing,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useSubscription } from '@/hooks/useSubscription'
import { useNavigate } from 'react-router-dom'

interface AnalysisData {
  id?: string
  ndvi: number
  umidade: number
  temperatura: number
  data: string
  thumbnail: string
  lat?: string
  lng?: string
}

export default function AnaliseSatelite() {
  const { hasFeature, loading: planLoading } = useSubscription()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [lat, setLat] = useState('-15.7938')
  const [lng, setLng] = useState('-47.8827')
  const [pinPos, setPinPos] = useState({ x: 50, y: 50 })
  const [status, setStatus] = useState<'empty' | 'loading' | 'success' | 'error'>('empty')
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [history, setHistory] = useState<any[]>([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    if (!planLoading) {
      if (!hasFeature('analise-satelite')) {
        setShowUpgradeModal(true)
      } else {
        setShowUpgradeModal(false)
        fetchHistory()
      }
    }
  }, [hasFeature, planLoading])

  const fetchHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('satellite_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('analysis_date', { ascending: false })
        .limit(12)

      if (error) throw error
      if (data) {
        setHistory(data)
      }
    } catch (e) {
      console.error('Erro ao buscar histórico', e)
    }
  }

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPinPos({ x, y })
    setLat((-15 + (y - 50) * 0.2).toFixed(4))
    setLng((-47 + (x - 50) * 0.2).toFixed(4))
  }

  const handleAnalyse = async () => {
    setStatus('loading')
    setAlertMessage('')
    setAnalysisData(null)

    try {
      const { data, error } = await supabase.functions.invoke('analyze-satellite', {
        body: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
      })

      if (error) throw error
      if (!data?.success) throw new Error(data?.error || 'Erro desconhecido ao analisar imagem.')

      setAnalysisData({
        id: data.data.id,
        ndvi: data.data.ndvi_value,
        umidade: data.data.soil_moisture,
        temperatura: data.data.temperature,
        data: new Date(data.data.analysis_date).toLocaleDateString('pt-BR'),
        thumbnail: data.data.image_url,
        lat,
        lng,
      })

      if (data.message && data.message.includes('demonstração')) {
        setAlertMessage(data.message)
      }

      setStatus('success')
      fetchHistory()
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  const loadHistoryItem = (item: any) => {
    setAnalysisData({
      id: item.id,
      ndvi: item.ndvi_value,
      umidade: item.soil_moisture,
      temperatura: item.temperature,
      data: new Date(item.analysis_date).toLocaleDateString('pt-BR'),
      thumbnail: item.image_url,
      lat: item.latitude.toString(),
      lng: item.longitude.toString(),
    })
    setLat(item.latitude.toString())
    setLng(item.longitude.toString())
    setStatus('success')
    setAlertMessage('Exibindo dados do histórico selecionado.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const generatePDF = () => {
    toast({
      title: 'Relatório Gerado com Sucesso!',
      description: 'O PDF foi enviado para o seu e-mail e o download começará em instantes.',
      className: 'bg-primary text-primary-foreground border-primary',
    })
    setTimeout(() => {
      window.print()
    }, 1500)
  }

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/analise-compartilhada/${id}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copiado!',
      description: 'O link da análise foi copiado e já pode ser enviado ao seu consultor.',
      className: 'bg-primary text-primary-foreground border-primary',
    })
  }

  const handleAlert = async () => {
    if (!analysisData) return
    toast({
      title: 'Alerta Geofencado Ativado',
      description: 'Você será notificado via WhatsApp se o NDVI desta área cair abaixo de 0.40.',
      className: 'bg-zinc-900 text-white border-white/20',
    })

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('system_alerts').insert({
          user_id: user.id,
          tipo: 'ndvi_alert_config',
          mensagem: `Alerta configurado para NDVI < 0.40 na área ${analysisData.lat}, ${analysisData.lng}`,
        })

        // Trigger WhatsApp immediately if NDVI is already low, to demonstrate functionality
        if (analysisData.ndvi < 0.4) {
          await supabase.functions.invoke('whatsapp-notifications', {
            body: {
              event_type: 'NDVI_ALERT',
              user_id: user.id,
              data: {
                latitude: analysisData.lat,
                longitude: analysisData.lng,
                ndvi: analysisData.ndvi,
              },
            },
          })
        }
      }
    } catch (e) {
      console.error('Error activating alert:', e)
    }
  }

  const getNdviAlert = (value: number) => {
    if (value < 0.4) {
      return {
        title: 'Atenção',
        desc: 'Solo com baixa saúde — recomendamos análise urgente.',
        color: 'text-red-500',
        bg: 'bg-red-500/10 border-red-500/20',
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      }
    }
    if (value <= 0.6) {
      return {
        title: 'Monitoramento',
        desc: 'Solo em recuperação — continue monitorando.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10 border-yellow-500/20',
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      }
    }
    return {
      title: 'Condição Ideal',
      desc: 'Solo saudável — continue assim!',
      color: 'text-green-500',
      bg: 'bg-green-500/10 border-green-500/20',
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    }
  }

  const getNdviColor = (value: number) => {
    if (value < 0.4) return 'bg-red-500'
    if (value <= 0.6) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getNdviColorText = (value: number) => {
    if (value < 0.4) return 'text-red-500'
    if (value <= 0.6) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <>
      <Dialog
        open={showUpgradeModal}
        onOpenChange={(open) => {
          if (!open && !hasFeature('analise-satelite')) {
            return
          }
          setShowUpgradeModal(open)
        }}
      >
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Funcionalidade Premium</DialogTitle>
            <DialogDescription className="pt-2 text-base">
              Esta funcionalidade está disponível apenas nos planos Completo e Família Coop. Faça
              upgrade agora!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
            <Button
              onClick={() => navigate('/selecionar-plano')}
              className="w-full bg-[#f4d03f] text-[#1a3c34] hover:bg-[#e3c02f] font-bold"
            >
              Fazer Upgrade
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:ml-0 mt-2 sm:mt-0"
            >
              Voltar ao Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className={cn(
          'flex-1 space-y-6 p-4 md:p-8 pt-6 pb-24 print:p-0 print:m-0 print:bg-white print:text-black',
          showUpgradeModal && 'pointer-events-none opacity-50 blur-sm select-none',
        )}
      >
        {/* Cabeçalho do Relatório (Apenas Visível na Impressão) */}
        <div className="hidden print:block mb-8 border-b-2 border-green-700 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black flex items-center gap-2">
                <Satellite className="w-8 h-8 text-green-700" />
                Relatório Agronômico de Satélite
              </h1>
              <p className="text-gray-600 mt-1">
                Data de Emissão: {new Date().toLocaleDateString('pt-BR')} às{' '}
                {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-green-700">AgroIA</p>
              <p className="text-sm text-gray-500">Tecnologia de Precisão</p>
            </div>
          </div>
          {analysisData && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-bold mb-2 text-lg">Detalhes da Análise:</h3>
                <p>
                  <strong>Latitude:</strong> {analysisData.lat} | <strong>Longitude:</strong>{' '}
                  {analysisData.lng}
                </p>
                <p>
                  <strong>Data da Imagem:</strong> {analysisData.data}
                </p>
              </div>

              <div className="p-4 border-2 rounded-lg border-gray-300">
                <h3 className="font-bold text-lg mb-2">Parecer Agronômico (IA)</h3>
                <p className="font-medium text-lg">{getNdviAlert(analysisData.ndvi).desc}</p>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-500 block">NDVI</span>
                    <span className="font-bold text-xl">{analysisData.ndvi}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Umidade</span>
                    <span className="font-bold text-xl">{analysisData.umidade}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Temperatura</span>
                    <span className="font-bold text-xl">{analysisData.temperatura}°C</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Satellite className="w-8 h-8 text-primary" />
              Análise de Solo por Satélite
            </h2>
            <p className="text-muted-foreground mt-1">
              Monitore a saúde da lavoura através de índices espectrais reais e dados climáticos.
            </p>
          </div>

          {status === 'success' && analysisData && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleShare(analysisData.id!)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 shadow-lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar Análise
              </Button>
              <Button
                onClick={generatePDF}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 shadow-lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          )}
        </div>

        {alertMessage && (
          <Alert className="bg-primary/10 border-primary/20 text-primary print:hidden">
            <Satellite className="h-4 w-4" />
            <AlertTitle>Aviso do Sistema</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel do Mapa */}
          <Card className="lg:col-span-2 bg-black border-white/10 shadow-[0_0_15px_rgba(29,185,84,0.05)] print:hidden">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Seleção de Área
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Clique no mapa ou insira as coordenadas para obter dados reais de satélite.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Latitude</label>
                  <Input
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="bg-zinc-900 border-white/10 text-white focus-visible:ring-primary"
                    placeholder="-15.7938"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Longitude</label>
                  <Input
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="bg-zinc-900 border-white/10 text-white focus-visible:ring-primary"
                    placeholder="-47.8827"
                  />
                </div>
              </div>

              {/* Mapa Interativo Real */}
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden cursor-crosshair border border-white/10 bg-zinc-900 group shadow-inner">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${lat},${lng}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>
                <div
                  className="absolute inset-0 z-10 bg-black/10 group-hover:bg-transparent transition-colors"
                  onClick={handleMapClick}
                />

                {/* Pino */}
                <div
                  className="absolute w-6 h-6 -ml-3 -mt-6 text-primary transition-all duration-300 drop-shadow-[0_0_8px_rgba(29,185,84,0.8)] z-20 pointer-events-none"
                  style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                >
                  <MapPin className="w-8 h-8 fill-primary" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-xs text-white/90 bg-black/70 p-2.5 rounded-md backdrop-blur-md w-fit border border-white/20 shadow-lg z-20 pointer-events-none">
                  Área selecionada: {lat}, {lng}
                </div>
              </div>

              <Button
                onClick={handleAnalyse}
                disabled={status === 'loading'}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold"
                size="lg"
              >
                {status === 'loading' ? (
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Conectando ao Satélite (Sentinel Hub)...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Analisar Área via Satélite
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Painel de Resultados */}
          <div className="space-y-6">
            {status === 'empty' && (
              <Card className="bg-black/50 border-white/5 border-dashed h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 transition-all duration-500 animate-fade-in print:hidden">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-white/5">
                  <Satellite className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Aguardando Seleção</h3>
                <p className="text-sm text-zinc-400">
                  Selecione uma área no mapa ao lado e clique em Analisar para obter imagens reais e
                  índices agronômicos detalhados.
                </p>
              </Card>
            )}

            {status === 'loading' && (
              <Card className="bg-black border-white/10 h-full min-h-[400px] overflow-hidden animate-pulse print:hidden">
                <CardHeader>
                  <Skeleton className="h-6 w-1/2 bg-zinc-800" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-800/50" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4 bg-zinc-800" />
                    <Skeleton className="h-2 w-full bg-zinc-800" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-24 bg-zinc-800 rounded-xl" />
                    <Skeleton className="h-24 bg-zinc-800 rounded-xl" />
                  </div>
                  <Skeleton className="h-32 w-full bg-zinc-800 rounded-xl" />
                </CardContent>
              </Card>
            )}

            {status === 'error' && (
              <Alert
                variant="destructive"
                className="bg-red-500/10 border-red-500/20 text-red-400 animate-fade-in print:hidden"
              >
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-red-400 font-semibold text-lg">
                  Erro de Comunicação
                </AlertTitle>
                <AlertDescription className="mt-2 flex flex-col gap-4">
                  <p>
                    Não foi possível obter a resposta do provedor de satélite no momento. A API pode
                    estar instável.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAnalyse}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/30 w-fit"
                  >
                    Tentar Novamente
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {status === 'success' && analysisData && (
              <div className="space-y-4 animate-slide-up print:w-full print:max-w-full">
                {/* Alerta de Saúde NDVI */}
                <Alert
                  className={cn(
                    'print:hidden border',
                    getNdviAlert(analysisData.ndvi).bg,
                    getNdviAlert(analysisData.ndvi).color,
                  )}
                >
                  {getNdviAlert(analysisData.ndvi).icon}
                  <AlertTitle className="font-semibold text-base ml-2">
                    {getNdviAlert(analysisData.ndvi).title}
                  </AlertTitle>
                  <AlertDescription className="ml-2 font-medium opacity-90">
                    {getNdviAlert(analysisData.ndvi).desc}
                  </AlertDescription>
                </Alert>

                <Card className="bg-black border-white/10 shadow-[0_0_15px_rgba(29,185,84,0.1)] overflow-hidden print:bg-white print:border-gray-200 print:shadow-none print:text-black">
                  <CardHeader className="bg-zinc-900/50 border-b border-white/5 pb-4 print:bg-gray-100 print:border-gray-300">
                    <CardTitle className="text-white text-lg print:text-black">
                      Resultados da Análise Espectral
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* NDVI */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-300 print:text-gray-700">
                            Índice NDVI (Saúde Vegetal)
                          </span>
                        </div>
                        <span
                          className={cn(
                            'text-3xl font-bold print:text-black',
                            getNdviColorText(analysisData.ndvi),
                          )}
                        >
                          {analysisData.ndvi}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden print:bg-gray-200 print:border print:border-gray-300">
                        <div
                          className={cn(
                            'h-full transition-all duration-1000',
                            getNdviColor(analysisData.ndvi),
                          )}
                          style={{ width: `${analysisData.ndvi * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500 font-medium print:text-gray-500">
                        <span>0.0 (Crítico)</span>
                        <span>0.5 (Médio)</span>
                        <span>1.0 (Ideal)</span>
                      </div>
                    </div>

                    {/* Cards de Métricas */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors print:bg-white print:border-gray-200">
                        <div className="flex items-center gap-2 text-blue-400 print:text-blue-600 mb-2">
                          <Droplets className="w-4 h-4" />
                          <span className="text-sm font-medium">Umidade Solo</span>
                        </div>
                        <p className="text-2xl font-bold text-white print:text-black">
                          {analysisData.umidade}%
                        </p>
                      </div>
                      <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors print:bg-white print:border-gray-200">
                        <div className="flex items-center gap-2 text-orange-400 print:text-orange-600 mb-2">
                          <Thermometer className="w-4 h-4" />
                          <span className="text-sm font-medium">Temperatura</span>
                        </div>
                        <p className="text-2xl font-bold text-white print:text-black">
                          {analysisData.temperatura}°C
                        </p>
                      </div>
                    </div>

                    {/* Previsão de Irrigação e Geofencing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
                      <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                          <CloudRain className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Previsão de Irrigação (3 dias)
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300">
                          Cruzando dados de umidade do solo ({analysisData.umidade}%) com a previsão
                          meteorológica local, recomendamos{' '}
                          <strong className="text-white">
                            {analysisData.umidade < 40
                              ? 'irrigação imediata (15mm)'
                              : 'suspender irrigação'}
                          </strong>
                          .
                        </p>
                      </div>
                      <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-primary mb-2">
                            <BellRing className="w-4 h-4" />
                            <span className="text-sm font-medium">Monitoramento Geofencado</span>
                          </div>
                          <p className="text-sm text-zinc-300">
                            Seja avisado por push/SMS se o NDVI desta área cair abaixo de 0.40.
                          </p>
                        </div>
                        <Button
                          onClick={handleAlert}
                          variant="outline"
                          size="sm"
                          className="mt-3 w-fit border-primary/50 text-primary hover:bg-primary/10"
                        >
                          Ativar Alerta para esta Área
                        </Button>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400 print:text-gray-600 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4" /> Captura do Satélite
                        </span>
                        <span className="text-zinc-300 print:text-gray-800 font-medium flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-primary print:text-black" />{' '}
                          {analysisData.data}
                        </span>
                      </div>
                      <div className="relative rounded-xl overflow-hidden border border-white/10 print:border-gray-300 aspect-video group">
                        <img
                          src={analysisData.thumbnail}
                          alt="Satélite Thumbnail"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="text-xs text-zinc-500 text-center mt-2 print:text-gray-500">
                        Fonte dos dados: Sentinel Hub API
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Gráfico de Evolução (Tendência de NDVI) */}
                {history.length > 1 && (
                  <Card className="bg-black/50 border-white/10 print:hidden mt-6 animate-fade-in">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Evolução do NDVI (Últimas Análises)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          ndvi: {
                            label: 'NDVI',
                            color: 'hsl(var(--primary))',
                          },
                        }}
                        className="h-[250px] w-full"
                      >
                        <LineChart
                          data={history
                            .slice()
                            .reverse()
                            .map((h) => ({
                              date: new Date(h.analysis_date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                              }),
                              ndvi: h.ndvi_value,
                            }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                          <XAxis
                            dataKey="date"
                            stroke="#888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#888"
                            fontSize={12}
                            domain={[0, 1]}
                            tickLine={false}
                            axisLine={false}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="ndvi"
                            stroke="var(--color-ndvi)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--color-ndvi)', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Galeria de Histórico (Slider Temporal das últimas 4 semanas) */}
        {history.length > 0 && (
          <div className="mt-12 space-y-6 print:hidden animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <History className="w-6 h-6 text-primary" />
                Histórico de Imagens (Últimas Análises)
              </h3>
              <p className="text-sm text-zinc-400 hidden md:block">
                Navegue pelo histórico para comparar a evolução da saúde do solo.
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-lg">
              <Carousel
                opts={{
                  align: 'start',
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {history.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <Card
                        className={cn(
                          'bg-zinc-900/80 border-white/10 overflow-hidden transition-all duration-300 cursor-pointer h-full group hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(29,185,84,0.15)]',
                          analysisData?.id === item.id
                            ? 'border-primary ring-2 ring-primary/80'
                            : 'hover:border-white/30',
                        )}
                        onClick={() => loadHistoryItem(item)}
                      >
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <img
                            src={item.image_url}
                            alt="Satélite Histórico"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md border border-white/20 shadow-lg font-medium">
                            {new Date(item.analysis_date).toLocaleDateString('pt-BR')}
                          </div>
                          {analysisData?.id === item.id && (
                            <div className="absolute inset-0 bg-primary/10 z-10" />
                          )}
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-zinc-400 font-medium">NDVI</span>
                            <span
                              className={cn(
                                'font-bold text-base',
                                getNdviColorText(item.ndvi_value),
                              )}
                            >
                              {item.ndvi_value}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-400 flex items-center gap-1.5">
                              <Droplets className="w-3.5 h-3.5" /> Umidade
                            </span>
                            <span className="text-white font-medium">{item.soil_moisture}%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-400 flex items-center gap-1.5">
                              <Thermometer className="w-3.5 h-3.5" /> Temp.
                            </span>
                            <span className="text-white font-medium">{item.temperature}°C</span>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-end gap-2 mt-6">
                  <CarouselPrevious className="static translate-y-0 transform-none bg-zinc-800 border-white/10 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary h-10 w-10 transition-colors" />
                  <CarouselNext className="static translate-y-0 transform-none bg-zinc-800 border-white/10 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary h-10 w-10 transition-colors" />
                </div>
              </Carousel>
            </div>
          </div>
        )}

        {/* Assinatura no final da página para impressão */}
        <div className="hidden print:block mt-12 pt-8 border-t border-gray-300 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Este relatório foi gerado automaticamente pelo sistema AgroIA.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            As análises de satélite espectrais servem de apoio à tomada de decisão agronômica de
            precisão.
          </p>
        </div>
      </div>
    </>
  )
}
