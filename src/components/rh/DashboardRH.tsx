import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Activity, Clock } from 'lucide-react'
import { rhService } from '@/services/gestao-rh'

export function DashboardRH() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    rhService
      .call('dashboard_rh')
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-zinc-400 animate-pulse py-8 text-center">Carregando métricas...</div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-zinc-900 border-zinc-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Funcionários Ativos</CardTitle>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data?.total_funcionarios || 0}</div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Atividades Registradas Hoje
          </CardTitle>
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data?.atividades_hoje || 0}</div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Total Horas no Mês</CardTitle>
          <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data?.total_horas_mes || 0}h</div>
        </CardContent>
      </Card>
    </div>
  )
}
