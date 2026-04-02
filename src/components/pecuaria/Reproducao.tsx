import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Edit2, Plus, Loader2 } from 'lucide-react'

type Rebanho = {
  id: string
  user_id: string
  tipo_animal: string
  quantidade: number
  data_entrada: string
  status: string | null
  created_at: string
}

export function Reproducao() {
  const [rebanho, setRebanho] = useState<Rebanho[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [tipoAnimal, setTipoAnimal] = useState('')
  const [quantidade, setQuantidade] = useState<number | ''>('')
  const [dataEntrada, setDataEntrada] = useState('')
  const [status, setStatus] = useState('Saudável')

  const { toast } = useToast()

  const fetchRebanho = async () => {
    try {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data, error } = await supabase
        .from('rebanho')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRebanho(data || [])
    } catch (error: any) {
      console.error('Erro ao buscar rebanho:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do rebanho.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRebanho()
  }, [])

  const handleSave = async () => {
    try {
      if (!tipoAnimal || !quantidade || !dataEntrada) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Preencha todos os campos obrigatórios.',
          variant: 'destructive',
        })
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Usuário não autenticado')

      const payload = {
        user_id: userData.user.id,
        tipo_animal: tipoAnimal,
        quantidade: Number(quantidade),
        data_entrada: new Date(`${dataEntrada}T12:00:00Z`).toISOString(),
        status,
      }

      if (editingId) {
        const { error } = await supabase
          .from('rebanho')
          .update(payload)
          .eq('id', editingId)
          .eq('user_id', userData.user.id)

        if (error) throw error
        toast({ title: 'Sucesso', description: 'Registro atualizado com sucesso!' })
      } else {
        const { error } = await supabase.from('rebanho').insert([payload])

        if (error) throw error
        toast({ title: 'Sucesso', description: 'Registro criado com sucesso!' })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchRebanho()
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o registro.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { error } = await supabase
        .from('rebanho')
        .delete()
        .eq('id', id)
        .eq('user_id', userData.user.id)

      if (error) throw error

      toast({ title: 'Sucesso', description: 'Registro excluído com sucesso!' })
      fetchRebanho()
    } catch (error: any) {
      console.error('Erro ao deletar:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o registro.',
        variant: 'destructive',
      })
    }
  }

  const openEdit = (item: Rebanho) => {
    setEditingId(item.id)
    setTipoAnimal(item.tipo_animal)
    setQuantidade(item.quantidade)
    const dateStr = item.data_entrada ? item.data_entrada.split('T')[0] : ''
    setDataEntrada(dateStr)
    setStatus(item.status || 'Saudável')
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setTipoAnimal('')
    setQuantidade('')
    setDataEntrada('')
    setStatus('Saudável')
  }

  return (
    <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-agro-green">Gestão de Rebanho</h2>
          <p className="text-muted-foreground text-sm">
            Controle a entrada, quantidade e status dos seus animais.
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-agro-green hover:bg-agro-green/90 text-white gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Lote
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Lote' : 'Novo Lote de Animais'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo de Animal</Label>
                <Input
                  id="tipo"
                  placeholder="Ex: Bovino, Suíno, Ave..."
                  value={tipoAnimal}
                  onChange={(e) => setTipoAnimal(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="qtd">Quantidade</Label>
                  <Input
                    id="qtd"
                    type="number"
                    placeholder="Ex: 50"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="data">Data de Entrada</Label>
                  <Input
                    id="data"
                    type="date"
                    value={dataEntrada}
                    onChange={(e) => setDataEntrada(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Saudável">Saudável</SelectItem>
                    <SelectItem value="Em Tratamento">Em Tratamento</SelectItem>
                    <SelectItem value="Vendido">Vendido</SelectItem>
                    <SelectItem value="Óbito">Óbito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-agro-green hover:bg-agro-green/90 text-white"
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-x-auto bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de Animal</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Data de Entrada</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-agro-green" />
                  <span className="text-sm text-muted-foreground mt-2 block">
                    Carregando rebanho...
                  </span>
                </TableCell>
              </TableRow>
            ) : rebanho.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum registro encontrado. Clique em "Adicionar Lote" para começar.
                </TableCell>
              </TableRow>
            ) : (
              rebanho.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.tipo_animal}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>
                    {item.data_entrada
                      ? new Date(item.data_entrada).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Saudável'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'Em Tratamento'
                            ? 'bg-yellow-100 text-yellow-800'
                            : item.status === 'Vendido'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
