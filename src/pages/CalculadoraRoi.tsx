import { useState, useMemo, useEffect } from 'react'
import { SEO } from '@/components/SEO'
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Clock,
  Percent,
  Calculator,
  Save,
  Loader2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

const chartConfig = {
  saldo: {
    label: 'Lucro Projetado (R$)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export default function CalculadoraRoi() {
  const [custoTotal, setCustoTotal] = useState<number>(20000)
  const [receitaEsperada, setReceitaEsperada] = useState<number>(35000)
  const [tempoRetorno, setTempoRetorno] = useState<number>(12)
  const [isSaving, setIsSaving] = useState(false)

  // Novos estados para a integração com CEPEA
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [cultura, setCultura] = useState<string>('Outro')
  const [quantidadeToneladas, setQuantidadeToneladas] = useState<number>(0)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('cepea-prices')
        if (data?.prices) {
          setPrices(data.prices)
        }
      } catch (error) {
        console.error('Erro ao buscar preços:', error)
      }
    }
    fetchPrices()
  }, [])

  useEffect(() => {
    if (cultura !== 'Outro' && prices[cultura] && quantidadeToneladas > 0) {
      setReceitaEsperada(prices[cultura] * quantidadeToneladas)
    }
  }, [cultura, quantidadeToneladas, prices])

  const { lucroLiquido, margemLucro, roi, payback, chartData } = useMemo(() => {
    const custo = custoTotal || 0
    const receita = receitaEsperada || 0
    const meses = tempoRetorno || 1

    const lucro = receita - custo
    const margem = receita > 0 ? (lucro / receita) * 100 : 0
    const roiCalc = custo > 0 ? (lucro / custo) * 100 : 0

    const receitaMensal = receita / meses
    const pb = receitaMensal > 0 ? custo / receitaMensal : 0

    const data = []
    for (let i = 0; i <= meses; i++) {
      const saldo = -custo + receitaMensal * i
      data.push({
        mes: `Mês ${i}`,
        saldo: Math.round(saldo),
      })
    }

    return { lucroLiquido: lucro, margemLucro: margem, roi: roiCalc, payback: pb, chartData: data }
  }, [custoTotal, receitaEsperada, tempoRetorno])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession()

      if (authError || !session?.user) {
        toast({
          title: 'Não autenticado',
          description: 'Você precisa estar logado para salvar o cálculo.',
          variant: 'destructive',
        })
        setIsSaving(false)
        return
      }

      const { error } = await supabase.from('calculos_roi' as any).insert({
        user_id: session.user.id,
        custo_producao: custoTotal,
        receita_esperada: receitaEsperada,
        tempo_retorno: tempoRetorno,
        lucro_liquido: lucroLiquido,
        margem_lucro: margemLucro,
        roi_percentual: roi,
        payback_meses: payback,
      })

      if (error) throw error

      toast({
        title: 'Cálculo Salvo',
        description: 'Seu cálculo de ROI foi armazenado no banco de dados com sucesso!',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Ocorreu um erro ao salvar seu cálculo.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isProfit = lucroLiquido >= 0

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-in fade-in duration-500">
      <SEO
        title="Calculadora de ROI"
        description="Calcule o retorno sobre investimento da sua safra com base em preços reais."
      />

      <header className="sticky top-0 z-50 w-full bg-[#1a3c34]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a3c34]/80 border-b border-white/10 shadow-sm">
        <div className="container flex h-16 items-center px-4 md:px-6 mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <TrendingUp className="w-6 h-6 text-[#f4d03f]" />
            <span>Calculadora de ROI</span>
          </div>
          <nav className="ml-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:bg-white/10 hover:text-[#f4d03f]"
            >
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-6 py-8 mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3 mb-2">
              Projeção Financeira e ROI
            </h1>
            <p className="text-slate-500 text-lg max-w-3xl">
              Simule o retorno dos seus investimentos utilizando estimativas próprias ou cotações de
              mercado (CEPEA) para soja, milho e trigo.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#1a3c34] hover:bg-[#1a3c34]/90 text-white"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Cálculo
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Dados da Operação
                </CardTitle>
                <CardDescription>Insira os valores ou use as cotações atuais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cultura">Cultura Agrícola</Label>
                  <Select value={cultura} onValueChange={setCultura}>
                    <SelectTrigger id="cultura">
                      <SelectValue placeholder="Selecione a cultura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Outro">Outro / Digitar Manualmente</SelectItem>
                      <SelectItem value="Soja">Soja</SelectItem>
                      <SelectItem value="Milho">Milho</SelectItem>
                      <SelectItem value="Trigo">Trigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {cultura !== 'Outro' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="quantidade">Quantidade de Produção (Toneladas)</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      min="0"
                      value={quantidadeToneladas || ''}
                      onChange={(e) => setQuantidadeToneladas(Number(e.target.value))}
                    />
                    {prices[cultura] && (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-blue-500" />
                        Preço base (CEPEA): {formatCurrency(prices[cultura])} / ton
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <Label htmlFor="custoTotal">Custo Total da Produção (R$)</Label>
                  <Input
                    id="custoTotal"
                    type="number"
                    min="0"
                    value={custoTotal || ''}
                    onChange={(e) => setCustoTotal(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receitaEsperada">
                    Receita Esperada (R$){' '}
                    {cultura !== 'Outro' && quantidadeToneladas > 0 && (
                      <span className="text-xs text-blue-600 font-normal ml-1">
                        (Auto-calculado)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="receitaEsperada"
                    type="number"
                    min="0"
                    value={receitaEsperada || ''}
                    onChange={(e) => setReceitaEsperada(Number(e.target.value))}
                    className={
                      cultura !== 'Outro' && quantidadeToneladas > 0
                        ? 'border-blue-200 bg-blue-50/30'
                        : ''
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempoRetorno">Tempo de Retorno (meses)</Label>
                  <Input
                    id="tempoRetorno"
                    type="number"
                    min="1"
                    max="120"
                    value={tempoRetorno || ''}
                    onChange={(e) => setTempoRetorno(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                className={cn(
                  'border-2 transition-colors duration-300',
                  isProfit ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50',
                )}
              >
                <CardContent className="p-4 md:p-6">
                  <div
                    className={cn(
                      'flex items-center gap-2 mb-2',
                      isProfit ? 'text-green-700' : 'text-red-700',
                    )}
                  >
                    <DollarSign className="w-5 h-5" />
                    <h3 className="font-medium">Lucro Líquido</h3>
                  </div>
                  <p
                    className={cn(
                      'text-2xl md:text-3xl font-bold',
                      isProfit ? 'text-green-700' : 'text-red-700',
                    )}
                  >
                    {formatCurrency(lucroLiquido)}
                  </p>
                </CardContent>
              </Card>

              <Card
                className={cn(
                  'border-2 transition-colors duration-300',
                  isProfit ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50',
                )}
              >
                <CardContent className="p-4 md:p-6">
                  <div
                    className={cn(
                      'flex items-center gap-2 mb-2',
                      isProfit ? 'text-green-700' : 'text-red-700',
                    )}
                  >
                    <Percent className="w-5 h-5" />
                    <h3 className="font-medium">Margem de Lucro</h3>
                  </div>
                  <p
                    className={cn(
                      'text-2xl md:text-3xl font-bold',
                      isProfit ? 'text-green-700' : 'text-red-700',
                    )}
                  >
                    {margemLucro.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card
                className={cn(
                  'border-2 transition-colors duration-300',
                  isProfit ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50',
                )}
              >
                <CardContent className="p-4 md:p-6">
                  <div
                    className={cn(
                      'flex items-center gap-2 mb-2',
                      isProfit ? 'text-green-700' : 'text-red-700',
                    )}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="font-medium">ROI</h3>
                  </div>
                  <p
                    className={cn(
                      'text-2xl md:text-3xl font-bold',
                      isProfit ? 'text-green-700' : 'text-red-700',
                    )}
                  >
                    {roi.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <h3 className="font-medium">Tempo Payback</h3>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900">
                    {payback.toFixed(1)}{' '}
                    <span className="text-lg font-normal text-slate-500">
                      {payback === 1 ? 'mês' : 'meses'}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Projeção de Lucro ao Longo do Tempo</CardTitle>
                <CardDescription>
                  Evolução do saldo acumulado ao longo de {tempoRetorno} meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="mes"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      fontSize={12}
                      tick={{ fill: '#64748b' }}
                    />
                    <YAxis
                      tickFormatter={(val) =>
                        `R$ ${val >= 1000 || val <= -1000 ? (val / 1000).toFixed(0) + 'k' : val}`
                      }
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tick={{ fill: '#64748b' }}
                      width={60}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="saldo"
                      stroke={isProfit ? '#22c55e' : '#ef4444'}
                      strokeWidth={3}
                      dot={{ r: 4, fill: isProfit ? '#22c55e' : '#ef4444' }}
                      activeDot={{
                        r: 6,
                        fill: '#f4d03f',
                        stroke: isProfit ? '#22c55e' : '#ef4444',
                      }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
