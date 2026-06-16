import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useToast } from '@/hooks/use-toast'
import { rhService } from '@/services/gestao-rh'
import { FileText } from 'lucide-react'

export function RelatorioTab() {
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())
  const [relatorio, setRelatorio] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleGerar = async () => {
    setLoading(true)
    try {
      const res = await rhService.call('relatorio_mensal', { mes, ano })
      setRelatorio(res)
      toast({ title: 'Sucesso', description: 'Relatório gerado com sucesso.' })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const mesesStr = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <div className="space-y-2 w-full sm:w-48">
          <Label className="text-zinc-400">Mês</Label>
          <Select value={mes.toString()} onValueChange={(v) => setMes(Number(v))}>
            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
              {mesesStr.map((m, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 w-full sm:w-32">
          <Label className="text-zinc-400">Ano</Label>
          <Input
            type="number"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="bg-zinc-950 border-zinc-800 text-white"
          />
        </div>
        <Button onClick={handleGerar} disabled={loading} className="w-full sm:w-auto">
          <FileText className="w-4 h-4 mr-2" /> {loading ? 'Gerando...' : 'Gerar Relatório'}
        </Button>
      </div>

      {relatorio && (
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 shadow-sm">
          <Table>
            <TableHeader className="bg-zinc-900">
              <TableRow>
                <TableHead className="text-zinc-400">Funcionário</TableHead>
                <TableHead className="text-zinc-400">Função</TableHead>
                <TableHead className="text-zinc-400 text-center">Dias Trab.</TableHead>
                <TableHead className="text-zinc-400 text-center">Horas Totais</TableHead>
                <TableHead className="text-zinc-400 text-center">Horas Extras</TableHead>
                <TableHead className="text-zinc-400 text-center">Nº Atividades</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorio.funcionarios?.map((f: any) => (
                <TableRow key={f.funcionario.id} className="border-zinc-800">
                  <TableCell className="text-white font-medium">{f.funcionario.nome}</TableCell>
                  <TableCell className="text-zinc-400">{f.funcionario.funcao}</TableCell>
                  <TableCell className="text-center text-zinc-300">{f.dias_trabalhados}</TableCell>
                  <TableCell className="text-center text-zinc-300">{f.horas_totais}h</TableCell>
                  <TableCell className="text-center text-primary font-medium">
                    {f.horas_extras > 0 ? `${f.horas_extras}h` : '-'}
                  </TableCell>
                  <TableCell className="text-center text-zinc-300">{f.total_atividades}</TableCell>
                </TableRow>
              ))}
              {(!relatorio.funcionarios || relatorio.funcionarios.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                    Nenhum dado encontrado para o período selecionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="bg-zinc-900 p-5 border-t border-zinc-800 flex justify-between items-center">
            <div>
              <p className="text-zinc-400 text-sm">Resumo do Mês</p>
              <p className="font-medium text-white text-lg">Folha Salarial Estimada (Base):</p>
            </div>
            <span className="text-2xl font-bold text-primary">
              R$ {relatorio.total_folha?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
