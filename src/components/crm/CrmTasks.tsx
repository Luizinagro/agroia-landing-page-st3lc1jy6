import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Edit2, Check, X, Loader2, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Task {
  id: string
  title: string
  status: 'pendente' | 'concluida'
  assigned_by?: string
  assigned_by_name?: string
  user_id: string
}

export function CrmTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamUsers, setTeamUsers] = useState<{ id: string; name: string; email: string }[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedAssignee, setSelectedAssignee] = useState<string>('me')
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return
      setCurrentUser(session.user)

      // Fetch users for the assignment dropdown
      const { data: usersData } = await supabase.from('users').select('id, name, email, user_type')
      if (usersData) setTeamUsers(usersData)

      const currentUserData = usersData?.find((u) => u.id === session.user.id)
      const isAdmin = currentUserData?.user_type === 'admin'

      let query = supabase.from('crm_tasks').select('*').order('created_at', { ascending: false })

      // If not admin, show tasks assigned TO me or BY me
      if (!isAdmin) {
        query = query.or(`user_id.eq.${session.user.id},assigned_by.eq.${session.user.id}`)
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
      if (!currentUser) throw new Error('Usuário não autenticado')

      const assignToId = selectedAssignee === 'me' ? currentUser.id : selectedAssignee
      const currentUserName =
        teamUsers.find((u) => u.id === currentUser.id)?.name || currentUser.email

      const { data, error } = await supabase
        .from('crm_tasks')
        .insert([
          {
            title: newTask.trim(),
            user_id: assignToId,
            status: 'pendente',
            assigned_by: currentUser.id,
            assigned_by_name: currentUserName,
          },
        ])
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
      fetchData()
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
      fetchData()
      toast({ title: 'Erro ao atualizar tarefa', variant: 'destructive' })
    }
  }

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader className="pb-4 border-b border-primary/10">
        <CardTitle className="text-lg">Gestão de Tarefas</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="O que precisa ser feito?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="bg-black/40 border-primary/20 focus-visible:ring-primary flex-1"
          />
          <div className="flex gap-2">
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="w-[140px] sm:w-[180px] bg-black/40 border-primary/20">
                <SelectValue placeholder="Atribuir a..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="me">Para mim</SelectItem>
                {teamUsers
                  .filter((u) => u.id !== currentUser?.id)
                  .map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name || u.email}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              size="icon"
              className="shrink-0 bg-primary text-black hover:bg-primary/90"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
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
                className="flex items-start sm:items-center gap-3 p-3 rounded-lg bg-black/60 border border-primary/10 group hover:border-primary/40 transition-colors shadow-sm"
              >
                <Checkbox
                  checked={task.status === 'concluida'}
                  onCheckedChange={() => toggleTask(task)}
                  className="w-5 h-5 mt-1 sm:mt-0 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-black"
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
                    <div className="flex-1 flex flex-col gap-1">
                      <span
                        className={`text-sm transition-all ${task.status === 'concluida' ? 'line-through text-muted-foreground opacity-70' : 'text-foreground font-medium'}`}
                      >
                        {task.title}
                      </span>

                      {(task.assigned_by && task.assigned_by !== currentUser?.id) ||
                      task.user_id !== currentUser?.id ? (
                        <div className="flex flex-wrap gap-2 mt-0.5">
                          {task.assigned_by && task.assigned_by !== currentUser?.id && (
                            <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full w-fit">
                              <User className="w-3 h-3" />
                              Enviado por{' '}
                              {task.assigned_by_name ||
                                teamUsers.find((u) => u.id === task.assigned_by)?.name ||
                                'Colega'}
                            </span>
                          )}
                          {task.user_id !== currentUser?.id && (
                            <span className="text-[10px] sm:text-xs text-primary/70 flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                              <User className="w-3 h-3" />
                              Atribuído a{' '}
                              {teamUsers.find((u) => u.id === task.user_id)?.name || 'Colega'}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
