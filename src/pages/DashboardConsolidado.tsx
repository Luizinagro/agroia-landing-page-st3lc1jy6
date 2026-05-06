import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Map, Sprout, Tractor, DollarSign, BellRing, TrendingUp, Loader2 } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import { cn } from '@/lib/utils'

function GradientCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl p-[1px] bg-gradient-to-r from-green-500/40 to-blue-500/40 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300',
        className,
      )}
    >
      <div className="bg-zinc-950/90 backdrop-blur-xl rounded-[11px] p-6 h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}

export default function DashboardConsolidado() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState({
    propriedades: 0,
    safras: 0,
    rebanho: 0,
    roi: 0,
    alertas: 0,
    custoTotal: 0,
  })
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([])
  const [barData, setBarData] = useState<{ name: string; valor: number }[]>([])
  const [benchmarkingData, setBenchmarkingData] = useState<any[]>([])

  const lineData = useMemo(
    () => [
      { mes: 'Jan', producao: 120 },
      { mes: 'Fev', producao: 150 },
      { mes: 'Mar', producao: 180 },
      { mes: 'Abr', producao: 220 },
      { mes: 'Mai', producao: 260 },
      { mes: 'Jun', producao: 310 },
    ],
    [],
  )

  const pieColors = ['#22c55e', '#3b82f6', '#14b8a6', '#f59e0b', '#6366f1', '#ec4899']

  const fetchData = async () => {
    if (!user) return
    try {
      const [
        { count: propCount },
        { count: safraCount },
        { data: rebanho },
        { data: rois },
        { count: alertsCount },
        { data: props },
        { data: estoqueData },
        { data: benchData },
      ] = await Promise.all([
        supabase
          .from('propriedades')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('propriedades')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('cultura_principal', 'is', null),
        supabase.from('rebanho').select('quantidade').eq('user_id', user.id),
        supabase.from('calculos_roi').select('lucro_liquido, cultura').eq('user_id', user.id),
        supabase
          .from('system_alerts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .is('data_leitura', null),
        supabase.from('propriedades').select('cultura_principal').eq('user_id', user.id),
        supabase
          .from('user_estoque' as any)
          .select('custo_total')
          .eq('user_id', user.id),
        supabase
          .from('safras_benchmarking' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('ano', { ascending: true }),
      ])

      const totalRebanho =
        rebanho?.reduce((acc, curr) => acc + (Number(curr.quantidade) || 0), 0) || 0
      const totalRoi = rois?.reduce((acc, curr) => acc + (Number(curr.lucro_liquido) || 0), 0) || 0
      const custoTotal =
        estoqueData?.reduce((acc, curr) => acc + (Number(curr.custo_total) || 0), 0) || 0

      setBenchmarkingData(
        benchData && benchData.length > 0
          ? benchData
          : [
              { ano: '2023', sacas_por_ha: 58, custo_por_ha: 3200 },
              { ano: '2024', sacas_por_ha: 65, custo_por_ha: 3050 },
              { ano: '2025', sacas_por_ha: 70, custo_por_ha: 2900 },
            ],
      )

      setKpis({
        propriedades: propCount || 0,
        safras: safraCount || 0,
        rebanho: totalRebanho,
        roi: totalRoi,
        alertas: alertsCount || 0,
        custoTotal,
      })

      const culturaCounts = props?.reduce(
        (acc, curr) => {
          const c = curr.cultura_principal || 'Outros'
          acc[c] = (acc[c] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const pData = Object.entries(culturaCounts || {}).map(([name, value]) => ({ name, value }))
      setPieData(pData)

      const bData =
        rois?.map((r, i) => ({
          name: r.cultura || `Cálculo ${i + 1}`,
          valor: Number(r.lucro_liquido) || 0,
        })) || []
      setBarData(bData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    if (user) {
      const channel = supabase
        .channel('dashboard_consolidado')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'propriedades', filter: `user_id=eq.${user.id}` },
          fetchData,
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'rebanho', filter: `user_id=eq.${user.id}` },
          fetchData,
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'calculos_roi', filter: `user_id=eq.${user.id}` },
          fetchData,
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'system_alerts', filter: `user_id=eq.${user.id}` },
          fetchData,
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const pieChartConfig = useMemo(() => {
    return pieData.reduce(
      (acc, curr, i) => {
        acc[curr.name] = { label: curr.name, color: pieColors[i % pieColors.length] }
        return acc
      },
      {} as Record<string, any>,
    )
  }, [pieData])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-green-500" />
          Dashboard Consolidado
        </h1>
        <p className="text-zinc-400">
          Visão executiva e estratégica de toda a sua operação agropecuária.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <GradientCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Propriedades</h3>
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <Map className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{kpis.propriedades}</p>
        </GradientCard>

        <GradientCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Safras Ativas</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{kpis.safras}</p>
        </GradientCard>

        <GradientCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Custos de Insumos</h3>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p
            className="text-3xl font-bold text-white truncate"
            title={formatCurrency(kpis.custoTotal)}
          >
            {formatCurrency(kpis.custoTotal)}
          </p>
        </GradientCard>

        <GradientCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">ROI Geral</h3>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white truncate" title={formatCurrency(kpis.roi)}>
            {formatCurrency(kpis.roi)}
          </p>
        </GradientCard>

        <GradientCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Alertas</h3>
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <BellRing className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{kpis.alertas}</p>
        </GradientCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        <GradientCard className="xl:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">
            Benchmarking de Safras (Evolução Anual)
          </h3>
          <div className="h-[300px] w-full min-h-0">
            <ChartContainer
              config={{
                sacas_por_ha: { label: 'Sacas/ha', color: '#22c55e' },
                custo_por_ha: { label: 'Custo/ha (R$)', color: '#ef4444' },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={benchmarkingData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis
                    dataKey="ano"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sacas_por_ha"
                    name="Sacas/ha"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#000' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="custo_por_ha"
                    name="Custo/ha (R$)"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#000' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </GradientCard>

        <GradientCard>
          <h3 className="text-lg font-semibold text-white mb-6">Distribuição de Culturas</h3>
          <div className="h-[300px] w-full min-h-0 flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-zinc-500 font-medium">Nenhuma cultura cadastrada.</p>
            ) : (
              <ChartContainer config={pieChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>
        </GradientCard>

        <GradientCard className="lg:col-span-2 xl:col-span-3">
          <h3 className="text-lg font-semibold text-white mb-6">
            Rentabilidade por Propriedade / Cultura
          </h3>
          <div className="h-[300px] w-full min-h-0 flex items-center justify-center">
            {barData.length === 0 ? (
              <p className="text-zinc-500 font-medium">Nenhum cálculo de ROI cadastrado.</p>
            ) : (
              <ChartContainer
                config={{ valor: { label: 'Lucro Líquido (R$)', color: '#3b82f6' } }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        value >= 1000 ? `R$ ${value / 1000}k` : `R$ ${value}`
                      }
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="valor" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>
        </GradientCard>
      </div>
    </div>
  )
}
