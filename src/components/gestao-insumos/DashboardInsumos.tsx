import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Package, AlertTriangle, XCircle, DollarSign, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

function Card({ children, className }: any) {
  return <div className={`rounded-xl border ${className}`}>{children}</div>
}
function CardHeader({ children, className }: any) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
}
function CardTitle({ children, className }: any) {
  return <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
}
function CardContent({ children, className }: any) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}

export function DashboardInsumos({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [refreshKey])

  const fetchData = async () => {
    setLoading(true)
    const { data: res, error } = await supabase.functions.invoke('gestao-insumos', {
      body: { action: 'dashboard_insumos' },
    })

    if (error || !res?.success) {
      toast({
        title: 'Serviço temporariamente indisponível. Tente novamente.',
        variant: 'destructive',
      })
    } else {
      setData(res.data)
    }
    setLoading(false)
  }

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Cadastrado</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.total_produtos}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Valor em Estoque</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                data.valor_total_estoque,
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Estoque Baixo</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {data.alertas_estoque_baixo}
              {data.alertas_estoque_baixo > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Sem Estoque</CardTitle>
            <XCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.produtos_sem_estoque}</div>
          </CardContent>
        </Card>
      </div>

      {data.produtos_criticos?.length > 0 && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400 text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Produtos Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {data.produtos_criticos.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex justify-between items-center"
                >
                  <span className="font-medium text-red-200">{p.nome}</span>
                  <span className="text-sm text-red-300 font-bold">
                    {p.estoque_atual} {p.unidade}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
