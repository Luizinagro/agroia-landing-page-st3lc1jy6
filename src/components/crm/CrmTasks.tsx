import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Task {
  id: string
  title: string
  status: 'pendente' | 'concluida'
}

export function CrmTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', session.user.id)
        .single()

      const isAdmin = userData?.user_type === 'admin'

      let query = supabase.from('crm_tasks').select('*').order('created_at', { ascending: false })
      if (!isAdmin) {
        query = query.eq('user_id', session.user.id)
      }

      const { data, error } = await query

      if (error) throw error
      setTasks(data || [])
    } catch (error: any) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('crm_tasks')
        .insert([{ title: newTask.trim(), user_id: session.user.id, status: 'pendente' }])
        .select()
        .single()

      if (error) throw error
      setTasks([data, ...tasks])
      setNewTask('')
      toast({ title: 'Tarefa adicionada com sucesso' })
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar tarefa',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  async function toggleTask(task: Task) {
    const newStatus = task.status === 'pendente' ? 'concluida' : 'pendente'
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)))

    try {
      const { error } = await supabase
        .from('crm_tasks')
        .update({ status: newStatus })
        .eq('id', task.id)
      if (error) throw error
    } catch (error: any) {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)))
      toast({ title: 'Erro ao atualizar tarefa', variant: 'destructive' })
    }
  }

  async function deleteTask(id: string) {
    try {
      setTasks(tasks.filter((t) => t.id !== id))
      const { error } = await supabase.from('crm_tasks').delete().eq('id', id)
      if (error) throw error
      toast({ title: 'Tarefa removida' })
    } catch (error: any) {
      fetchTasks()
      toast({ title: 'Erro ao remover tarefa', variant: 'destructive' })
    }
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) {
      setEditingId(null)
      return
    }
    try {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, title: editTitle } : t)))
      setEditingId(null)

      const { error } = await supabase.from('crm_tasks').update({ title: editTitle }).eq('id', id)
      if (error) throw error
    } catch (error: any) {
      fetchTasks()
      toast({ title: 'Erro ao atualizar tarefa', variant: 'destructive' })
    }
  }

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader className="pb-4 border-b border-primary/10">
        <CardTitle className="text-lg">Gestão de Tarefas</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <form onSubmit={addTask} className="flex gap-2">
          <Input
            placeholder="O que precisa ser feito?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="bg-black/40 border-primary/20 focus-visible:ring-primary"
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0 bg-primary text-black hover:bg-primary/90"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </form>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-primary/20 rounded-lg bg-black/20 text-muted-foreground">
            <p>Nenhuma tarefa pendente. Você está em dia!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-black/60 border border-primary/10 group hover:border-primary/40 transition-colors shadow-sm"
              >
                <Checkbox
                  checked={task.status === 'concluida'}
                  onCheckedChange={() => toggleTask(task)}
                  className="w-5 h-5 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-black"
                />

                {editingId === task.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-8 bg-black/80 text-sm"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10 shrink-0"
                      onClick={() => saveEdit(task.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:bg-white/5 shrink-0"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 text-sm transition-all ${task.status === 'concluida' ? 'line-through text-muted-foreground opacity-70' : 'text-foreground font-medium'}`}
                    >
                      {task.title}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-primary/70 hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          setEditingId(task.id)
                          setEditTitle(task.title)
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
