import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CrmOverview } from '@/components/crm/CrmOverview'
import { CrmLeads } from '@/components/crm/CrmLeads'
import { CrmTasks } from '@/components/crm/CrmTasks'
import { CrmInventory } from '@/components/crm/CrmInventory'
import { CrmPipeline } from '@/components/crm/CrmPipeline'
import { CrmReports } from '@/components/crm/CrmReports'
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
    <div className="min-h-screen bg-[#000000] flex flex-col font-sans">
      <main className="flex-1 container py-8 mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 glass-panel p-6 rounded-2xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              CRM & Gestão
            </h1>
            <p className="text-[#A0A0A0] mt-2 text-lg font-medium">
              Centro de comando administrativo da AgroIA.
            </p>
          </div>
          <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold transition-colors shrink-0">
            Exportar Relatório
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-[#050505] p-1 border border-primary/20 h-auto md:h-12 mb-8 rounded-xl gap-1">
            <TabsTrigger
              value="overview"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="leads"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              Leads e Vendas
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              Tarefas
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              Estoque de Insumos
            </TabsTrigger>
            <TabsTrigger
              value="pipeline"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              Pipeline
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              Relatórios
            </TabsTrigger>
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

          <TabsContent
            value="inventory"
            className="space-y-4 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <CrmInventory />
          </TabsContent>

          <TabsContent
            value="pipeline"
            className="space-y-4 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <CrmPipeline />
          </TabsContent>

          <TabsContent
            value="reports"
            className="space-y-4 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <CrmReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
