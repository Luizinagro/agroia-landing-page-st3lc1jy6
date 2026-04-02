import { useState, useMemo } from 'react'
import { SEO } from '@/components/SEO'
import { ArrowLeft, TrendingUp, DollarSign, Clock, Percent, Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const chartConfig = {
  roi: {
    label: 'ROI (%)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export default function CalculadoraRoi() {
  const [insumos, setInsumos] = useState<number>(15000)
  const [maoDeObra, setMaoDeObra] = useState<number>(5000)
  const [operacao, setOperacao] = useState<number>(3000)
  const [receita, setReceita] = useState<number>(35000)
  const [meses, setMeses] = useState<number>(12)

  const { totalCustos, lucroLiquido, roi, payback, chartData } = useMemo(() => {
    const cust = (insumos || 0) + (maoDeObra || 0) + (operacao || 0)
    const rec = receita || 0
    const m = meses || 1

    const lucro = rec - cust
    const roiCalc = cust > 0 ? (lucro / cust) * 100 : 0
    const receitaMensal = rec / m
    const pb = receitaMensal > 0 ? cust / receitaMensal : 0

    const data = []
    for (let i = 0; i <= m; i++) {
      const saldo = -cust + receitaMensal * i
      data.push({
        mes: `Mês ${i}`,
        roi: cust > 0 ? Math.round((saldo / cust) * 100) : 0,
        saldo: saldo,
      })
    }

    return { totalCustos: cust, lucroLiquido: lucro, roi: roiCalc, payback: pb, chartData: data }
  }, [insumos, maoDeObra, operacao, receita, meses])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-in fade-in duration-500">
      <SEO
        title="Calculadora de ROI"
        description="Calcule o retorno sobre investimento da sua safra."
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3 mb-2">
            Projeção Financeira e ROI
          </h1>
          <p className="text-slate-500 text-lg max-w-3xl">
            Simule o retorno dos seus investimentos em insumos e operações com base na receita
            esperada e analise a evolução do seu lucro ao longo do tempo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Dados da Operação
                </CardTitle>
                <CardDescription>Insira os valores estimados para o cálculo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insumos">Custo de Insumos (R$)</Label>
                  <Input
                    id="insumos"
                    type="number"
                    min="0"
                    value={insumos || ''}
                    onChange={(e) => setInsumos(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ração, fertilizantes, sementes, etc.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maoDeObra">Mão de Obra (R$)</Label>
                  <Input
                    id="maoDeObra"
                    type="number"
                    min="0"
                    value={maoDeObra || ''}
                    onChange={(e) => setMaoDeObra(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operacao">Custo de Operação (R$)</Label>
                  <Input
                    id="operacao"
                    type="number"
                    min="0"
                    value={operacao || ''}
                    onChange={(e) => setOperacao(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Combustível, manutenção, energia.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receita">Receita Esperada (R$)</Label>
                  <Input
                    id="receita"
                    type="number"
                    min="0"
                    value={receita || ''}
                    onChange={(e) => setReceita(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Venda de produtos agropecuários.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meses">Período de Análise (meses)</Label>
                  <Input
                    id="meses"
                    type="number"
                    min="1"
                    max="120"
                    value={meses || ''}
                    onChange={(e) => setMeses(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-[#1a3c34] text-white border-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-[#f4d03f] mb-2">
                    <Percent className="w-5 h-5" />
                    <h3 className="font-medium">ROI Estimado</h3>
                  </div>
                  <p className="text-3xl font-bold">{roi.toFixed(1)}%</p>
                  <p className="text-sm text-white/80 mt-1">Retorno sobre investimento</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <h3 className="font-medium">Lucro Líquido</h3>
                  </div>
                  <p
                    className={`text-3xl font-bold ${lucroLiquido >= 0 ? 'text-slate-900' : 'text-red-600'}`}
                  >
                    {formatCurrency(lucroLiquido)}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Receita - Custos totais</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <h3 className="font-medium">Tempo de Retorno</h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">
                    {payback.toFixed(1)}{' '}
                    <span className="text-xl font-normal text-slate-500">
                      {payback === 1 ? 'mês' : 'meses'}
                    </span>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Para recuperar o investimento</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Evolução do ROI ao Longo do Tempo</CardTitle>
                <CardDescription>
                  Projeção percentual do retorno mês a mês (em {meses} meses)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
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
                      tickFormatter={(val) => `${val}%`}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tick={{ fill: '#64748b' }}
                      width={50}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="roi"
                      stroke="#1a3c34"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#1a3c34' }}
                      activeDot={{ r: 6, fill: '#f4d03f', stroke: '#1a3c34' }}
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
