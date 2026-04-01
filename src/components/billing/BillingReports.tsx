import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TrendingUp, DollarSign, Receipt } from 'lucide-react'

const mockChartData = [
  { month: 'Mai', revenue: 35000 },
  { month: 'Jun', revenue: 42000 },
  { month: 'Jul', revenue: 38000 },
  { month: 'Ago', revenue: 55000 },
  { month: 'Set', revenue: 48000 },
  { month: 'Out', revenue: 62000 },
]

export function BillingReports() {
  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

  return (
    <div className="space-y-6 animate-in fade-in-up duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Receita Total</CardTitle>
            <DollarSign className="w-4 h-4 text-agro-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(280000)}</div>
            <p className="text-xs text-white/50 mt-1">+12% em relação ao semestre anterior</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Impostos Pagos</CardTitle>
            <Receipt className="w-4 h-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(42000)}</div>
            <p className="text-xs text-white/50 mt-1">Aproximadamente 15% da receita</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Lucro Líquido</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{formatBRL(238000)}</div>
            <p className="text-xs text-white/50 mt-1">Margem saudável de 85%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Evolução de Receita (Últimos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ revenue: { label: 'Receita', color: '#f4d03f' } }}
            className="h-[300px] w-full mt-4"
          >
            <LineChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.4)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                dy={10}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(val) => `R$${val / 1000}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="bg-agro-green border-white/10 text-white" />
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--color-revenue)', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
