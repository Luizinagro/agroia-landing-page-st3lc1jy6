import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  DialogFooter,
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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Loader2, Tractor } from 'lucide-react'
import { useRef } from 'react'
import { useGsapAnimations } from '@/hooks/use-gsap-animations'

export function Rebanho() {
  const { user } = useAuth() as any
  const [rebanho, setRebanho] = useState<any[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  useGsapAnimations(containerRef)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [tipoAnimal, setTipoAnimal] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [dataEntrada, setDataEntrada] = useState('')
  const [status, setStatus] = useState('Ativo')

  const fetchRebanho = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('rebanho')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Auto-insert mock data if empty
      if (data && data.length === 0) {
        const mockData = [
          {
            user_id: user.id,
            tipo_animal: 'Bovino - Nelore',
            quantidade: 150,
            data_entrada: new Date().toISOString(),
            status: 'Ativo',
          },
          {
            user_id: user.id,
            tipo_animal: 'Bovino - Angus',
            quantidade: 80,
            data_entrada: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Quarentena',
          },
          {
            user_id: user.id,
            tipo_animal: 'Bovino - Brahman',
            quantidade: 45,
            data_entrada: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Ativo',
          },
        ]
        const { data: insertedData, error: insertError } = await supabase
          .from('rebanho')
          .insert(mockData)
          .select()

        if (!insertError && insertedData) {
          setRebanho(insertedData)
        }
      } else {
        setRebanho(data || [])
      }
    } catch (err: any) {
      toast.error('Erro ao carregar rebanho: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRebanho()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const payload = {
        user_id: user.id,
        tipo_animal: tipoAnimal,
        quantidade: Number(quantidade),
        data_entrada: dataEntrada || new Date().toISOString(),
        status,
      }

      if (editingId) {
        const { error } = await supabase.from('rebanho').update(payload).eq('id', editingId)

        if (error) throw error
        toast.success('Registro atualizado com sucesso!')
      } else {
        const { error } = await supabase.from('rebanho').insert([payload])

        if (error) throw error
        toast.success('Animal adicionado com sucesso!')
      }

      setIsDialogOpen(false)
      resetForm()
      fetchRebanho()
    } catch (err: any) {
      toast.error('Erro ao salvar registro: ' + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este registro?')) return

    try {
      const { error } = await supabase.from('rebanho').delete().eq('id', id)

      if (error) throw error
      toast.success('Registro removido com sucesso!')
      fetchRebanho()
    } catch (err: any) {
      toast.error('Erro ao remover: ' + err.message)
    }
  }

  const openEdit = (item: any) => {
    setEditingId(item.id)
    setTipoAnimal(item.tipo_animal)
    setQuantidade(item.quantidade.toString())
    setDataEntrada(item.data_entrada.split('T')[0])
    setStatus(item.status || 'Ativo')
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setTipoAnimal('')
    setQuantidade('')
    setDataEntrada(new Date().toISOString().split('T')[0])
    setStatus('Ativo')
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <Card
      ref={containerRef}
      className="border-t-4 border-t-agro-green shadow-md overflow-hidden bg-background gsap-grow"
    >
      <CardHeader className="bg-muted/30 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-agro-green flex items-center gap-2">
              <Tractor className="w-6 h-6 text-agro-yellow" />
              Controle de Rebanho
            </CardTitle>
            <CardDescription className="text-sm mt-1 text-muted-foreground">
              Acompanhe a evolução, status e quantidade de animais da sua propriedade.
            </CardDescription>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
              else if (!editingId) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-agro-green hover:bg-agro-green/90 text-white font-medium border-b-4 border-agro-green/50 active:border-b-0 active:mt-1 transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Rebanho
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-agro-green">
                  {editingId ? 'Editar Registro' : 'Novo Registro no Rebanho'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Animal / Raça</Label>
                  <Input
                    id="tipo"
                    placeholder="Ex: Bovino - Nelore"
                    value={tipoAnimal}
                    onChange={(e) => setTipoAnimal(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      placeholder="Ex: 50"
                      min="1"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data">Data de Entrada</Label>
                    <Input
                      id="data"
                      type="date"
                      value={dataEntrada}
                      onChange={(e) => setDataEntrada(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Quarentena">Quarentena</SelectItem>
                      <SelectItem value="Vendido">Vendido</SelectItem>
                      <SelectItem value="Descarte">Descarte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-agro-green hover:bg-agro-green/90 text-white"
                  >
                    {editingId ? 'Salvar Alterações' : 'Adicionar ao Rebanho'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-agro-green" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-b border-agro-green/10 hover:bg-muted/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Tipo de Animal</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead>Data Entrada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="gsap-stagger-container">
                {rebanho.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Tractor className="w-8 h-8 text-muted-foreground/30" />
                        <p>Nenhum animal registrado ainda.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rebanho.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30 group gsap-stagger-item">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{item.id.substring(0, 6)}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {item.tipo_animal}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-agro-green">
                        {item.quantidade}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(item.data_entrada)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === 'Ativo'
                              ? 'bg-green-100/50 text-green-700 border-green-200'
                              : item.status === 'Quarentena'
                                ? 'bg-yellow-100/50 text-yellow-700 border-yellow-200'
                                : item.status === 'Vendido'
                                  ? 'bg-blue-100/50 text-blue-700 border-blue-200'
                                  : 'bg-red-100/50 text-red-700 border-red-200'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(item)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                            title="Deletar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
