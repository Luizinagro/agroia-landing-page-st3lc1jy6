import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CloudOff } from 'lucide-react'
import { BillingInvoices } from '@/components/billing/BillingInvoices'
import { BillingReports } from '@/components/billing/BillingReports'
import { BillingProjections } from '@/components/billing/BillingProjections'

export default function Billing() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-primary/30">
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row items-start justify-between gap-4 glass-panel p-6 rounded-2xl border-primary/20">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Faturamento Agro
            </h1>
            <p className="text-[#A0A0A0] text-lg font-medium">
              Gerencie suas notas, analise relatórios e projete seus resultados.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(29,185,84,0.1)] animate-pulse w-fit font-bold shrink-0">
            <CloudOff className="w-4 h-4" />
            <span>Sincronizar quando conectar</span>
          </div>
        </header>

        <Tabs defaultValue="notas" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-[#050505] p-1 border border-primary/20 h-auto md:h-12 mb-8 rounded-xl gap-1">
            <TabsTrigger
              value="notas"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              Notas Fiscais
            </TabsTrigger>
            <TabsTrigger
              value="relatorios"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              Relatórios Fiscais
            </TabsTrigger>
            <TabsTrigger
              value="projecoes"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              Projeções Financeiras
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="notas"
            className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <BillingInvoices />
          </TabsContent>

          <TabsContent
            value="relatorios"
            className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <BillingReports />
          </TabsContent>

          <TabsContent
            value="projecoes"
            className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <BillingProjections />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
