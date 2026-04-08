import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, ShieldAlert, CloudLightning, DollarSign, Activity, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type Alerta = {
  tipo_alerta: 'clima' | 'preco' | 'saude'
  mensagem: string
  urgencia: 'alta' | 'média' | 'baixa'
  data_alerta: string
}

export function RealTimeAlertsWidget() {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlertas = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('gerar-alertas')
      if (!error && data?.data) {
        setAlertas(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch real-time alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlertas()
    // Atualiza a cada 15 minutos (15 * 60 * 1000 ms)
    const interval = setInterval(fetchAlertas, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getUrgencyStyles = (urgencia: string) => {
    switch (urgencia) {
      case 'alta':
        return 'border-red-500/30 bg-red-500/10 text-red-500'
      case 'média':
        return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'
      case 'baixa':
        return 'border-green-500/30 bg-green-500/10 text-green-500'
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-500'
    }
  }

  const getIcon = (tipo: string, urgencia: string) => {
    const colorClass =
      urgencia === 'alta'
        ? 'text-red-500'
        : urgencia === 'média'
          ? 'text-yellow-500'
          : 'text-green-500'
    switch (tipo) {
      case 'clima':
        return <CloudLightning className={cn('w-5 h-5', colorClass)} />
      case 'preco':
        return <DollarSign className={cn('w-5 h-5', colorClass)} />
      case 'saude':
        return <Activity className={cn('w-5 h-5', colorClass)} />
      default:
        return <Info className={cn('w-5 h-5', colorClass)} />
    }
  }

  return (
    <Card className="bg-black border border-primary/50 shadow-[0_0_15px_rgba(29,185,84,0.1)] rounded-3xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-primary to-blue-500 opacity-50" />
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" />
          Alertas em Tempo Real
        </CardTitle>
        <button
          onClick={fetchAlertas}
          className="text-gray-400 hover:text-primary transition-colors focus:outline-none"
          disabled={loading}
          title="Atualizar alertas"
        >
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
        </button>
      </CardHeader>
      <CardContent>
        {loading && alertas.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full bg-white/5 rounded-xl" />
            <Skeleton className="h-20 w-full bg-white/5 rounded-xl" />
            <Skeleton className="h-20 w-full bg-white/5 rounded-xl" />
          </div>
        ) : alertas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertas.map((alerta, index) => (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-xl border flex flex-col gap-3 transition-all hover:bg-white/5 animate-fade-in-up',
                  getUrgencyStyles(alerta.urgencia),
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {getIcon(alerta.tipo_alerta, alerta.urgencia)}
                    <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                      {alerta.tipo_alerta}
                    </span>
                  </div>
                  <span className="text-xs font-medium opacity-70">
                    {new Date(alerta.data_alerta).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm font-medium text-white/90 leading-relaxed flex-1">
                  {alerta.mensagem}
                </p>
                <div className="flex justify-end">
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      alerta.urgencia === 'alta'
                        ? 'bg-red-500/20 text-red-400'
                        : alerta.urgencia === 'média'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400',
                    )}
                  >
                    Urgência {alerta.urgencia}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <ShieldAlert className="w-12 h-12 text-primary/20 mb-3" />
            <p>Nenhum alerta crítico no momento.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
