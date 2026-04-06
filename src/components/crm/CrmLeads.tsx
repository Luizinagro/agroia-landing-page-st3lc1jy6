import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Lead = {
  id: string
  nome: string
  email: string
  tamanho_propriedade: string
  regiao: string
  status: string
  valor_estimado: number
}

export function CrmLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [newLead, setNewLead] = useState({
    nome: '',
    email: '',
    regiao: '',
    tamanho_propriedade: '',
    valor_estimado: '',
  })

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('crm_leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setLeads(data || [])
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const updateLeadStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('crm_leads').update({ status }).eq('id', id)
    if (!error) {
      toast.success('Status atualizado!')
      fetchLeads()
    } else toast.error('Erro ao atualizar status')
  }

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('crm_leads').insert([
      {
        nome: newLead.nome,
        email: newLead.email,
        regiao: newLead.regiao,
        tamanho_propriedade: newLead.tamanho_propriedade,
        valor_estimado: Number(newLead.valor_estimado) || 0,
        status: 'Novo',
      },
    ])
    if (!error) {
      toast.success('Lead adicionado com sucesso!')
      setOpen(false)
      setNewLead({ nome: '', email: '', regiao: '', tamanho_propriedade: '', valor_estimado: '' })
      fetchLeads()
    } else toast.error('Erro ao adicionar lead')
  }

  const getStatusColor = (status: string) => {
    if (status === 'Novo') return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    if (status === 'Em Negociação') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    if (status === 'Fechado ganho' || status === 'Convertido')
      return 'bg-primary/10 text-primary border-primary/20'
    if (status === 'Perdido') return 'bg-destructive/10 text-destructive border-destructive/20'
    return 'bg-white/5 text-muted-foreground border-white/10'
  }

  const filtered = leads.filter(
    (l) =>
      l.nome.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card className="bg-[#050505] border-white/10 shadow-lg">
      <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-white">Base de Produtores (Leads)</CardTitle>
          <CardDescription>
            Acompanhe todos os seus potenciais clientes no agronegócio e negociações em andamento.
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-black/40 border-white/10 text-white w-full"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-black hover:bg-primary/90 font-semibold w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produtor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddLead} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Nome do Produtor / Fazenda</Label>
                  <Input
                    required
                    value={newLead.nome}
                    onChange={(e) => setNewLead({ ...newLead, nome: e.target.value })}
                    className="bg-black/50 border-white/10"
                    placeholder="Ex: Fazenda Boa Esperança"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email para contato</Label>
                  <Input
                    type="email"
                    required
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="bg-black/50 border-white/10"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Região (Estado)</Label>
                    <Input
                      value={newLead.regiao}
                      onChange={(e) => setNewLead({ ...newLead, regiao: e.target.value })}
                      className="bg-black/50 border-white/10"
                      placeholder="Ex: MT"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tamanho (Ha)</Label>
                    <Input
                      value={newLead.tamanho_propriedade}
                      onChange={(e) =>
                        setNewLead({ ...newLead, tamanho_propriedade: e.target.value })
                      }
                      className="bg-black/50 border-white/10"
                      placeholder="Ex: 500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Valor Estimado do Contrato (R$)</Label>
                  <Input
                    type="number"
                    required
                    value={newLead.valor_estimado}
                    onChange={(e) => setNewLead({ ...newLead, valor_estimado: e.target.value })}
                    className="bg-black/50 border-white/10"
                    placeholder="0"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-black font-bold mt-2">
                  Cadastrar Lead
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-b border-white/10">
                <TableHead className="text-zinc-400 font-medium">Produtor</TableHead>
                <TableHead className="text-zinc-400 font-medium hidden md:table-cell">
                  Propriedade
                </TableHead>
                <TableHead className="text-zinc-400 font-medium hidden sm:table-cell">
                  Valor Est.
                </TableHead>
                <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                <TableHead className="text-right text-zinc-400 font-medium">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                    Nenhum produtor encontrado. Clique em "Novo Lead" para adicionar.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell>
                      <div className="font-semibold text-white tracking-tight">{lead.nome}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{lead.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-zinc-400">
                      {lead.tamanho_propriedade ? `${lead.tamanho_propriedade} Ha` : '-'}
                      {lead.regiao && (
                        <span className="text-xs text-zinc-600 ml-1">({lead.regiao})</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-zinc-300 font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(lead.valor_estimado)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('whitespace-nowrap font-medium', getStatusColor(lead.status))}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/10"
                          >
                            <span className="sr-only">Abrir menu</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#0a0a0a] border-white/10 text-white shadow-xl"
                        >
                          <DropdownMenuItem
                            onClick={() => updateLeadStatus(lead.id, 'Novo')}
                            className="focus:bg-white/10 cursor-pointer"
                          >
                            Marcar como Novo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateLeadStatus(lead.id, 'Em Negociação')}
                            className="focus:bg-white/10 cursor-pointer"
                          >
                            Mover para Em Negociação
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateLeadStatus(lead.id, 'Fechado ganho')}
                            className="focus:bg-primary/20 focus:text-primary cursor-pointer font-medium"
                          >
                            Marcar Fechado ganho
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateLeadStatus(lead.id, 'Perdido')}
                            className="focus:bg-destructive/20 focus:text-destructive cursor-pointer"
                          >
                            Marcar Perdido
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
