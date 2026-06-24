import { useState } from 'react'
import { financeiroApi } from '@/services/gestao-financeira'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Loader2 } from 'lucide-react'

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#d946ef']

export default function CustoProducaoTab() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.target)
    try {
      const data = await financeiroApi.invoke('custo_producao', Object.fromEntries(fd))
      setResult(data)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  let chartData: any[] = []
  try {
    chartData =
      result && result.por_categoria
        ? Object.entries(result.por_categoria).map(([name, value], i) => ({
            name,
            value,
            fill: COLORS[i % COLORS.length],
          }))
        : []
  } catch (err) {
    console.error('Erro ao formatar dados do gráfico', err)
  }

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-zinc-950/50 border-zinc-800 lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Calcular Custos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Safra</label>
              <input
                name="safra"
                required
                placeholder="ex: 2025/2026"
                className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Cultura</label>
              <input
                name="cultura"
                required
                placeholder="ex: Soja"
                className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Área (hectares)</label>
              <input
                name="area_hectares"
                type="number"
                required
                className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Produtividade (sc/ha)</label>
              <input
                name="produtividade_sacas_ha"
                type="number"
                required
                className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
              />
            </div>
            <Button disabled={loading} className="w-full mt-4" type="submit">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Calcular
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-400">Custo Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  R$ {result.total_despesas.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-400">Custo por Hectare</p>
                <p className="text-2xl font-bold text-blue-500 mt-1">
                  R$ {result.custo_por_ha.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-400">Custo por Saca</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  R$ {result.custo_por_saca.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-400">Ponto de Equilíbrio</p>
                <p className="text-2xl font-bold text-orange-500 mt-1">
                  {result.ponto_equilibrio_sacas.toLocaleString('pt-BR')} sc/ha
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Distribuição de Custos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ChartContainer config={{}} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
