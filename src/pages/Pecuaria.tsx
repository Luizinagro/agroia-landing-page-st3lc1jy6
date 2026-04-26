import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MercadoCepea } from '@/components/pecuaria/MercadoCepea'
import { Rebanho } from '@/components/pecuaria/Rebanho'
import { RastreabilidadeEsg } from '@/components/pecuaria/RastreabilidadeEsg'
import { LayoutDashboard, TrendingUp, Leaf, Tag } from 'lucide-react'
import { GestaoAnimais } from '@/components/pecuaria/GestaoAnimais'
import { AlertasCio } from '@/components/pecuaria/AlertasCio'

export default function Pecuaria() {
  const [activeTab, setActiveTab] = useState('rebanho')

  return (
    <div className="p-2 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Gestão Pecuária</h1>
          <p className="text-muted-foreground mt-1">
            Controle completo do rebanho, mercado e sustentabilidade.
          </p>
        </div>
      </div>

      <AlertasCio />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 lg:w-[800px] bg-black/60 border border-primary/20 backdrop-blur-md p-1 h-auto">
          <TabsTrigger
            value="rebanho"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2.5"
          >
            <LayoutDashboard className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Rebanho</span>
          </TabsTrigger>
          <TabsTrigger
            value="animais"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2.5"
          >
            <Tag className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Animais</span>
          </TabsTrigger>
          <TabsTrigger
            value="mercado"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2.5"
          >
            <TrendingUp className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Mercado CEPEA</span>
          </TabsTrigger>
          <TabsTrigger
            value="esg"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2.5"
          >
            <Leaf className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">ESG</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 min-h-[500px]">
          {/* Explicitly using && guarantees components are unmounted, freeing resources and making transitions immediate */}
          <TabsContent value="rebanho" className="m-0 focus-visible:outline-none">
            {activeTab === 'rebanho' && <Rebanho />}
          </TabsContent>
          <TabsContent value="animais" className="m-0 focus-visible:outline-none">
            {activeTab === 'animais' && <GestaoAnimais />}
          </TabsContent>
          <TabsContent value="mercado" className="m-0 focus-visible:outline-none">
            {activeTab === 'mercado' && <MercadoCepea />}
          </TabsContent>
          <TabsContent value="esg" className="m-0 focus-visible:outline-none">
            {activeTab === 'esg' && <RastreabilidadeEsg />}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
