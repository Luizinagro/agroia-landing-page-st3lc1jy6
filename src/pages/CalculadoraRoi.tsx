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
    <div className="min-h-screen bg-[#000000] flex flex-col font-sans">
      <SEO
        title="Calculadora de ROI"
        description="Planejamento financeiro estratégico. Simule cenários, calcule margens de lucro e descubra o tempo de retorno do seu investimento."
      />

      <main className="flex-1 container py-8 mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 bg-[#050505] p-6 rounded-2xl border border-[#1DB954]/20">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF] flex items-center gap-3">
              <Logo className="w-8 h-8 text-[#1DB954]" />
              Calculadora de ROI
            </h1>
            <p className="text-[#E0E0E0] mt-2 text-lg font-medium">
              Planejamento financeiro estratégico. Simule cenários, calcule margens de lucro e
              descubra o tempo de retorno do seu investimento.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-agro-primary font-bold whitespace-nowrap"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Cálculo
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-[#050505] border-[#1DB954]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#FFFFFF] font-bold">
                  <Calculator className="w-5 h-5 text-[#1DB954]" />
                  Dados da Operação
                </CardTitle>
                <CardDescription className="text-[#E0E0E0] font-medium">
                  Insira os valores ou use as cotações atuais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cultura" className="text-[#FFFFFF] font-semibold">
                    Cultura Agrícola
                  </Label>
                  <Select value={cultura} onValueChange={setCultura}>
                    <SelectTrigger
                      id="cultura"
                      className="bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus:ring-[#1DB954]"
                    >
                      <SelectValue placeholder="Selecione a cultura" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050505] border-[#1DB954]/20 text-[#FFFFFF]">
                      <SelectItem value="Outro">Outro / Digitar Manualmente</SelectItem>
                      <SelectItem value="Soja">Soja</SelectItem>
                      <SelectItem value="Milho">Milho</SelectItem>
                      <SelectItem value="Trigo">Trigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {cultura !== 'Outro' && (
                  <div className="space-y-2">
                    <Label htmlFor="quantidade" className="text-[#FFFFFF] font-semibold">
                      Quantidade de Produção (Toneladas)
                    </Label>
                    <Input
                      id="quantidade"
                      type="number"
                      min="0"
                      value={quantidadeToneladas || ''}
                      onChange={(e) => setQuantidadeToneladas(Number(e.target.value))}
                      className="bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus-visible:ring-[#1DB954]"
                    />
                    {prices[cultura] && (
                      <p className="text-xs text-[#E0E0E0] mt-1 flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3 h-3 text-[#1DB954]" />
                        Preço base (CEPEA): {formatCurrency(prices[cultura])} / ton
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-[#1DB954]/20">
                  <Label htmlFor="custoTotal" className="text-[#FFFFFF] font-semibold">
                    Custo Total da Produção (R$)
                  </Label>
                  <Input
                    id="custoTotal"
                    type="number"
                    min="0"
                    value={custoTotal || ''}
                    onChange={(e) => setCustoTotal(Number(e.target.value))}
                    className="bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus-visible:ring-[#1DB954]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receitaEsperada" className="text-[#FFFFFF] font-semibold">
                    Receita Esperada (R$){' '}
                    {cultura !== 'Outro' && quantidadeToneladas > 0 && (
                      <span className="text-xs text-[#1DB954] font-medium ml-1">
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
                    className={cn(
                      'bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus-visible:ring-[#1DB954]',
                      cultura !== 'Outro' && quantidadeToneladas > 0
                        ? 'border-[#1DB954]/50 bg-[#1DB954]/5'
                        : '',
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempoRetorno" className="text-[#FFFFFF] font-semibold">
                    Tempo de Retorno (meses)
                  </Label>
                  <Input
                    id="tempoRetorno"
                    type="number"
                    min="1"
                    max="120"
                    value={tempoRetorno || ''}
                    onChange={(e) => setTempoRetorno(Number(e.target.value))}
                    className="bg-[#000000] border-[#1DB954]/20 text-[#FFFFFF] focus-visible:ring-[#1DB954]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                className={cn(
                  'border transition-colors duration-300',
                  isProfit
                    ? 'border-[#1DB954]/50 bg-[#1DB954]/5'
                    : 'border-red-500/50 bg-red-500/5',
                )}
              >
                <CardContent className="p-4 md:p-6">
                  <div
                    className={cn(
                      'flex items-center gap-2 mb-2',
                      isProfit ? 'text-[#1DB954]' : 'text-red-500',
                    )}
                  >
                    <DollarSign className="w-5 h-5" />
                    <h3 className="font-bold">Lucro Líquido</h3>
                  </div>
                  <p
                    className={cn(
                      'text-2xl md:text-3xl font-bold',
                      isProfit ? 'text-[#1DB954]' : 'text-red-500',
                    )}
                  >
                    {formatCurrency(lucroLiquido)}
                  </p>
                </CardContent>
              </Card>

              <Card
                className={cn(
                  'border transition-colors duration-300',
                  isProfit
                    ? 'border-[#1DB954]/50 bg-[#1DB954]/5'
                    : 'border-red-500/50 bg-red-500/5',
                )}
              >
                <CardContent className="p-4 md:p-6">
                  <div
                    className={cn(
                      'flex items-center gap-2 mb-2',
                      isProfit ? 'text-[#1DB954]' : 'text-red-500',
                    )}
                  >
                    <Percent className="w-5 h-5" />
                    <h3 className="font-bold">Margem de Lucro</h3>
                  </div>
                  <p
                    className={cn(
                      'text-2xl md:text-3xl font-bold',
                      isProfit ? 'text-[#1DB954]' : 'text-red-500',
                    )}
                  >
                    {margemLucro.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card
                className={cn(
                  'border transition-colors duration-300',
                  isProfit
                    ? 'border-[#1DB954]/50 bg-[#1DB954]/5'
                    : 'border-red-500/50 bg-red-500/5',
                )}
              >
                <CardContent className="p-4 md:p-6">
                  <div
                    className={cn(
                      'flex items-center gap-2 mb-2',
                      isProfit ? 'text-[#1DB954]' : 'text-red-500',
                    )}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="font-bold">ROI</h3>
                  </div>
                  <p
                    className={cn(
                      'text-2xl md:text-3xl font-bold',
                      isProfit ? 'text-[#1DB954]' : 'text-red-500',
                    )}
                  >
                    {roi.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#050505] border-[#1DB954]/20">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-2 text-[#E0E0E0] mb-2">
                    <Clock className="w-5 h-5" />
                    <h3 className="font-bold">Tempo Payback</h3>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">
                    {payback.toFixed(1)}{' '}
                    <span className="text-lg font-medium text-[#E0E0E0]">
                      {payback === 1 ? 'mês' : 'meses'}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#050505] border-[#1DB954]/20">
              <CardHeader>
                <CardTitle className="text-[#FFFFFF] font-bold">
                  Projeção de Lucro ao Longo do Tempo
                </CardTitle>
                <CardDescription className="text-[#E0E0E0] font-medium">
                  Evolução do saldo acumulado ao longo de {tempoRetorno} meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1DB95420" />
                    <XAxis
                      dataKey="mes"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      fontSize={12}
                      tick={{ fill: '#E0E0E0' }}
                    />
                    <YAxis
                      tickFormatter={(val) =>
                        `R$ ${val >= 1000 || val <= -1000 ? (val / 1000).toFixed(0) + 'k' : val}`
                      }
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tick={{ fill: '#E0E0E0' }}
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
