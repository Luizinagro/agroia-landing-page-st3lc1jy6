import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { CloudRain, ThermometerSun, Droplets, Bug, Plus, Edit2, Trash2 } from 'lucide-react'
import { useDatabase, Previsao } from '@/contexts/DatabaseContext'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

export function WeatherForecast() {
  const { previsoes, loading, addPrevisao, updatePrevisao, deletePrevisao } = useDatabase()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [cidade, setCidade] = useState('')
  const [cultura, setCultura] = useState('')
  const [temperatura, setTemperatura] = useState(0)
  const [umidade, setUmidade] = useState(0)
  const [risco_pragas, setRiscoPragas] = useState('Baixo')

  const resetForm = () => {
    setCidade('')
    setCultura('')
    setTemperatura(0)
    setUmidade(0)
    setRiscoPragas('Baixo')
    setEditId(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setIsOpen(true)
  }

  const handleOpenEdit = (p: Previsao) => {
    setCidade(p.cidade)
    setCultura(p.cultura)
    setTemperatura(p.temperatura)
    setUmidade(p.umidade)
    setRiscoPragas(p.risco_pragas)
    setEditId(p.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await updatePrevisao(editId, { cidade, cultura, temperatura, umidade, risco_pragas })
        toast({ title: 'Atualizado', description: 'Previsão atualizada com sucesso.' })
      } else {
        await addPrevisao({
          cidade,
          cultura,
          temperatura,
          umidade,
          risco_pragas,
          data: new Date().toLocaleDateString('pt-BR'),
        })
        toast({ title: 'Adicionado', description: 'Nova previsão registrada.' })
      }
      setIsOpen(false)
    } catch {
      toast({ title: 'Erro', description: 'Falha ao salvar previsão.', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir esta previsão?')) {
      await deletePrevisao(id)
      toast({ title: 'Excluído', description: 'Previsão removida com sucesso.' })
    }
  }

  if (loading)
    return (
      <Card className="h-full border-primary/10 shadow-elevation">
        <CardContent className="p-6">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )

  return (
    <Card className="h-full rounded-[2rem] border-primary/50 shadow-sm flex flex-col bg-black text-white">
      <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-primary/20">
        <div>
          <CardTitle className="flex items-center gap-2 text-white">
            <CloudRain className="w-5 h-5 text-primary" />
            Previsões
          </CardTitle>
          <CardDescription className="text-gray-400">
            Monitoramento climático atualizado
          </CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenNew}
              size="sm"
              className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
            >
              <Plus className="w-4 h-4 mr-1" /> Nova Previsão
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editId ? 'Editar Previsão' : 'Nova Previsão'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input required value={cidade} onChange={(e) => setCidade(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Cultura</Label>
                  <Input required value={cultura} onChange={(e) => setCultura(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Temperatura (°C)</Label>
                  <Input
                    type="number"
                    required
                    value={temperatura}
                    onChange={(e) => setTemperatura(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Umidade (%)</Label>
                  <Input
                    type="number"
                    required
                    value={umidade}
                    onChange={(e) => setUmidade(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Risco de Pragas</Label>
                  <Input
                    required
                    value={risco_pragas}
                    onChange={(e) => setRiscoPragas(e.target.value)}
                    placeholder="Ex: Baixo, Médio, Alto"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary text-primary-foreground font-semibold">
                  Salvar Dados
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex-1 pt-6 overflow-y-auto max-h-[400px]">
        {previsoes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhuma previsão disponível. Adicione para começar.
          </div>
        ) : (
          <div className="space-y-4">
            {previsoes.map((prev) => (
              <div
                key={prev.id}
                className="border border-primary/30 rounded-xl p-4 bg-primary/5 shadow-sm flex flex-col gap-3 transition-all hover:border-primary/60 hover:bg-primary/10"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-foreground tracking-tight">
                      {prev.cidade}{' '}
                      <span className="text-muted-foreground font-normal ml-1">
                        | {prev.cultura}
                      </span>
                    </h4>
                    <span className="text-xs text-muted-foreground">{prev.data}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(prev)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(prev.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center justify-center gap-1.5 text-sm bg-orange-500/10 p-2 rounded-lg text-orange-400 font-medium border border-orange-500/20">
                    <ThermometerSun className="w-4 h-4" /> {prev.temperatura}°C
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-sm bg-blue-500/10 p-2 rounded-lg text-blue-400 font-medium border border-blue-500/20">
                    <Droplets className="w-4 h-4" /> {prev.umidade}%
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-sm bg-red-500/10 p-2 rounded-lg text-red-400 font-medium border border-red-500/20 whitespace-nowrap overflow-hidden text-ellipsis">
                    <Bug className="w-4 h-4 shrink-0" /> {prev.risco_pragas}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
