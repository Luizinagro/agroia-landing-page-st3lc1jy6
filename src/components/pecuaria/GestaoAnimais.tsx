import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Activity,
  Tag,
  Info,
  Sparkles,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

interface Animal {
  id: string
  nome: string
  tipo: string
  raca: string
  data_nascimento: string
  peso_atual: number
  ultima_data_cio: string
  status: string
  proximo_cio_estimado?: string
  confianca_previsao?: number
  recomendacoes_ia?: string
}

export function GestaoAnimais() {
  const [animais, setAnimais] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [updatingAi, setUpdatingAi] = useState(false)
  const { toast } = useToast()

  const defaultForm = {
    id: '',
    nome: '',
    tipo: 'Gado',
    raca: '',
    data_nascimento: '',
    peso_atual: '',
    ultima_data_cio: '',
    status: 'Ativo',
  }
  const [formData, setFormData] = useState(defaultForm)

  const fetchAnimais = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from('animais')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAnimais(data as unknown as Animal[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAnimais()
  }, [])

  const handleSave = async () => {
    if (!formData.nome || !formData.tipo) {
      toast({ title: 'Preencha o nome e tipo', variant: 'destructive' })
      return
    }

    setSubmitting(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      let aiData = null
      if (formData.ultima_data_cio) {
        try {
          const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
            'calcular-cio',
            {
              body: {
                tipo: formData.tipo,
                ultima_data_cio: formData.ultima_data_cio,
                peso: formData.peso_atual,
                clima: { temperatura: 26, umidade: 65 }, // Simulated climate context
              },
            },
          )
          if (!aiError && aiResponse?.data) {
            aiData = aiResponse.data
          }
        } catch (e) {
          console.error('Erro ao chamar IA:', e)
        }
      }

      const payload = {
        nome: formData.nome,
        tipo: formData.tipo,
        raca: formData.raca,
        data_nascimento: formData.data_nascimento || null,
        peso_atual: Number(formData.peso_atual) || 0,
        ultima_data_cio: formData.ultima_data_cio || null,
        status: formData.status,
        ...(aiData && {
          proximo_cio_estimado: aiData.proximo_cio_estimado,
          confianca_previsao: aiData.confianca,
          recomendacoes_ia: aiData.recomendacoes,
        }),
      }

      let error
      if (formData.id) {
        const res = await supabase
          .from('animais')
          .update(payload as any)
          .eq('id', formData.id)
        error = res.error
      } else {
        const res = await supabase.from('animais').insert({ ...payload, user_id: user.id } as any)
        error = res.error
      }

      if (error) {
        toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
      } else {
        toast({ title: 'Animal salvo com sucesso!' })
        setOpen(false)
        fetchAnimais()
      }
    }
    setSubmitting(false)
  }

  const handleEdit = (animal: Animal) => {
    setFormData({
      id: animal.id,
      nome: animal.nome,
      tipo: animal.tipo,
      raca: animal.raca || '',
      data_nascimento: animal.data_nascimento || '',
      peso_atual: animal.peso_atual?.toString() || '',
      ultima_data_cio: animal.ultima_data_cio || '',
      status: animal.status || 'Ativo',
    })
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este animal?')) return
    const { error } = await supabase.from('animais').delete().eq('id', id)
    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' })
    } else {
      toast({ title: 'Animal excluído' })
      fetchAnimais()
    }
  }

  const handleAddNovo = () => {
    setFormData(defaultForm)
    setOpen(true)
  }

  const handleUpdateAllPredictions = async () => {
    setUpdatingAi(true)
    toast({
      title: 'Analisando rebanho...',
      description: 'A IA está recalculando as previsões de cio.',
    })

    let updatedCount = 0
    for (const animal of animais) {
      if (animal.ultima_data_cio) {
        try {
          const { data, error } = await supabase.functions.invoke('calcular-cio', {
            body: {
              tipo: animal.tipo,
              ultima_data_cio: animal.ultima_data_cio,
              peso: animal.peso_atual,
              clima: { temperatura: 26, umidade: 65 },
            },
          })

          if (!error && data?.data) {
            const aiData = data.data
            await supabase
              .from('animais')
              .update({
                proximo_cio_estimado: aiData.proximo_cio_estimado,
                confianca_previsao: aiData.confianca,
                recomendacoes_ia: aiData.recomendacoes,
              } as any)
              .eq('id', animal.id)
            updatedCount++
          }
        } catch (e) {
          console.error(e)
        }
      }
    }

    toast({
      title: 'Previsões Atualizadas',
      description: `${updatedCount} animais foram analisados com IA.`,
    })
    fetchAnimais()
    setUpdatingAi(false)
  }

  const getProximoCio = (tipo: string, ultimaData: string) => {
    if (!ultimaData) return 'Não registrado'
    const date = new Date(ultimaData)
    // Ciclo estral médio base para fallback visual (bovinos, equinos, suínos ~21 dias)
    date.setDate(date.getDate() + 21)
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-56 rounded-xl bg-primary/10" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Gestão Individual de Animais</h2>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpdateAllPredictions}
            disabled={updatingAi || animais.length === 0}
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          >
            {updatingAi ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sincronizar IA
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleAddNovo}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:opacity-90 font-bold border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Animal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border border-emerald-500/30 text-white sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{formData.id ? 'Editar Animal' : 'Cadastrar Animal'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label>Nome / Identificação</Label>
                  <Input
                    className="bg-zinc-900 border-zinc-800"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(val) => setFormData({ ...formData, tipo: val })}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                      <SelectItem value="Gado">Gado</SelectItem>
                      <SelectItem value="Suíno">Suíno</SelectItem>
                      <SelectItem value="Cavalo">Cavalo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Raça</Label>
                  <Input
                    className="bg-zinc-900 border-zinc-800"
                    value={formData.raca}
                    onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    className="bg-zinc-900 border-zinc-800"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Peso Atual (kg)</Label>
                  <Input
                    type="number"
                    className="bg-zinc-900 border-zinc-800"
                    value={formData.peso_atual}
                    onChange={(e) => setFormData({ ...formData, peso_atual: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Última Data de Cio</Label>
                  <Input
                    type="date"
                    className="bg-zinc-900 border-zinc-800"
                    value={formData.ultima_data_cio}
                    onChange={(e) => setFormData({ ...formData, ultima_data_cio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Prenhe">Prenhe</SelectItem>
                      <SelectItem value="Lactação">Lactação</SelectItem>
                      <SelectItem value="Em Tratamento">Em Tratamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-zinc-800 text-white hover:bg-zinc-900"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={submitting}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
                >
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animais.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800/50 flex flex-col items-center">
            <Info className="w-8 h-8 mb-2 opacity-50" />
            <p>Nenhum animal cadastrado no rebanho.</p>
          </div>
        ) : (
          animais.map((animal) => (
            <div
              key={animal.id}
              className="bg-gradient-to-br from-emerald-500 to-blue-600 p-[1px] rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
            >
              <div className="bg-black p-5 rounded-xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">{animal.nome}</h3>
                      <p className="text-zinc-400 text-sm">{animal.raca || 'Raça não informada'}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-emerald-400">
                      {animal.tipo}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-zinc-300">
                      <Activity className="w-4 h-4 mr-2 text-blue-400" />
                      <span>
                        Peso: <strong className="text-white">{animal.peso_atual || '--'} kg</strong>
                      </span>
                    </div>
                    <div className="flex items-center text-zinc-300">
                      <Calendar className="w-4 h-4 mr-2 text-rose-400" />
                      <span>
                        Próximo Cio:{' '}
                        <strong className="text-white">
                          {animal.proximo_cio_estimado
                            ? new Date(animal.proximo_cio_estimado).toLocaleDateString('pt-BR', {
                                timeZone: 'UTC',
                              })
                            : getProximoCio(animal.tipo, animal.ultima_data_cio)}
                        </strong>
                      </span>
                    </div>

                    {animal.confianca_previsao && (
                      <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center text-emerald-400 text-xs font-bold mb-1.5">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Previsão IA (Confiança: {animal.confianca_previsao}%)
                        </div>
                        <p
                          className="text-xs text-zinc-400 leading-relaxed"
                          title={animal.recomendacoes_ia}
                        >
                          {animal.recomendacoes_ia}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center text-zinc-300 pt-1">
                      <Tag className="w-4 h-4 mr-2 text-amber-400" />
                      <span>
                        Status: <strong className="text-white">{animal.status || 'Ativo'}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-zinc-800/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={() => handleEdit(animal)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
                    onClick={() => handleDelete(animal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
