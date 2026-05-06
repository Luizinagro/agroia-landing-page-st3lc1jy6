import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Check, CloudRain, Sun, Loader2, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

export function AgendaManejo() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novaData, setNovaData] = useState('')

  useEffect(() => {
    if (user) fetchTasks()
  }, [user])

  const fetchTasks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('agenda_manejo' as any)
      .select('*')
      .eq('user_id', user?.id)
      .order('data_prevista', { ascending: true })

    if (data) setTasks(data)
    setLoading(false)
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoTitulo || !novaData) return

    // Simulando checagem de clima
    const dataTask = new Date(novaData)
    const hoje = new Date()
    const isChuva = Math.random() > 0.6 // 40% chance de chuva
    const diffTime = dataTask.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let alertaClima = false
    if (diffDays >= 0 && diffDays <= 7 && isChuva) {
      alertaClima = true
      toast({
        title: 'Aviso Climático 🌧️',
        description:
          'Previsão de chuva para a data selecionada. O sistema não recomenda aplicações de defensivos.',
        variant: 'destructive',
      })
    }

    const { error } = await supabase.from('agenda_manejo' as any).insert({
      user_id: user?.id,
      titulo: novoTitulo,
      data_prevista: novaData,
      clima_recomendado: !alertaClima,
    })

    if (!error) {
      setNovoTitulo('')
      setNovaData('')
      fetchTasks()
      toast({ title: 'Atividade adicionada com sucesso!' })
    }
  }

  const toggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Concluído' ? 'Pendente' : 'Concluído'
    await supabase
      .from('agenda_manejo' as any)
      .update({ status: newStatus })
      .eq('id', id)
    fetchTasks()
  }

  const deleteTask = async (id: string) => {
    await supabase
      .from('agenda_manejo' as any)
      .delete()
      .eq('id', id)
    fetchTasks()
  }

  return (
    <div className="bg-[#050505] p-6 rounded-2xl border border-white/10 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Agenda Inteligente de Manejo</h2>

      <form onSubmit={addTask} className="flex gap-4 mb-6">
        <Input
          placeholder="Qual a próxima atividade?"
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          className="flex-1 bg-black/50"
        />
        <Input
          type="date"
          value={novaData}
          onChange={(e) => setNovaData(e.target.value)}
          className="w-40 bg-black/50"
        />
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-black">
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-zinc-500 text-center py-4">Nenhuma atividade agendada.</p>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 rounded-xl border ${task.status === 'Concluído' ? 'border-primary/20 bg-primary/5' : 'border-white/10 bg-black/40'} transition-all`}
            >
              <button
                onClick={() => toggleTask(task.id, task.status)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.status === 'Concluído' ? 'bg-primary border-primary text-black' : 'border-zinc-500'}`}
              >
                {task.status === 'Concluído' && <Check className="w-4 h-4" />}
              </button>

              <div className="flex-1">
                <h3
                  className={`font-medium ${task.status === 'Concluído' ? 'text-zinc-400 line-through' : 'text-white'}`}
                >
                  {task.titulo}
                </h3>
                <p className="text-sm text-zinc-500">
                  Data: {new Date(task.data_prevista).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {task.clima_recomendado === false && task.status !== 'Concluído' && (
                <div
                  className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1 border border-red-500/30"
                  title="Previsão de chuva. Evite aplicações."
                >
                  <CloudRain className="w-3 h-3" /> Risco Chuva
                </div>
              )}
              {task.clima_recomendado === true && task.status !== 'Concluído' && (
                <div
                  className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30"
                  title="Clima ideal para manejo."
                >
                  <Sun className="w-3 h-3" /> Clima Ideal
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
                className="text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
