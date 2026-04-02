import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, ShieldCheck, Leaf, Calendar, Plus, Trash2, Edit } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  getRastreabilidades,
  addRastreabilidade,
  updateRastreabilidade,
  deleteRastreabilidade,
} from '@/services/rastreabilidade'
import { Database } from '@/lib/supabase/types'

type Rastreabilidade = Database['public']['Tables']['rastreabilidade']['Row']

export function RastreabilidadeEsg() {
  const [eventos, setEventos] = useState<Rastreabilidade[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Rastreabilidade | null>(null)
  const { toast } = useToast()

  // form state
  const [etapa, setEtapa] = useState('')
  const [data, setData] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [status, setStatus] = useState('Concluído')

  useEffect(() => {
    fetchEventos()
  }, [])

  const fetchEventos = async () => {
    try {
      const result = await getRastreabilidades()
      setEventos(result || [])
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const openAddDialog = () => {
    setEditingEvento(null)
    setEtapa('')

    // Format local date for datetime-local input
    const now = new Date()
    const offset = now.getTimezoneOffset() * 60000
    const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16)

    setData(localISOTime)
    setResponsavel('')
    setStatus('Concluído')
    setIsDialogOpen(true)
  }

  const openEditDialog = (evento: Rastreabilidade) => {
    setEditingEvento(evento)
    setEtapa(evento.etapa)

    const eventDate = new Date(evento.data)
    const offset = eventDate.getTimezoneOffset() * 60000
    const localISOTime = new Date(eventDate.getTime() - offset).toISOString().slice(0, 16)

    setData(localISOTime)
    setResponsavel(evento.responsavel || '')
    setStatus(evento.status || 'Concluído')
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        etapa,
        data: new Date(data).toISOString(),
        responsavel,
        status,
      }

      if (editingEvento) {
        await updateRastreabilidade(editingEvento.id, payload)
        toast({ title: 'Sucesso', description: 'Etapa atualizada com sucesso.' })
      } else {
        await addRastreabilidade(payload)
        toast({ title: 'Sucesso', description: 'Etapa adicionada com sucesso.' })
      }
      setIsDialogOpen(false)
      fetchEventos()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a etapa.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta etapa?')) return
    try {
      await deleteRastreabilidade(id)
      toast({ title: 'Sucesso', description: 'Etapa excluída com sucesso.' })
      fetchEventos()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a etapa.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="border-agro-green/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="text-agro-green">Rastreabilidade ESG</CardTitle>
        <CardDescription>
          Gestão de origem, histórico sanitário e certificações para exportação.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative w-full h-64 bg-muted rounded-xl overflow-hidden border border-border">
            <img
              src="https://img.usecurling.com/p/1200/600?q=satellite%20farm"
              alt="Mapa da Fazenda"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-1/2 left-1/3 text-agro-yellow animate-bounce">
              <MapPin className="w-8 h-8 drop-shadow-md" fill="currentColor" />
            </div>
            <div
              className="absolute top-1/3 left-2/3 text-agro-yellow animate-bounce"
              style={{ animationDelay: '0.2s' }}
            >
              <MapPin className="w-8 h-8 drop-shadow-md" fill="currentColor" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-agro-green flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-agro-yellow" /> Conformidade Sanitária
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-agro-green text-agro-green bg-agro-green/5"
                >
                  <Leaf className="w-3 h-3 mr-1" /> Orgânico
                </Badge>
                <Badge
                  variant="outline"
                  className="border-agro-green text-agro-green bg-agro-green/5"
                >
                  <Leaf className="w-3 h-3 mr-1" /> Grass-fed
                </Badge>
                <Badge
                  variant="outline"
                  className="border-agro-green text-agro-green bg-agro-green/5"
                >
                  <ShieldCheck className="w-3 h-3 mr-1" /> Livre de Aftosa
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Mantenha os requisitos sanitários em dia para atestar conformidade.
              </p>
            </div>

            <Card className="bg-agro-green/5 border-agro-green/10 shadow-none">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-agro-green">Relatório ESG Dinâmico</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Baseado na sua linha do tempo
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-agro-green text-white hover:bg-agro-green/90 shrink-0"
                >
                  Baixar PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6 border-t pt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-agro-green">Linha do Tempo Operacional</h3>
              <p className="text-sm text-muted-foreground">
                Histórico de rastreabilidade e saúde animal
              </p>
            </div>
            <Button
              onClick={openAddDialog}
              className="bg-agro-green text-white hover:bg-agro-green/90 shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" /> Nova Etapa
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Carregando histórico...
            </div>
          ) : eventos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl border-border bg-muted/20">
              <p className="text-muted-foreground mb-4">Nenhuma etapa registrada ainda.</p>
              <Button
                variant="outline"
                onClick={openAddDialog}
                className="text-agro-green border-agro-green/20"
              >
                Registrar primeira etapa
              </Button>
            </div>
          ) : (
            <div className="relative border-l-2 border-agro-green/20 ml-4 space-y-8 pb-4 mt-8">
              {eventos.map((evento) => (
                <div key={evento.id} className="relative pl-6 sm:pl-8 group">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-agro-green shadow-sm group-hover:bg-agro-yellow transition-colors" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 bg-card p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{evento.etapa}</h4>
                        <Badge
                          variant={
                            evento.status === 'Concluído'
                              ? 'default'
                              : evento.status === 'Em Andamento'
                                ? 'secondary'
                                : 'outline'
                          }
                          className={
                            evento.status === 'Concluído'
                              ? 'bg-agro-green hover:bg-agro-green/80'
                              : ''
                          }
                        >
                          {evento.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(evento.data), "dd/MM/yyyy 'às' HH:mm")}
                        </span>
                        {evento.responsavel && (
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            {evento.responsavel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 sm:mt-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(evento)}
                        className="h-8 w-8 text-muted-foreground hover:text-agro-green"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(evento.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-agro-green">
              {editingEvento ? 'Editar Etapa' : 'Nova Etapa de Rastreabilidade'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="etapa">Nome da Etapa / Evento</Label>
              <Input
                id="etapa"
                placeholder="Ex: Vacinação contra Aftosa"
                value={etapa}
                onChange={(e) => setEtapa(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data e Hora</Label>
                <Input
                  id="data"
                  type="datetime-local"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planejado">Planejado</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável Técnico</Label>
              <Input
                id="responsavel"
                placeholder="Nome do veterinário ou gestor"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-agro-green text-white hover:bg-agro-green/90">
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
