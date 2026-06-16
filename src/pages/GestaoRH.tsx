import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase } from 'lucide-react'
import { DashboardRH } from '@/components/rh/DashboardRH'
import { FuncionariosTab } from '@/components/rh/FuncionariosTab'
import { PontoTab } from '@/components/rh/PontoTab'
import { AtividadesTab } from '@/components/rh/AtividadesTab'
import { RelatorioTab } from '@/components/rh/RelatorioTab'

export default function GestaoRH() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">RH Rural</h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Gestão de equipe, ponto diário e controle de atividades
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 w-full flex flex-wrap h-auto sm:h-12 mb-6">
          <TabsTrigger
            value="dashboard"
            className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="funcionarios"
            className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
          >
            Funcionários
          </TabsTrigger>
          <TabsTrigger
            value="ponto"
            className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
          >
            Ponto Diário
          </TabsTrigger>
          <TabsTrigger
            value="atividades"
            className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
          >
            Atividades
          </TabsTrigger>
          <TabsTrigger
            value="relatorios"
            className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
          >
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-0">
          <DashboardRH />
        </TabsContent>
        <TabsContent value="funcionarios" className="mt-0">
          <FuncionariosTab />
        </TabsContent>
        <TabsContent value="ponto" className="mt-0">
          <PontoTab />
        </TabsContent>
        <TabsContent value="atividades" className="mt-0">
          <AtividadesTab />
        </TabsContent>
        <TabsContent value="relatorios" className="mt-0">
          <RelatorioTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
