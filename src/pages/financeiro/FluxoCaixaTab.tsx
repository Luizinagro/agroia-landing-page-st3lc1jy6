import { useEffect, useState } from 'react'
import { financeiroApi } from '@/services/gestao-financeira'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Loader2 } from 'lucide-react'

export default function FluxoCaixaTab({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    financeiroApi
      .invoke('fluxo_caixa')
      .then((d) => {
        const chartData = d.meses.map((m: any, i: number) => ({
          ...m,
          saldo_acumulado: d.saldo_acumulado[i],
        }))
        setData(chartData)
      })
      .finally(() => setLoading(false))
  }, [refreshKey])

  const config = {
    receitas: { label: 'Receitas', color: 'hsl(var(--primary))' },
    despesas: { label: 'Despesas', color: 'hsl(var(--destructive))' },
    saldo_acumulado: { label: 'Saldo Acumulado', color: 'hsl(var(--chart-3))' },
  }

  if (loading)
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    )

  return (
    <div className="mt-6 border border-zinc-800 rounded-xl p-6 bg-zinc-950/50">
      <h3 className="text-lg font-semibold text-white mb-6">Fluxo de Caixa Anual</h3>
      <div className="h-[400px] w-full">
        <ChartContainer config={config} className="h-full w-full">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="nome_mes"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `R$ ${val}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `R$ ${val}`}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="receitas"
              fill="var(--color-receitas)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
            <Bar
              yAxisId="left"
              dataKey="despesas"
              fill="var(--color-despesas)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="saldo_acumulado"
              stroke="var(--color-saldo_acumulado)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--color-saldo_acumulado)' }}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </div>
  )
}
