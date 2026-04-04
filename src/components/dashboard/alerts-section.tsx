import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Bug, CloudLightning, Sprout, CheckCircle2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useDatabase, Alerta } from '@/contexts/DatabaseContext'
import { Skeleton } from '@/components/ui/skeleton'

export function AlertsSection() {
  const { alertas, dismissAlerta, loading } = useDatabase()

  const handleDismiss = async (id: string) => {
    await dismissAlerta(id)
    toast.success('Alerta marcado como lido.')
  }

  const getAlertStyle = (type: Alerta['tipo']) => {
    switch (type) {
      case 'pest':
        return 'border-destructive/30 bg-destructive/5'
      case 'climate':
        return 'border-blue-500/30 bg-blue-500/5'
      case 'planting':
        return 'border-emerald-500/30 bg-emerald-500/5'
    }
  }

  const getIcon = (type: Alerta['tipo']) => {
    switch (type) {
      case 'pest':
        return <Bug className="w-5 h-5 text-destructive" />
      case 'climate':
        return <CloudLightning className="w-5 h-5 text-blue-500" />
      case 'planting':
        return <Sprout className="w-5 h-5 text-emerald-500" />
    }
  }

  if (loading) {
    return (
      <Card className="h-full border-primary/10 shadow-elevation">
        <CardContent className="p-6 h-full flex flex-col gap-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full rounded-[2rem] border-black/5 dark:border-white/5 shadow-sm flex flex-col overflow-hidden bg-white dark:bg-[#18181b]">
      <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 pb-4">
        <CardTitle className="text-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" />
            Meus Alertas
          </div>
          {alertas.length > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
              {alertas.length} ativo{alertas.length !== 1 && 's'}
            </span>
          )}
        </CardTitle>
        <CardDescription>Avisos importantes sobre sua plantação</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] lg:h-[calc(100vh-25rem)] px-4 py-4">
          {alertas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground animate-fade-in">
              <CheckCircle2 className="w-16 h-16 mb-4 text-emerald-500/50" />
              <p className="text-center px-6">Tudo tranquilo! Nenhum alerta ativo no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alertas.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-300 hover:shadow-md animate-fade-in-up',
                    getAlertStyle(alert.tipo),
                  )}
                >
                  <div className="flex gap-4">
                    <div className="mt-0.5 bg-background shadow-sm p-2.5 rounded-full h-fit border border-border/50">
                      {getIcon(alert.tipo)}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-medium leading-snug text-foreground/90">
                        {alert.mensagem}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {new Date(alert.data_criacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDismiss(alert.id)}
                      className="text-xs h-8 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                    >
                      Marcar como Lida
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
