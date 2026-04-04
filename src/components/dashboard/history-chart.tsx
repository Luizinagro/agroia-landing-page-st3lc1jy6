import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Activity } from 'lucide-react'

const data = [
  { day: 'Seg', temp: 26, humidity: 60 },
  { day: 'Ter', temp: 27, humidity: 62 },
  { day: 'Qua', temp: 28, humidity: 65 },
  { day: 'Qui', temp: 25, humidity: 70 },
  { day: 'Sex', temp: 24, humidity: 75 },
  { day: 'Sáb', temp: 26, humidity: 68 },
  { day: 'Dom', temp: 28, humidity: 65 },
]

const chartConfig = {
  temp: {
    label: 'Temperatura (°C)',
    color: 'hsl(var(--secondary))',
  },
  humidity: {
    label: 'Umidade (%)',
    color: 'hsl(var(--primary))',
  },
}

export function HistoryChart() {
  return (
    <Card className="rounded-[2rem] border-primary/50 shadow-sm bg-black text-white">
      <CardHeader className="pb-4 border-b border-primary/20">
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-primary" />
          Histórico Climático (Últimos 7 dias)
        </CardTitle>
        <CardDescription className="text-gray-400">
          Acompanhe as tendências de temperatura e umidade para otimizar suas operações
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dx={-10}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dx={10}
                  domain={[50, 100]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent className="bg-background/95 border-primary/20 shadow-xl" />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} className="mt-4" />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  stroke="var(--color-temp)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  stroke="var(--color-humidity)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
