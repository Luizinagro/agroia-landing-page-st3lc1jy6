import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { TrendingUp } from 'lucide-react'

const chartConfig = {
  meat: { label: 'Carne (Boi Gordo)', color: 'hsl(var(--chart-1))' },
  milk: { label: 'Leite', color: 'hsl(var(--chart-2))' },
}

const cepeaData = [
  { month: 'Out', meat: 230, milk: 2.1 },
  { month: 'Nov', meat: 235, milk: 2.15 },
  { month: 'Dez', meat: 240, milk: 2.2 },
  { month: 'Jan', meat: 238, milk: 2.25 },
  { month: 'Fev', meat: 245, milk: 2.3 },
  { month: 'Mar', meat: 255, milk: 2.35 },
]

export function MercadoCepea() {
  return (
    <Card className="border-agro-green/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="text-agro-green">Mercado CEPEA</CardTitle>
        <CardDescription>
          Acompanhe a evolução de preços da arroba do boi e litro do leite.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 bg-white p-4 rounded-xl shadow-subtle border border-border flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Boi Gordo (Arroba)</p>
              <p className="text-2xl font-bold text-agro-green">R$ 255,00</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" /> +3.5%
            </Badge>
          </div>
          <div className="flex-1 bg-white p-4 rounded-xl shadow-subtle border border-border flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Leite (Litro)</p>
              <p className="text-2xl font-bold text-agro-green">R$ 2,35</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" /> +1.2%
            </Badge>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={cepeaData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="meat"
              name="Carne (Boi Gordo)"
              stroke="var(--color-meat)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="milk"
              name="Leite"
              stroke="var(--color-milk)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
