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
    <Card className="h-full border-[#1a3c34]/10 shadow-elevation flex flex-col">
      <CardHeader className="bg-[#1a3c34]/5 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[#1a3c34] flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-[#f4d03f]" />
            Previsões
          </CardTitle>
          <CardDescription>Monitoramento climático atualizado</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenNew}
              size="sm"
              className="bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90"
            >
              <Plus className="w-4 h-4 mr-1" /> Nova Previsão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#1a3c34]">
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
                <Button type="submit" className="bg-[#1a3c34] text-[#f4d03f] font-bold">
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
                className="border border-[#1a3c34]/10 rounded-lg p-4 bg-white shadow-sm flex flex-col gap-3 transition-colors hover:border-[#1a3c34]/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#1a3c34]">
                      {prev.cidade}{' '}
                      <span className="text-muted-foreground font-normal ml-1">
                        | {prev.cultura}
                      </span>
                    </h4>
                    <span className="text-xs text-muted-foreground">{prev.data}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-50"
                      onClick={() => handleOpenEdit(prev)}
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50"
                      onClick={() => handleDelete(prev.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center justify-center gap-1.5 text-sm bg-orange-50 p-2 rounded text-orange-700 font-medium">
                    <ThermometerSun className="w-4 h-4" /> {prev.temperatura}°C
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-sm bg-blue-50 p-2 rounded text-blue-700 font-medium">
                    <Droplets className="w-4 h-4" /> {prev.umidade}%
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-sm bg-red-50 p-2 rounded text-red-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
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
