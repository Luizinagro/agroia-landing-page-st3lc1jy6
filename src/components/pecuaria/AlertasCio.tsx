import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { AlertCircle, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function AlertasCio() {
  const [alertas, setAlertas] = useState<any[]>([])

  useEffect(() => {
    const triggerAndFetch = async () => {
      try {
        await supabase.functions.invoke('gerar-alertas-cio')
      } catch (e) {
        console.error('Error invoking gerar-alertas-cio', e)
      }

      fetchAlertas()
    }

    triggerAndFetch()

    const interval = setInterval(triggerAndFetch, 3600000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlertas = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return

    const { data, error } = await supabase
      .from('alertas_cio')
      .select('id, mensagem, data_alerta, animal_id, animais(nome, tipo, proximo_cio_estimado)')
      .eq('user_id', userData.user.id)
      .eq('status', 'pendente')
      .order('data_alerta', { ascending: false })

    if (data && !error) {
      setAlertas(data)
    }
  }

  const dismissAlert = async (id: string) => {
    setAlertas(alertas.filter((a) => a.id !== id))
    await supabase.from('alertas_cio').update({ status: 'lido' }).eq('id', id)
  }

  if (alertas.length === 0) return null

  return (
    <div className="space-y-4 mb-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
        <AlertCircle className="w-6 h-6" />
        Alertas de Cio
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alertas.map((alerta) => (
          <Alert
            key={alerta.id}
            variant="destructive"
            className="bg-red-950/40 border-red-500/50 text-red-100 relative group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-md" />
            <AlertCircle className="h-5 w-5 !text-red-500" />
            <AlertTitle className="text-red-400 font-semibold pr-6">
              Cio Iminente: {alerta.animais?.nome || 'Animal'}
            </AlertTitle>
            <AlertDescription className="text-red-200/90 mt-2">
              {alerta.mensagem}
              <div className="mt-2 text-xs font-medium text-red-400/80 bg-red-950/60 p-2 rounded border border-red-900/50">
                Data Prevista:{' '}
                {alerta.animais?.proximo_cio_estimado
                  ? new Date(alerta.animais.proximo_cio_estimado).toLocaleDateString('pt-BR', {
                      timeZone: 'UTC',
                    })
                  : 'N/A'}
              </div>
            </AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:text-red-200 hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => dismissAlert(alerta.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        ))}
      </div>
    </div>
  )
}
