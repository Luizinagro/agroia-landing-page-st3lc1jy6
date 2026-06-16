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
import { useToast } from '@/hooks/use-toast'
import { rhService } from '@/services/gestao-rh'
import { Briefcase, UserX } from 'lucide-react'

export function FuncionariosTab() {
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    funcao: '',
    data_admissao: new Date().toISOString().split('T')[0],
    salario_base: '',
    telefone: '',
  })
  const { toast } = useToast()

  const load = () => {
    setLoading(true)
    rhService
      .call('listar_funcionarios', { ativo: true })
      .then(setFuncionarios)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await rhService.call('criar_funcionario', form)
      toast({ title: 'Sucesso', description: 'Funcionário cadastrado.' })
      setOpen(false)
      setForm({
        nome: '',
        cpf: '',
        funcao: '',
        data_admissao: new Date().toISOString().split('T')[0],
        salario_base: '',
        telefone: '',
      })
      load()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const handleDesligar = async (id: string) => {
    const motivo = prompt('Motivo do desligamento:')
    if (motivo === null) return
    try {
      await rhService.call('desligar_funcionario', {
        id,
        motivo,
        data_desligamento: new Date().toISOString().split('T')[0],
      })
      toast({ title: 'Sucesso', description: 'Funcionário desligado e arquivado.' })
      load()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Equipe Ativa</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Briefcase className="w-4 h-4 mr-2" /> Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>Cadastrar Funcionário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Função / Cargo *</Label>
                <Input
                  required
                  value={form.funcao}
                  onChange={(e) => setForm({ ...form, funcao: e.target.value })}
                  placeholder="Ex: Operador de Máquinas"
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salário Base (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.salario_base}
                    onChange={(e) => setForm({ ...form, salario_base: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Admissão</Label>
                  <Input
                    type="date"
                    value={form.data_admissao}
                    onChange={(e) => setForm({ ...form, data_admissao: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Cadastrar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900">
            <TableRow>
              <TableHead className="text-zinc-400">Nome</TableHead>
              <TableHead className="text-zinc-400">Função</TableHead>
              <TableHead className="text-zinc-400">Salário Base</TableHead>
              <TableHead className="text-zinc-400">Data Admissão</TableHead>
              <TableHead className="text-zinc-400 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-zinc-950">
            {funcionarios.map((f) => (
              <TableRow key={f.id} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell className="text-white font-medium">{f.nome}</TableCell>
                <TableCell className="text-zinc-300">{f.funcao}</TableCell>
                <TableCell className="text-zinc-300">
                  R$ {(f.salario_base || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-zinc-300">
                  {f.data_admissao
                    ? new Date(f.data_admissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => handleDesligar(f.id)}
                  >
                    <UserX className="w-4 h-4 mr-2" /> Desligar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {funcionarios.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500 py-6">
                  Nenhum funcionário ativo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
