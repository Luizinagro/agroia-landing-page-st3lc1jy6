import { useEffect, useState } from 'react'
import { financeiroApi } from '@/services/gestao-financeira'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react'

export default function DashboardTab({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    financeiroApi
      .invoke('dashboard')
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [refreshKey])

  if (loading)
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    )
  if (error)
    return (
      <div className="p-8 text-red-500 bg-red-500/10 rounded-lg">
        Erro ao carregar dashboard: {error}
      </div>
    )
  if (!data) return null

  const isPositive = data.mes_atual.saldo >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <Card className="bg-zinc-950/50 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Receita do Mês</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            R$ {data.mes_atual.receitas.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Acumulado ano: R$ {data.ano_atual.receitas.toLocaleString('pt-BR')}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-950/50 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Despesas do Mês</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            R$ {data.mes_atual.despesas.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Acumulado ano: R$ {data.ano_atual.despesas.toLocaleString('pt-BR')}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-950/50 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Saldo Líquido (Mês)</CardTitle>
          <DollarSign className={`h-4 w-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            R$ {data.mes_atual.saldo.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Saldo ano: R$ {data.ano_atual.saldo.toLocaleString('pt-BR')}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-950/50 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Contas Vencidas</CardTitle>
          <AlertCircle
            className={`h-4 w-4 ${data.alertas.contas_vencidas > 0 ? 'text-red-500' : 'text-zinc-500'}`}
          />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${data.alertas.contas_vencidas > 0 ? 'text-red-500' : 'text-zinc-300'}`}
          >
            {data.alertas.contas_vencidas}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {data.alertas.vence_em_7_dias} contas vencendo em 7 dias
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
