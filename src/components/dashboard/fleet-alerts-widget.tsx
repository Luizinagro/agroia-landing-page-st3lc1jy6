import { useEffect, useState } from 'react'
import { invokeMaquinario } from '@/services/maquinario'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tractor, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function FleetAlertsWidget() {
  const [alertas, setAlertas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    invokeMaquinario({ action: 'alertas' })
      .then((res) => setAlertas(res.alertas || []))
      .catch(() => setAlertas([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="bg-black border-primary/20 text-white rounded-3xl h-full">
        <CardHeader>
          <Skeleton className="h-6 w-1/3 bg-zinc-800" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full bg-zinc-800" />
          <Skeleton className="h-16 w-full bg-zinc-800" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black border-primary/20 text-white rounded-3xl h-full shadow-[0_0_15px_rgba(29,185,84,0.05)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Tractor className="text-primary w-5 h-5" /> Alertas de Frota
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Próximas manutenções e vencimentos de documentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alertas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-zinc-500">
            <CheckCircle2 className="w-12 h-12 text-primary/30 mb-2" />
            <p>Sua frota está em dia!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertas.slice(0, 5).map((a, i) => {
              const isUrgent =
                a.urgencia === 'vencido' || a.urgencia === 'urgente' || a.urgencia === 'atrasado'
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${isUrgent ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}
                >
                  {isUrgent ? (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-sm">{a.maquina}</p>
                    <p className="text-xs text-zinc-400">{a.descricao}</p>
                    {a.dias_restantes !== undefined && (
                      <p
                        className={`text-xs font-bold mt-1 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}
                      >
                        {a.dias_restantes < 0
                          ? `Atrasado há ${Math.abs(a.dias_restantes)} dias`
                          : `Em ${a.dias_restantes} dias`}
                      </p>
                    )}
                    {a.horas_restantes !== undefined && (
                      <p
                        className={`text-xs font-bold mt-1 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}
                      >
                        Faltam {a.horas_restantes}h
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
            {alertas.length > 5 && (
              <p className="text-xs text-center text-zinc-500 mt-4">
                +{alertas.length - 5} alertas na página de Maquinário
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
