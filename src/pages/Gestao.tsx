import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AgendaManejo } from '@/components/gestao/AgendaManejo'
import { Estoque } from '@/components/gestao/Estoque'
import { Maquinario } from '@/components/gestao/Maquinario'
import { Calendar, Package, Tractor } from 'lucide-react'

export default function Gestao() {
  return (
    <div className="container mx-auto py-8 animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Gestão Operacional</h1>
        <p className="text-zinc-400 mt-2">
          Controle centralizado de suas atividades de campo, estoque de insumos e maquinário
          agrícola.
        </p>
      </div>

      <Tabs defaultValue="agenda" className="w-full">
        <TabsList className="bg-black/40 border border-white/10 p-1 mb-6 flex flex-wrap h-auto w-full md:w-auto md:inline-flex justify-start">
          <TabsTrigger
            value="agenda"
            className="data-[state=active]:bg-primary data-[state=active]:text-black flex items-center gap-2 flex-1 md:flex-none"
          >
            <Calendar className="w-4 h-4 hidden sm:block" />
            Agenda de Manejo
          </TabsTrigger>
          <TabsTrigger
            value="estoque"
            className="data-[state=active]:bg-primary data-[state=active]:text-black flex items-center gap-2 flex-1 md:flex-none"
          >
            <Package className="w-4 h-4 hidden sm:block" />
            Estoque
          </TabsTrigger>
          <TabsTrigger
            value="maquinario"
            className="data-[state=active]:bg-primary data-[state=active]:text-black flex items-center gap-2 flex-1 md:flex-none"
          >
            <Tractor className="w-4 h-4 hidden sm:block" />
            Maquinário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="mt-0 outline-none animate-fade-in">
          <AgendaManejo />
        </TabsContent>
        <TabsContent value="estoque" className="mt-0 outline-none animate-fade-in">
          <Estoque />
        </TabsContent>
        <TabsContent value="maquinario" className="mt-0 outline-none animate-fade-in">
          <Maquinario />
        </TabsContent>
      </Tabs>
    </div>
  )
}
