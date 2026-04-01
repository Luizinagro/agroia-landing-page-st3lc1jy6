import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { CalendarDays, Syringe, Loader2 } from 'lucide-react'
import { useDatabase } from '@/contexts/DatabaseContext'
import { useToast } from '@/hooks/use-toast'

export function Reproducao() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { animais, addAnimal, loading } = useDatabase()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [matriz, setMatriz] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Deriving events from animais (those marked as reproducao)
  const reproductiveEvents = animais
    .filter((a) => a.fase === 'inseminacao' || a.fase === 'reproducao')
    .map((a) => ({
      date: new Date(), // using current date for demo as we don't store dates in this mock schema yet
      type: 'Inseminação',
      animal: a.tipo === 'reproducao' ? `Matriz ${a.peso}` : 'Matriz',
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await addAnimal({
        tipo: 'reproducao',
        peso: Number(matriz.replace(/\D/g, '')) || 100,
        fase: 'inseminacao',
        racao_recomendada: 'Protocolo Padrão',
        custo_mensal: 150,
      })
      toast({ title: 'Sucesso', description: 'Protocolo salvo na base de dados.' })
      setIsOpen(false)
      setMatriz('')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="xl:col-span-1 space-y-6">
        <Card className="border-agro-green/20">
          <CardHeader>
            <CardTitle className="text-agro-green">Calendário Reprodutivo</CardTitle>
            <CardDescription>Acompanhe os ciclos do rebanho.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
              classNames={{
                day_selected:
                  'bg-agro-green text-white hover:bg-agro-green hover:text-white focus:bg-agro-green focus:text-white',
                day_today: 'bg-agro-yellow/20 text-agro-green font-bold',
              }}
            />
          </CardContent>
          <CardFooter>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-agro-yellow text-agro-green hover:bg-agro-yellow/90 font-semibold">
                  <Syringe className="w-4 h-4 mr-2" /> Agendar Inseminação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-agro-green">Nova Inseminação</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para registrar o protocolo reprodutivo.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="matriz">Identificação da Matriz</Label>
                      <Input
                        id="matriz"
                        placeholder="Ex: Matriz 102"
                        value={matriz}
                        onChange={(e) => setMatriz(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="data">Data Prevista</Label>
                      <Input id="data" type="date" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="semen">Touro / Sêmen</Label>
                      <Input id="semen" placeholder="Código do sêmen" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={isSaving || loading}
                      className="bg-agro-green text-white hover:bg-agro-green/90"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Confirmar Agendamento
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
      <div className="xl:col-span-2 space-y-4">
        <h3 className="font-semibold text-lg text-agro-green flex items-center gap-2">
          <CalendarDays className="w-5 h-5" /> Próximos Eventos
        </h3>
        <div className="grid gap-4">
          {loading ? (
            <div className="space-y-4">
              <div className="h-20 bg-muted animate-pulse rounded-lg"></div>
              <div className="h-20 bg-muted animate-pulse rounded-lg"></div>
            </div>
          ) : reproductiveEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-white/50">
              Nenhum evento reprodutivo registrado.
            </div>
          ) : (
            reproductiveEvents.map((ev, i) => (
              <Card
                key={i}
                className="border-agro-green/10 hover:border-agro-green/30 transition-colors"
              >
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-agro-green/10 flex items-center justify-center text-agro-green font-bold text-sm shrink-0">
                      {String(ev.date.getDate()).padStart(2, '0')}/
                      {String(ev.date.getMonth() + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">{ev.animal}</p>
                      <p className="text-sm text-muted-foreground">
                        Evento: <span className="font-medium text-agro-green">{ev.type}</span>
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-agro-green border-agro-green hover:bg-agro-green/5 shrink-0"
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
