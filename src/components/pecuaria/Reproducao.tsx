import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
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
import { Tractor, Plus, Edit2, Trash2, Scale, DollarSign, Sprout } from 'lucide-react'
import { useDatabase, Animal } from '@/contexts/DatabaseContext'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export function Reproducao() {
  const { animais, addAnimal, updateAnimal, deleteAnimal, loading } = useDatabase()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [tipo, setTipo] = useState('')
  const [peso, setPeso] = useState(0)
  const [fase, setFase] = useState('')
  const [racao_recomendada, setRacao] = useState('')
  const [custo_mensal, setCusto] = useState(0)

  const resetForm = () => {
    setTipo('')
    setPeso(0)
    setFase('')
    setRacao('')
    setCusto(0)
    setEditId(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setIsOpen(true)
  }

  const handleOpenEdit = (a: Animal) => {
    setTipo(a.tipo)
    setPeso(a.peso)
    setFase(a.fase)
    setRacao(a.racao_recomendada)
    setCusto(a.custo_mensal)
    setEditId(a.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await updateAnimal(editId, { tipo, peso, fase, racao_recomendada, custo_mensal })
        toast({ title: 'Atualizado', description: 'Registro de rebanho atualizado.' })
      } else {
        await addAnimal({ tipo, peso, fase, racao_recomendada, custo_mensal })
        toast({ title: 'Registrado', description: 'Animal cadastrado no sistema.' })
      }
      setIsOpen(false)
    } catch {
      toast({ title: 'Erro', description: 'Falha ao salvar o registro.', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Remover este animal do sistema?')) {
      await deleteAnimal(id)
      toast({ title: 'Removido', description: 'Animal deletado do rebanho.' })
    }
  }

  if (loading) return <Skeleton className="w-full h-[400px] rounded-xl" />

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-agro-green/10 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-agro-green flex items-center gap-2">
            <Tractor className="w-6 h-6 text-agro-yellow" />
            Gestão de Rebanho
          </h2>
          <p className="text-sm text-muted-foreground">
            Controle de peso, custos e fases do seu rebanho.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenNew}
              className="bg-agro-green text-agro-yellow font-bold hover:bg-agro-green/90"
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Animal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-agro-green">
                {editId ? 'Editar Animal' : 'Registrar Novo Animal'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo / ID</Label>
                  <Input
                    required
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    placeholder="Ex: Matriz, Touro 001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fase de Vida</Label>
                  <Input
                    required
                    value={fase}
                    onChange={(e) => setFase(e.target.value)}
                    placeholder="Ex: Recria, Terminação"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Peso Atual (kg)</Label>
                  <Input
                    type="number"
                    required
                    value={peso}
                    onChange={(e) => setPeso(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Custo Mensal (R$)</Label>
                  <Input
                    type="number"
                    required
                    value={custo_mensal}
                    onChange={(e) => setCusto(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ração Recomendada</Label>
                  <Input
                    required
                    value={racao_recomendada}
                    onChange={(e) => setRacao(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-agro-green text-white font-bold">
                  Salvar Registro
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {animais.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-agro-green/30 rounded-xl text-muted-foreground">
          Rebanho vazio. Registre o primeiro animal para acompanhar seu desenvolvimento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animais.map((a) => (
            <Card
              key={a.id}
              className="border-agro-green/10 hover:border-agro-green/40 transition-colors shadow-sm bg-white"
            >
              <CardHeader className="pb-3 border-b border-agro-green/5">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-agro-green text-lg">{a.tipo}</CardTitle>
                    <CardDescription className="font-medium text-agro-green/70">
                      Fase: {a.fase}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-50 text-blue-600"
                      onClick={() => handleOpenEdit(a)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 text-red-600"
                      onClick={() => handleDelete(a.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Scale className="w-4 h-4 text-agro-green" /> Peso Atual
                  </span>
                  <span className="font-bold text-agro-green">{a.peso} kg</span>
                </div>
                <div className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg">
                  <span className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4 text-red-500" /> Custo Mensal
                  </span>
                  <span className="font-bold text-red-600">R$ {a.custo_mensal}</span>
                </div>
                <div className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Sprout className="w-4 h-4 text-agro-yellow" /> Nutrição
                  </span>
                  <span
                    className="font-medium text-slate-700 truncate max-w-[120px]"
                    title={a.racao_recomendada}
                  >
                    {a.racao_recomendada}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
