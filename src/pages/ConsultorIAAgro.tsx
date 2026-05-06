import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  Send,
  History,
  MapPin,
  BrainCircuit,
  AlertCircle,
  Sprout,
  DollarSign,
  ChevronRight,
  Star,
  Download,
  BarChart3,
  MessageSquare,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const REGIONS = [
  'Paraná',
  'Mato Grosso',
  'São Paulo',
  'Goiás',
  'Minas Gerais',
  'Rio Grande do Sul',
  'Bahia',
  'Tocantins',
]

type Consulta = {
  id: string
  regiao: string
  pergunta: string
  is_favorite: boolean
  resposta: any // using any to safely handle corrupted json
  created_at: string
}

export default function ConsultorIAAgro() {
  const { user } = useAuth()
  const [region, setRegion] = useState<string>('')
  const [question, setQuestion] = useState('')
  const [status, setStatus] = useState<'empty' | 'loading' | 'success' | 'error'>('empty')
  const [errorMsg, setErrorMsg] = useState('')
  const [currentResponse, setCurrentResponse] = useState<Consulta | null>(null)
  const [history, setHistory] = useState<Consulta[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    if (!user?.id) return
    const { data } = await supabase
      .from('consultas_ia' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (data) {
      setHistory(data as Consulta[])
    }
  }

  const handleAsk = async () => {
    if (!region || !question.trim()) return

    setStatus('loading')
    try {
      const response = await supabase.functions.invoke('consultor-ia-agro', {
        body: { regiao: region, pergunta: question },
      })

      if (response.error || !response.data?.success) {
        throw new Error(
          response.error?.message ||
            response.data?.error ||
            'Erro ao processar consulta. Tente novamente.',
        )
      }

      setCurrentResponse(response.data.data)
      setStatus('success')
      setQuestion('')
      loadHistory()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  const toggleFavorite = async (e: React.MouseEvent, id: string, currentFav: boolean) => {
    e.stopPropagation()
    const { error } = await supabase
      .from('consultas_ia' as any)
      .update({ is_favorite: !currentFav })
      .eq('id', id)

    if (!error) {
      setHistory((prev) => prev.map((h) => (h.id === id ? { ...h, is_favorite: !currentFav } : h)))
      if (currentResponse?.id === id) {
        setCurrentResponse({ ...currentResponse, is_favorite: !currentFav })
      }
    }
  }

  // Safe extraction helpers for malformed Gemini JSON
  const getRecomendacao = (resposta: any) => {
    if (!resposta) return 'Sem recomendação disponível'
    if (typeof resposta === 'string') return resposta
    return resposta.recomendacoes || 'Sem recomendação disponível'
  }

  const getRegiao = (resposta: any, fallback: string) => {
    if (!resposta) return fallback
    if (typeof resposta === 'string') return fallback
    return resposta.regiao_considerada || fallback
  }

  const getPrecos = (resposta: any) => {
    if (!resposta) return []
    if (typeof resposta === 'string') return []
    return Array.isArray(resposta.precos_regionais) ? resposta.precos_regionais : []
  }

  const handleExport = () => {
    const headers = ['Data', 'Região', 'Pergunta', 'Favorito', 'Recomendações']
    const rows = history.map((item) => [
      new Date(item.created_at).toLocaleDateString('pt-BR'),
      item.regiao,
      `"${item.pergunta.replace(/"/g, '""')}"`,
      item.is_favorite ? 'Sim' : 'Não',
      `"${getRecomendacao(item.resposta).replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'historico_consultas_agroia.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const chartData = useMemo(() => {
    const regionCounts = history.reduce(
      (acc, curr) => {
        acc[curr.regiao] = (acc[curr.regiao] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(regionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [history])

  const chartConfig = {
    count: {
      label: 'Consultas',
      color: 'hsl(var(--primary))',
    },
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#1a3c34] rounded-lg">
            <BrainCircuit className="w-6 h-6 text-[#f4d03f]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a3c34]">Consultor IA Agro</h1>
            <p className="text-sm md:text-base text-slate-600">
              Assistente virtual com dados regionais em tempo real
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          className="shrink-0 flex items-center gap-2 border-slate-300"
        >
          <Download className="w-4 h-4" />
          Exportar Histórico
        </Button>
      </div>

      <Tabs defaultValue="consultar" className="space-y-6">
        <TabsList className="bg-[#1a3c34]/5 border border-[#1a3c34]/10 p-1 flex-wrap h-auto justify-start">
          <TabsTrigger
            value="consultar"
            className="data-[state=active]:bg-[#1a3c34] data-[state=active]:text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Consultar
          </TabsTrigger>
          <TabsTrigger
            value="favoritos"
            className="data-[state=active]:bg-[#1a3c34] data-[state=active]:text-white"
          >
            <Star className="w-4 h-4 mr-2" /> Favoritos
          </TabsTrigger>
          <TabsTrigger
            value="tendencias"
            className="data-[state=active]:bg-[#1a3c34] data-[state=active]:text-white"
          >
            <BarChart3 className="w-4 h-4 mr-2" /> Tendências
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consultar" className="m-0 focus-visible:ring-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-[#1a3c34]/20 shadow-md">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#1a3c34]" />
                    Nova Consulta
                  </CardTitle>
                  <CardDescription>
                    Selecione sua região para obtermos cotações e clima precisos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-1/3 shrink-0">
                      <Select
                        value={region}
                        onValueChange={setRegion}
                        disabled={status === 'loading'}
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Sua Região" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Ex: Qual é o melhor momento para plantar soja?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                        disabled={status === 'loading'}
                        className="border-slate-300 focus-visible:ring-[#1a3c34]"
                      />
                      <Button
                        onClick={handleAsk}
                        disabled={!region || !question.trim() || status === 'loading'}
                        className="bg-[#1a3c34] hover:bg-[#2a5c54] text-white shrink-0"
                      >
                        <Send className="w-4 h-4 md:mr-2" />
                        <span className="hidden md:inline">Enviar</span>
                      </Button>
                    </div>
                  </div>

                  {/* Status Areas */}
                  <div className="mt-6 min-h-[250px] flex flex-col justify-center items-center rounded-xl bg-slate-50/50 border border-slate-100 p-4 md:p-6">
                    {status === 'empty' && (
                      <div className="text-center text-slate-400 space-y-3 animate-in fade-in">
                        <Sprout className="w-12 h-12 mx-auto text-slate-300" />
                        <p className="font-medium text-lg">
                          Selecione sua região e faça uma pergunta
                        </p>
                      </div>
                    )}

                    {status === 'loading' && (
                      <Loader2 className="w-10 h-10 animate-spin text-[#1a3c34]" />
                    )}

                    {status === 'error' && (
                      <div className="w-full max-w-md animate-in fade-in">
                        <Alert
                          variant="destructive"
                          className="bg-red-50 text-red-900 border-red-200"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Erro na Consulta</AlertTitle>
                          <AlertDescription className="mt-2 flex flex-col gap-3">
                            <p>{errorMsg}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAsk}
                              className="w-fit border-red-200 text-red-700 hover:bg-red-100 bg-white"
                            >
                              Tentar Novamente
                            </Button>
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {status === 'success' && currentResponse && (
                      <div className="w-full animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-xl border border-[#1a3c34]/20 shadow-sm overflow-hidden">
                          <div className="bg-[#1a3c34] px-4 py-3 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#f4d03f] font-semibold">
                              <BrainCircuit className="w-5 h-5" />
                              Consultor IA
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-xs font-medium text-[#1a3c34] bg-[#f4d03f] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                <MapPin className="w-3.5 h-3.5" />
                                {getRegiao(currentResponse.resposta, currentResponse.regiao)}
                              </div>
                              <button
                                onClick={(e) =>
                                  toggleFavorite(e, currentResponse.id, currentResponse.is_favorite)
                                }
                                className="text-[#f4d03f] hover:opacity-80 transition-opacity"
                              >
                                <Star
                                  className={cn(
                                    'w-5 h-5',
                                    currentResponse.is_favorite ? 'fill-current' : '',
                                  )}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="p-4 md:p-6 space-y-6">
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                                <Sprout className="w-4 h-4" /> Recomendação
                              </h4>
                              <p className="text-slate-800 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                                {getRecomendacao(currentResponse.resposta)}
                              </p>
                            </div>

                            {getPrecos(currentResponse.resposta).length > 0 && (
                              <div className="bg-[#1a3c34]/5 rounded-lg p-4 border border-[#1a3c34]/10">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#1a3c34] mb-3 flex items-center gap-2">
                                  <DollarSign className="w-4 h-4" /> Preços Regionais (Referência)
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {getPrecos(currentResponse.resposta).map(
                                    (preco: any, idx: number) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold bg-white text-[#1a3c34] border border-[#1a3c34]/20 shadow-sm"
                                      >
                                        {preco}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="h-full border-slate-200">
                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                    <History className="w-5 h-5" />
                    Seu Histórico
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] lg:h-[500px] w-full">
                    {history.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-500">
                        Nenhuma consulta realizada ainda.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {history.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentResponse(item)
                              setRegion(item.regiao)
                              setStatus('success')
                            }}
                            className={cn(
                              'w-full text-left p-4 hover:bg-slate-50 transition-colors group relative',
                              currentResponse?.id === item.id ? 'bg-[#1a3c34]/5' : '',
                            )}
                          >
                            <div className="flex justify-between items-start mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#1a3c34] bg-[#f4d03f]/50 border border-[#f4d03f] px-2 py-0.5 rounded flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {item.regiao}
                                </span>
                                <div
                                  onClick={(e) => toggleFavorite(e, item.id, item.is_favorite)}
                                  className="p-1 z-10 cursor-pointer"
                                >
                                  <Star
                                    className={cn(
                                      'w-4 h-4 transition-colors',
                                      item.is_favorite
                                        ? 'fill-[#f4d03f] text-[#f4d03f]'
                                        : 'text-slate-300 hover:text-[#f4d03f]',
                                    )}
                                  />
                                </div>
                              </div>
                              <span className="text-xs text-slate-400 font-medium">
                                {new Date(item.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-slate-700 line-clamp-2 mt-2 leading-snug pr-2">
                              "{item.pergunta}"
                            </p>
                            <div className="mt-3 flex items-center text-xs font-bold text-[#1a3c34] opacity-0 group-hover:opacity-100 transition-opacity">
                              Ver resposta completa <ChevronRight className="w-3 h-3 ml-0.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="favoritos" className="m-0 focus-visible:ring-0">
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                <Star className="w-5 h-5 text-[#f4d03f]" />
                Consultas Favoritas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {history.filter((h) => h.is_favorite).length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  Nenhuma consulta marcada como favorita ainda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history
                    .filter((h) => h.is_favorite)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-[#1a3c34] bg-[#f4d03f]/50 border border-[#f4d03f] px-2 py-0.5 rounded flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {item.regiao}
                            </span>
                            <button
                              onClick={(e) => toggleFavorite(e, item.id, true)}
                              className="text-[#f4d03f] p-1"
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          <p className="font-medium text-sm text-slate-800">"{item.pergunta}"</p>
                          <p className="text-sm text-slate-600 line-clamp-3">
                            {getRecomendacao(item.resposta)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-4 text-[#1a3c34] text-xs font-bold hover:bg-[#1a3c34]/5"
                          onClick={() => {
                            setCurrentResponse(item)
                            setRegion(item.regiao)
                            setStatus('success')
                          }}
                        >
                          Carregar no Painel Principal
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendencias" className="m-0 focus-visible:ring-0">
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                <BarChart3 className="w-5 h-5" />
                Regiões Mais Pesquisadas
              </CardTitle>
              <CardDescription>
                Gráfico comparativo das regiões nas suas consultas recentes.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {chartData.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  Nenhum dado suficiente para exibir tendências.
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                      fontSize={12}
                    />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#1a3c34" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
