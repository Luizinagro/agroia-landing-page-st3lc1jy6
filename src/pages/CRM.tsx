import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ShieldAlert, LayoutDashboard, Users, Kanban, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CrmOverview } from '@/components/crm/CrmOverview'
import { CrmLeads } from '@/components/crm/CrmLeads'
import { CrmPipeline } from '@/components/crm/CrmPipeline'
import { CrmReports } from '@/components/crm/CrmReports'

export default function CRM() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isAdmin = user?.user_type === 'admin' || user?.tipo_usuario === 'admin'

  useEffect(() => {
    if (user && !isAdmin) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, isAdmin, navigate])

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
        <p className="text-zinc-400 mb-6 max-w-md">
          Você não tem permissão para acessar esta página. Esta área é exclusiva para
          administradores.
        </p>
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-primary text-black hover:bg-primary/90 rounded-full font-bold"
        >
          Voltar ao Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">CRM AgroIA</h1>
        <p className="text-zinc-400">
          Central de vendas, relacionamento com produtores e métricas de conversão.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-black/40 border border-white/10 p-1 mb-6 flex flex-wrap h-auto w-full md:w-auto md:inline-flex justify-start">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-black flex items-center gap-2 flex-1 md:flex-none"
          >
            <LayoutDashboard className="w-4 h-4 hidden sm:block" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className="data-[state=active]:bg-primary data-[state=active]:text-black flex items-center gap-2 flex-1 md:flex-none"
          >
            <Users className="w-4 h-4 hidden sm:block" />
            Base de Leads
          </TabsTrigger>
          <TabsTrigger
            value="pipeline"
            className="data-[state=active]:bg-primary data-[state=active]:text-black flex items-center gap-2 flex-1 md:flex-none"
          >
            <Kanban className="w-4 h-4 hidden sm:block" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-black flex items-center gap-2 flex-1 md:flex-none"
          >
            <BarChart3 className="w-4 h-4 hidden sm:block" />
            Receita & Conversão
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 outline-none animate-fade-in">
          <CrmOverview />
        </TabsContent>

        <TabsContent value="leads" className="mt-0 outline-none animate-fade-in">
          <CrmLeads />
        </TabsContent>

        <TabsContent value="pipeline" className="mt-0 outline-none animate-fade-in">
          <CrmPipeline />
        </TabsContent>

        <TabsContent value="reports" className="mt-0 outline-none animate-fade-in">
          <CrmReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
