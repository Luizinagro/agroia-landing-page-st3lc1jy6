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
        return 'bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20'
      case 'Perdido':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-[#000000] text-white font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">CRM & Vendas</h2>
          <p className="text-gray-400">
            Gerencie leads, conversões e a performance comercial do AgroIA.
          </p>
        </div>
        <Button className="bg-[#1DB954] text-black hover:bg-[#1ed760] font-semibold transition-colors">
          Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#0A0A0A] border-[#1DB954]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita Recorrente</CardTitle>
            <DollarSign className="h-4 w-4 text-[#1DB954]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ 58.240</div>
            <p className="text-xs text-[#1DB954] mt-1 flex items-center">
              <Activity className="h-3 w-3 mr-1" /> +15.3% este mês
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#0A0A0A] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Novos Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+142</div>
            <p className="text-xs text-gray-500 mt-1">Nos últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0A0A0A] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12.5%</div>
            <p className="text-xs text-[#1DB954] mt-1">+2.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0A0A0A] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Assinaturas Ativas</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,204</div>
            <p className="text-xs text-gray-500 mt-1">Produtores engajados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-7 bg-[#0A0A0A] border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Crescimento de Receita</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
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

      <Card className="bg-[#0A0A0A] border-white/5">
        <CardHeader>
          <CardTitle className="text-white">Gestão de Leads</CardTitle>
          <CardDescription className="text-gray-400">
            Acompanhe produtores rurais, pipeline de vendas e negociações em andamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5 hover:bg-white/5">
                <TableRow className="border-b border-white/5">
                  <TableHead className="text-gray-400">Produtor</TableHead>
                  <TableHead className="text-gray-400 hidden md:table-cell">Propriedade</TableHead>
                  <TableHead className="text-gray-400 hidden lg:table-cell">Cultura</TableHead>
                  <TableHead className="text-gray-400 hidden sm:table-cell">Valor Est.</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-right text-gray-400">Ação</TableHead>
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
                        <div className="font-medium text-white">{lead.nome}</div>
                        <div className="text-xs text-gray-500">{lead.email}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-300">
                        {lead.tamanho_propriedade}{' '}
                        <span className="text-xs text-gray-500 ml-1">({lead.regiao})</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-300">
                        {lead.tipo_cultura}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-gray-300">
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
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                            >
                              <span className="sr-only">Abrir menu</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#111111] border-[#222222] text-white"
                          >
                            <DropdownMenuItem
                              onClick={() => updateLeadStatus(lead.id, 'Novo')}
                              className="focus:bg-white/10 focus:text-white cursor-pointer"
                            >
                              Marcar como Novo
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateLeadStatus(lead.id, 'Em Negociação')}
                              className="focus:bg-white/10 focus:text-white cursor-pointer"
                            >
                              Em Negociação
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateLeadStatus(lead.id, 'Convertido')}
                              className="focus:bg-white/10 focus:text-[#1DB954] cursor-pointer"
                            >
                              Convertido (Ganho)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateLeadStatus(lead.id, 'Perdido')}
                              className="focus:bg-white/10 focus:text-red-400 cursor-pointer"
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
