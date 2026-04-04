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
import { ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Lead = {
  id: string
  nome: string
  email: string
  telefone: string
  tamanho_propriedade: string
  regiao: string
  tipo_cultura: string
  status: string
  valor_estimado: number
  created_at: string
}

export function CrmLeads() {
  const [leads, setLeads] = useState<Lead[]>([])

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('crm_leads' as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar leads')
      return
    }
    setLeads(data || [])
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const updateLeadStatus = async (id: string, novoStatus: string) => {
    const { error } = await supabase
      .from('crm_leads' as any)
      .update({ status: novoStatus })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar status')
      return
    }

    toast.success('Status atualizado com sucesso!')
    fetchLeads()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Novo':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'Em Negociação':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'Convertido':
      case 'Fechado ganho':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'Perdido':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Leads</CardTitle>
        <CardDescription>
          Acompanhe produtores rurais, pipeline de vendas e negociações em andamento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-white/5 overflow-hidden bg-white/[0.01]">
          <Table>
            <TableHeader className="bg-white/[0.02] hover:bg-white/[0.02]">
              <TableRow className="border-b border-white/5">
                <TableHead className="text-muted-foreground font-medium">Produtor</TableHead>
                <TableHead className="text-muted-foreground font-medium hidden md:table-cell">
                  Propriedade
                </TableHead>
                <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">
                  Valor Est.
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum lead encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <TableCell>
                      <div className="font-semibold text-foreground tracking-tight">
                        {lead.nome}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{lead.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {lead.tamanho_propriedade}{' '}
                      <span className="text-xs text-white/30 ml-1">({lead.regiao})</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(lead.valor_estimado)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('whitespace-nowrap', getStatusColor(lead.status))}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-white/10"
                          >
                            <span className="sr-only">Abrir menu</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-card border-white/10 text-foreground shadow-xl backdrop-blur-xl"
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
                            Em Negociação
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateLeadStatus(lead.id, 'Fechado ganho')}
                            className="focus:bg-primary/20 focus:text-primary cursor-pointer font-medium"
                          >
                            Fechado ganho
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateLeadStatus(lead.id, 'Perdido')}
                            className="focus:bg-destructive/20 focus:text-destructive cursor-pointer"
                          >
                            Perdido
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
