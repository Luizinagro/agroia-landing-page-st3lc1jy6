import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

export function CrmTasks() {
  const tasks = [
    { id: 1, title: 'Ligar para João sobre renovação', done: false, date: 'Hoje' },
    { id: 2, title: 'Revisar metas do trimestre', done: true, date: 'Ontem' },
    { id: 3, title: 'Enviar proposta comercial AgroTech', done: false, date: 'Amanhã' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Tarefas</CardTitle>
        <CardDescription>Acompanhe suas atividades e retornos programados.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-white/[0.01]"
            >
              <div className="flex items-center space-x-3">
                <Checkbox id={`task-${task.id}`} checked={task.done} />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`text-sm font-medium ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                >
                  {task.title}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">{task.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
