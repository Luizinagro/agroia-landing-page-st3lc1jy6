import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { Users, CheckCircle, DollarSign, Target, Loader2 } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export function CrmReports() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    conversionRate: 0,
    estimatedRevenue: 0,
    lostRevenue: 0,
  })
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const { data: leadsData } = await supabase
        .from('crm_leads')
        .select('id, status, valor_estimado, created_at')

      const leads = leadsData || []

      const totalLeads = leads.length
      const wonLeads = leads.filter(
        (l) => l.status === 'Fechado ganho' || l.status === 'Convertido',
      )
      const lostLeads = leads.filter((l) => l.status === 'Perdido')

      const conversionRate = totalLeads > 0 ? (wonLeads.length / totalLeads) * 100 : 0
      const estimatedRevenue = wonLeads.reduce((acc, l) => acc + (l.valor_estimado || 0), 0)
      const lostRevenue = lostLeads.reduce((acc, l) => acc + (l.valor_estimado || 0), 0)

      setStats({ totalLeads, conversionRate, estimatedRevenue, lostRevenue })

      const monthlyRevenue: Record<string, number> = {}

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        monthlyRevenue[d.toLocaleString('pt-BR', { month: 'short' })] = 0
      }

      wonLeads.forEach((l) => {
        const date = new Date(l.created_at || new Date())
        const month = date.toLocaleString('pt-BR', { month: 'short' })
        if (monthlyRevenue[month] !== undefined) {
          monthlyRevenue[month] += l.valor_estimado || 0
        }
      })

      const chartData = Object.entries(monthlyRevenue).map(([mes, receita]) => ({
        mes,
        receita,
      }))

      setRevenueData(chartData)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const chartConfig = {
    receita: { label: 'Receita (R$)', color: '#1DB954' },
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#050505] border-white/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Produtores (Leads)
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">No pipeline</p>
          </CardContent>
        </Card>

        <Card className="bg-[#050505] border-white/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Contratos fechados</p>
          </CardContent>
        </Card>

        <Card className="bg-[#050505] border-white/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Conquistada
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(stats.estimatedRevenue)}
            </div>
            <p className="text-xs text-primary/80 mt-1 font-medium">Contratos ganhos</p>
          </CardContent>
        </Card>

        <Card className="bg-[#050505] border-white/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Perdida
            </CardTitle>
            <Target className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(stats.lostRevenue)}
            </div>
            <p className="text-xs text-destructive/80 mt-1">Negociações perdidas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#050505] border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">Receita Histórica (Contratos Ganhos)</CardTitle>
          <CardDescription>
            Acompanhamento de fechamento de negócios nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-0 pb-4">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#1A1A1A" strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `R$${val >= 1000 ? val / 1000 + 'k' : val}`}
                />
                <ChartTooltip cursor={{ fill: '#1A1A1A' }} content={<ChartTooltipContent />} />
                <Bar
                  dataKey="receita"
                  fill="var(--color-receita)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
