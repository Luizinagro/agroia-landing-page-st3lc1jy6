import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { Users, CheckCircle, DollarSign, ListTodo, Loader2 } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

export function CrmReports() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    conversionRate: 0,
    estimatedRevenue: 0,
    activeTasks: 0,
  })
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const { data: leadsData } = await supabase
        .from('crm_leads' as any)
        .select('id, status, valor_estimado, created_at')
      const { data: tasksData } = await supabase.from('crm_tasks').select('id, status')

      const leads = leadsData || []
      const tasks = tasksData || []

      const totalLeads = leads.length
      const wonLeads = leads.filter(
        (l: any) => l.status === 'Fechado ganho' || l.status === 'Convertido',
      )
      const conversionRate = totalLeads > 0 ? (wonLeads.length / totalLeads) * 100 : 0
      const estimatedRevenue = wonLeads.reduce(
        (acc: number, l: any) => acc + (l.valor_estimado || 0),
        0,
      )
      const activeTasks = tasks.filter((t: any) => t.status === 'pendente').length

      setStats({ totalLeads, conversionRate, estimatedRevenue, activeTasks })

      const monthlyRevenue: Record<string, number> = {}
      wonLeads.forEach((l: any) => {
        const date = new Date(l.created_at || new Date())
        const month = date.toLocaleString('pt-BR', { month: 'short' })
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (l.valor_estimado || 0)
      })

      const chartData = Object.entries(monthlyRevenue).map(([mes, receita]) => ({
        mes,
        receita,
      }))

      if (chartData.length === 0) {
        const currentMonth = new Date().toLocaleString('pt-BR', { month: 'short' })
        chartData.push({ mes: currentMonth, receita: 0 })
      }

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
    receita: { label: 'Receita Ganha (R$)', color: '#1DB954' },
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#050505] border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Leads
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">Cadastrados no banco</p>
          </CardContent>
        </Card>

        <Card className="bg-[#050505] border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversão</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Leads em "Fechado ganho"</p>
          </CardContent>
        </Card>

        <Card className="bg-[#050505] border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Estimada
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(stats.estimatedRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Contratos ganhos</p>
          </CardContent>
        </Card>

        <Card className="bg-[#050505] border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atividades Ativas
            </CardTitle>
            <ListTodo className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">Tarefas não concluídas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#050505] border-primary/20">
        <CardHeader>
          <CardTitle className="text-white">Relatório de Receita (Fechado Ganho)</CardTitle>
        </CardHeader>
        <CardContent className="pl-0 pb-4">
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#1A1A1A" strokeDasharray="3 3" />
              <XAxis dataKey="mes" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `R$${val >= 1000 ? val / 1000 + 'k' : val}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="receita"
                fill="var(--color-receita)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
