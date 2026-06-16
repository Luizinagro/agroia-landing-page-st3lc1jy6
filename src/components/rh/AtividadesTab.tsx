import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { rhService } from '@/services/gestao-rh'
import { CalendarDays, Tractor } from 'lucide-react'

export function AtividadesTab() {
  const [atividades, setAtividades] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    funcionario_id: '',
    data: new Date().toISOString().split('T')[0],
    descricao: '',
    talhao: '',
    cultura: '',
    horas: '',
    equipamento: '',
  })
  const { toast } = useToast()

  const load = () => {
    setLoading(true)
    rhService
      .call('listar_atividades', {})
      .then(setAtividades)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    rhService.call('listar_funcionarios', { ativo: true }).then(setFuncionarios)
    load()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await rhService.call('registrar_atividade', form)
      toast({ title: 'Sucesso', description: 'Atividade registrada.' })
      setOpen(false)
      load()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Registro de Atividades no Campo</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Tractor className="w-4 h-4 mr-2" /> Registrar Atividade
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>Nova Atividade</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Funcionário *</Label>
                <Select
                  required
                  value={form.funcionario_id}
                  onValueChange={(v) => setForm({ ...form, funcionario_id: v })}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {funcionarios.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    required
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horas (Opcional)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.horas}
                    onChange={(e) => setForm({ ...form, horas: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição da Atividade *</Label>
                <Input
                  required
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Ex: Aplicação de defensivo"
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Talhão / Local</Label>
                  <Input
                    value={form.talhao}
                    onChange={(e) => setForm({ ...form, talhao: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cultura</Label>
                  <Input
                    value={form.cultura}
                    onChange={(e) => setForm({ ...form, cultura: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Equipamento Utilizado</Label>
                <Input
                  value={form.equipamento}
                  onChange={(e) => setForm({ ...form, equipamento: e.target.value })}
                  placeholder="Ex: Trator John Deere"
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <Button type="submit" className="w-full">
                Salvar Atividade
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900">
            <TableRow>
              <TableHead className="text-zinc-400">Data</TableHead>
              <TableHead className="text-zinc-400">Funcionário</TableHead>
              <TableHead className="text-zinc-400">Descrição</TableHead>
              <TableHead className="text-zinc-400">Localização / Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-zinc-950">
            {atividades.map((a) => (
              <TableRow key={a.id} className="border-zinc-800">
                <TableCell className="text-white">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-zinc-500" />
                    {new Date(a.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300 font-medium">
                  {a.rh_funcionarios?.nome || 'Desconhecido'}
                </TableCell>
                <TableCell className="text-zinc-300">{a.descricao}</TableCell>
                <TableCell className="text-zinc-400 text-sm">
                  {a.talhao ? <span className="mr-2">📍 {a.talhao}</span> : ''}
                  {a.cultura ? <span className="mr-2">🌱 {a.cultura}</span> : ''}
                  {a.equipamento ? <span>🚜 {a.equipamento}</span> : ''}
                </TableCell>
              </TableRow>
            ))}
            {atividades.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-zinc-500 py-6">
                  Nenhuma atividade registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
