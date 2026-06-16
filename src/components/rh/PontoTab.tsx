import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { rhService } from '@/services/gestao-rh'
import { useToast } from '@/hooks/use-toast'

const DayEntry = ({ dia, ponto, onSave }: any) => {
  const [entrada, setEntrada] = useState(ponto?.hora_entrada || '')
  const [saida, setSaida] = useState(ponto?.hora_saida || '')

  useEffect(() => {
    setEntrada(ponto?.hora_entrada || '')
    setSaida(ponto?.hora_saida || '')
  }, [ponto])

  const handleBlur = () => {
    if (entrada !== (ponto?.hora_entrada || '') || saida !== (ponto?.hora_saida || '')) {
      onSave(dia, entrada, saida)
    }
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 space-y-3 hover:border-primary/50 transition-colors">
      <p className="font-medium text-zinc-300">Dia {dia}</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-zinc-500">Entrada</Label>
          <Input
            type="time"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            onBlur={handleBlur}
            className="bg-zinc-900 border-zinc-800 h-8 text-sm text-white px-2"
          />
        </div>
        <div>
          <Label className="text-xs text-zinc-500">Saída</Label>
          <Input
            type="time"
            value={saida}
            onChange={(e) => setSaida(e.target.value)}
            onBlur={handleBlur}
            className="bg-zinc-900 border-zinc-800 h-8 text-sm text-white px-2"
          />
        </div>
      </div>
      {ponto?.horas_trabalhadas > 0 && (
        <p className="text-xs text-primary font-medium text-right">{ponto.horas_trabalhadas}h</p>
      )}
    </div>
  )
}

export function PontoTab() {
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())
  const [pontos, setPontos] = useState<any[]>([])
  const [resumo, setResumo] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    rhService.call('listar_funcionarios', { ativo: true }).then(setFuncionarios)
  }, [])

  useEffect(() => {
    if (selectedId) {
      rhService.call('listar_ponto', { funcionario_id: selectedId, mes, ano }).then((res) => {
        setPontos(res.pontos || [])
        setResumo(res.resumo)
      })
    } else {
      setPontos([])
      setResumo(null)
    }
  }, [selectedId, mes, ano])

  const handleSavePonto = async (dia: number, hora_entrada: string, hora_saida: string) => {
    if (!selectedId) return
    const dataStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    try {
      await rhService.call('registrar_ponto', {
        funcionario_id: selectedId,
        data: dataStr,
        hora_entrada: hora_entrada || null,
        hora_saida: hora_saida || null,
      })
      toast({ title: 'Salvo', description: `Ponto atualizado.` })

      const res = await rhService.call('listar_ponto', { funcionario_id: selectedId, mes, ano })
      setPontos(res.pontos || [])
      setResumo(res.resumo)
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const diasNoMes = new Date(ano, mes, 0).getDate()
  const diasArray = Array.from({ length: diasNoMes }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <div className="space-y-2">
          <Label className="text-zinc-400">Funcionário</Label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
              {funcionarios.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-400">Mês</Label>
          <Select value={mes.toString()} onValueChange={(v) => setMes(Number(v))}>
            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <SelectItem key={m} value={m.toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-400">Ano</Label>
          <Input
            type="number"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="bg-zinc-950 border-zinc-800 text-white"
          />
        </div>
      </div>

      {selectedId && resumo && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-zinc-400 text-sm">Dias Trabalhados</p>
              <p className="text-2xl font-bold text-white">{resumo.dias_trabalhados}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Horas Totais</p>
              <p className="text-2xl font-bold text-white">{resumo.total_horas}h</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Horas Extras</p>
              <p className="text-2xl font-bold text-white">{resumo.horas_extras}h</p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {diasArray.map((dia) => {
            const dataStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
            const ponto = pontos.find((p) => p.data === dataStr)

            return <DayEntry key={dia} dia={dia} ponto={ponto} onSave={handleSavePonto} />
          })}
        </div>
      )}

      {!selectedId && (
        <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
          Selecione um funcionário para visualizar e editar o ponto.
        </div>
      )}
    </div>
  )
}
