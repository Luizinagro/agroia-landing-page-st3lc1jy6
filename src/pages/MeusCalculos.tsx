import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FileText, Pencil, Trash2, Download, ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Calculo {
  id: string
  data_criacao: string
  cultura: string | null
  custo_producao: number
  receita_esperada: number
  roi_percentual: number
  payback_meses: number
  tempo_retorno: number
}

const MeusCalculos = () => {
  const [calculos, setCalculos] = useState<Calculo[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    cultura: '',
    custo_producao: 0,
    receita_esperada: 0,
    tempo_retorno: 12,
  })

  const fetchCalculos = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('calculos_roi')
      .select('*')
      .eq('user_id', user.id)
      .order('data_criacao', { ascending: false })

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os cálculos.',
        variant: 'destructive',
      })
    } else {
      setCalculos(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCalculos()
  }, [user])

  const handleExportPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Meus Cálculos - AgroIA</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8fafc; font-weight: bold; }
            h1 { color: #16a34a; margin-bottom: 5px; }
            p { color: #64748b; margin-top: 0; }
            .positive { color: #16a34a; }
            .negative { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1>Relatório de Cálculos de ROI</h1>
          <p>Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cultura</th>
                <th>Custo Total</th>
                <th>Receita Esperada</th>
                <th>ROI (%)</th>
                <th>Payback (meses)</th>
              </tr>
            </thead>
            <tbody>
              ${calculos
                .map(
                  (c) => `
                <tr>
                  <td>${format(new Date(c.data_criacao), 'dd/MM/yyyy')}</td>
                  <td>${c.cultura || '-'}</td>
                  <td>${c.custo_producao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td>${c.receita_esperada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td class="${c.roi_percentual >= 0 ? 'positive' : 'negative'}">${c.roi_percentual.toFixed(2)}%</td>
                  <td>${c.payback_meses.toFixed(1)}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  const openEdit = (calc: Calculo) => {
    setFormData({
      cultura: calc.cultura || '',
      custo_producao: calc.custo_producao,
      receita_esperada: calc.receita_esperada,
      tempo_retorno: calc.tempo_retorno,
    })
    setEditingId(calc.id)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    const lucro = formData.receita_esperada - formData.custo_producao
    const margem = formData.receita_esperada > 0 ? (lucro / formData.receita_esperada) * 100 : 0
    const roi = formData.custo_producao > 0 ? (lucro / formData.custo_producao) * 100 : 0
    const payback = lucro > 0 ? formData.custo_producao / (lucro / formData.tempo_retorno) : 0

    const { error } = await supabase
      .from('calculos_roi')
      .update({
        cultura: formData.cultura,
        custo_producao: formData.custo_producao,
        receita_esperada: formData.receita_esperada,
        tempo_retorno: formData.tempo_retorno,
        lucro_liquido: lucro,
        margem_lucro: margem,
        roi_percentual: roi,
        payback_meses: payback,
      })
      .eq('id', editingId)

    if (error) {
      toast({ title: 'Erro', description: 'Falha ao atualizar cálculo.', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Cálculo atualizado com sucesso.' })
      setEditingId(null)
      fetchCalculos()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cálculo?')) return

    const { error } = await supabase.from('calculos_roi').delete().eq('id', id)

    if (error) {
      toast({ title: 'Erro', description: 'Falha ao excluir cálculo.', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Cálculo excluído.' })
      fetchCalculos()
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8 text-green-600" />
            Meus Cálculos
          </h1>
          <p className="text-gray-600 mt-1">Histórico de projeções de ROI salvas.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/roi">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Calculadora
            </Link>
          </Button>
          <Button
            onClick={handleExportPDF}
            disabled={calculos.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : calculos.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Nenhum cálculo salvo encontrado.</p>
              <Button asChild variant="link" className="mt-2 text-green-600">
                <Link to="/roi">Criar meu primeiro cálculo</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cultura</TableHead>
                    <TableHead className="text-right">Custo</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead className="text-right">Payback (meses)</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculos.map((calc) => (
                    <TableRow key={calc.id}>
                      <TableCell>{format(new Date(calc.data_criacao), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="font-medium">{calc.cultura || '-'}</TableCell>
                      <TableCell className="text-right text-red-600 font-medium">
                        {calc.custo_producao.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {calc.receita_esperada.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${calc.roi_percentual >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {calc.roi_percentual > 0 ? '+' : ''}
                        {calc.roi_percentual.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">{calc.payback_meses.toFixed(1)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(calc)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(calc.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Cálculo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cultura">Cultura</Label>
              <Input
                id="cultura"
                value={formData.cultura}
                onChange={(e) => setFormData({ ...formData, cultura: e.target.value })}
                placeholder="Ex: Soja, Milho"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="custo">Custo Total (R$)</Label>
              <Input
                id="custo"
                type="number"
                value={formData.custo_producao || ''}
                onChange={(e) =>
                  setFormData({ ...formData, custo_producao: Number(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="receita">Receita Esperada (R$)</Label>
              <Input
                id="receita"
                type="number"
                value={formData.receita_esperada || ''}
                onChange={(e) =>
                  setFormData({ ...formData, receita_esperada: Number(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tempo">Tempo de Retorno (meses)</Label>
              <Input
                id="tempo"
                type="number"
                value={formData.tempo_retorno || ''}
                onChange={(e) =>
                  setFormData({ ...formData, tempo_retorno: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MeusCalculos
