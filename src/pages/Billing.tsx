import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CloudOff } from 'lucide-react'
import { BillingInvoices } from '@/components/billing/BillingInvoices'
import { BillingReports } from '@/components/billing/BillingReports'
import { BillingProjections } from '@/components/billing/BillingProjections'

export default function Billing() {
  return (
    <div className="min-h-screen bg-agro-green text-white font-sans selection:bg-agro-yellow/30">
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Faturamento Agro
            </h1>
            <p className="text-white/70 text-lg">
              Gerencie suas notas, analise relatórios e projete seus resultados.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-agro-yellow/90 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-sm animate-pulse w-fit">
            <CloudOff className="w-4 h-4" />
            <span className="font-medium">Sincronizar quando conectar</span>
          </div>
        </header>

        <Tabs defaultValue="notas" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-white/5 p-1 border border-white/10 h-auto md:h-12 mb-8 rounded-xl gap-1">
            <TabsTrigger
              value="notas"
              className="rounded-lg data-[state=active]:bg-agro-yellow data-[state=active]:text-agro-green py-2.5 text-white/80 transition-all"
            >
              Notas Fiscais
            </TabsTrigger>
            <TabsTrigger
              value="relatorios"
              className="rounded-lg data-[state=active]:bg-agro-yellow data-[state=active]:text-agro-green py-2.5 text-white/80 transition-all"
            >
              Relatórios Fiscais
            </TabsTrigger>
            <TabsTrigger
              value="projecoes"
              className="rounded-lg data-[state=active]:bg-agro-yellow data-[state=active]:text-agro-green py-2.5 text-white/80 transition-all"
            >
              Projeções Financeiras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notas" className="mt-0 outline-none">
            <BillingInvoices />
          </TabsContent>

          <TabsContent value="relatorios" className="mt-0 outline-none">
            <BillingReports />
          </TabsContent>

          <TabsContent value="projecoes" className="mt-0 outline-none">
            <BillingProjections />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
