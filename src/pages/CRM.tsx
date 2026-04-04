import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CrmOverview } from '@/components/crm/CrmOverview'
import { CrmLeads } from '@/components/crm/CrmLeads'
import { CrmTasks } from '@/components/crm/CrmTasks'
import { CrmInventory } from '@/components/crm/CrmInventory'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function CRM() {
  const { user } = useAuth() as any
  const isAdmin = user?.user_type === 'admin' || user?.tipo_usuario === 'admin'

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-background text-foreground font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">CRM & Gestão</h2>
          <p className="text-muted-foreground mt-1">Centro de comando administrativo da AgroIA.</p>
        </div>
        <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold transition-colors">
          Exportar Relatório
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[#050505] border border-white/5 overflow-x-auto w-full md:w-auto flex-nowrap scrollbar-hide justify-start">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="leads">Leads e Vendas</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="inventory">Estoque de Insumos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CrmOverview />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <CrmLeads />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <CrmTasks />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <CrmInventory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
