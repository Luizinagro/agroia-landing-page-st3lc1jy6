import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, Syringe, Users, Loader2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { useToast } from '@/hooks/use-toast'

export function Rebanho() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    atencao: 0,
    lotes: [] as { tipo: string; quantidade: number }[],
  })

  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [novoRebanho, setNovoRebanho] = useState({
    tipo_animal: '',
    quantidade: '',
    status: 'Saudável',
  })
  const { toast } = useToast()

  const fetchRebanho = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data } = await supabase
      .from('rebanho')
      .select('tipo_animal, quantidade, status')
      .eq('user_id', userData.user.id)

    if (data) {
      let total = 0
      let atencao = 0
      const agrupado: Record<string, number> = {}

      data.forEach((item) => {
        total += Number(item.quantidade) || 0
        if (item.status === 'Em Tratamento' || item.status === 'Óbito') {
          atencao += Number(item.quantidade) || 0
        }
        agrupado[item.tipo_animal] =
          (agrupado[item.tipo_animal] || 0) + (Number(item.quantidade) || 0)
      })

      const lotes = Object.entries(agrupado)
        .map(([tipo, quantidade]) => ({ tipo, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade)

      setStats({ total, atencao, lotes })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRebanho()
  }, [])

  const handleAddRebanho = async () => {
    if (!novoRebanho.tipo_animal || !novoRebanho.quantidade) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' })
      return
    }

    setSubmitting(true)
    const { data: userData } = await supabase.auth.getUser()

    if (userData.user) {
      const { error } = await supabase.from('rebanho').insert({
        user_id: userData.user.id,
        tipo_animal: novoRebanho.tipo_animal,
        quantidade: Number(novoRebanho.quantidade),
        status: novoRebanho.status,
      })

      if (error) {
        toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
      } else {
        toast({ title: 'Rebanho adicionado com sucesso!' })
        setOpen(false)
        setNovoRebanho({ tipo_animal: '', quantidade: '', status: 'Saudável' })
        fetchRebanho()
      }
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center bg-black/40 rounded-xl border border-primary/10">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Carregando rebanho...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Visão Geral do Rebanho</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold w-full sm:w-auto shadow-[0_0_15px_rgba(29,185,84,0.2)]">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Rebanho
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border border-primary/20 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Lote / Animal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tipo de Animal (Ex: Bezerros Nelore)</Label>
                <Input
                  placeholder="Ex: Bezerros Nelore"
                  className="bg-black/50 border-primary/20"
                  value={novoRebanho.tipo_animal}
                  onChange={(e) => setNovoRebanho({ ...novoRebanho, tipo_animal: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantidade de Cabeças</Label>
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  className="bg-black/50 border-primary/20"
                  value={novoRebanho.quantidade}
                  onChange={(e) => setNovoRebanho({ ...novoRebanho, quantidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={novoRebanho.status}
                  onValueChange={(val) => setNovoRebanho({ ...novoRebanho, status: val })}
                >
                  <SelectTrigger className="bg-black/50 border-primary/20 text-white">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-primary/20 text-white">
                    <SelectItem value="Saudável">Saudável</SelectItem>
                    <SelectItem value="Em Tratamento">Em Tratamento</SelectItem>
                    <SelectItem value="Observação">Observação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-primary/20 text-white hover:bg-white/5"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddRebanho}
                disabled={submitting}
                className="bg-primary text-black hover:bg-primary/90 font-bold"
              >
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Cabeças
            </CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-primary/80 mt-1">Registrados no sistema</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ganho de Peso Médio
            </CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">---</div>
            <p className="text-xs text-primary/80 mt-1">Coleta pendente de IoT</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vacinas Pendentes
            </CardTitle>
            <Syringe className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">0</div>
            <p className="text-xs text-muted-foreground mt-1">Calendário em dia</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atenção Especial
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.atencao}</div>
            <p className="text-xs text-muted-foreground mt-1">Animais em tratamento</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-white">Distribuição por Lote / Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.lotes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum animal cadastrado no rebanho.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.lotes.map((lote, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-primary/10 hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium text-foreground capitalize">{lote.tipo}</span>
                  <span className="text-muted-foreground font-semibold">
                    {lote.quantidade} cabeças
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
