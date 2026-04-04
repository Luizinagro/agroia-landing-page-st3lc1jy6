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
import { ChevronDown, DollarSign, Users, Activity, Target } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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

const chartData = [
  { mes: 'Jan', receita: 12500 },
  { mes: 'Fev', receita: 15200 },
  { mes: 'Mar', receita: 18900 },
  { mes: 'Abr', receita: 23400 },
  { mes: 'Mai', receita: 28000 },
  { mes: 'Jun', receita: 35000 },
]

const chartConfig = {
  receita: {
    label: 'Receita (R$)',
    color: '#1DB954',
  },
}

export default function CRM() {
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
        return 'bg-primary/10 text-primary border-primary/20'
      case 'Perdido':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-background text-foreground font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">CRM & Vendas</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie leads, conversões e a performance comercial do AgroIA.
          </p>
        </div>
        <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold transition-colors backdrop-blur-md">
          Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Recorrente
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground tracking-tight">R$ 58.240</div>
            <p className="text-xs text-primary mt-1 flex items-center font-medium">
              <Activity className="h-3 w-3 mr-1" /> +15.3% este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Novos Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground tracking-tight">+142</div>
            <p className="text-xs text-muted-foreground mt-1">Nos últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
            <Target className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground tracking-tight">12.5%</div>
            <p className="text-xs text-primary mt-1 font-medium">
              +2.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assinaturas Ativas
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground tracking-tight">1,204</div>
            <p className="text-xs text-muted-foreground mt-1">Produtores engajados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Crescimento de Receita</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 pb-4">
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#1A1A1A" strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `R$${val / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="receita"
                  fill="var(--color-receita)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

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
                  <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">
                    Cultura
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">
                    Valor Est.
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">
                    Ação
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum lead encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
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
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {lead.tipo_cultura}
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
                              className="focus:bg-white/10 focus:text-foreground cursor-pointer"
                            >
                              Marcar como Novo
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateLeadStatus(lead.id, 'Em Negociação')}
                              className="focus:bg-white/10 focus:text-foreground cursor-pointer"
                            >
                              Em Negociação
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateLeadStatus(lead.id, 'Convertido')}
                              className="focus:bg-primary/20 focus:text-primary cursor-pointer font-medium"
                            >
                              Convertido (Ganho)
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
    </div>
  )
}
