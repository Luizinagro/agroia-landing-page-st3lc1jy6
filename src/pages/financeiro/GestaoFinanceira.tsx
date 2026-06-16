import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import DashboardTab from './DashboardTab'
import LancamentosTab from './LancamentosTab'
import FluxoCaixaTab from './FluxoCaixaTab'
import CustoProducaoTab from './CustoProducaoTab'

export default function GestaoFinanceira() {
  const [hasPropriedade, setHasPropriedade] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const { user } = useAuth() as any

  useEffect(() => {
    if (user?.id) {
      supabase
        .from('propriedades')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .then(({ data }) => {
          setHasPropriedade(!!data && data.length > 0)
        })
    }
  }, [user?.id])

  return (
    <div className="container max-w-7xl py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Gestão Financeira</h1>
          <p className="text-zinc-400 mt-1">
            Acompanhe e projete a saúde financeira da sua fazenda.
          </p>
        </div>
        <Button
          onClick={() => setRefreshKey((k) => k + 1)}
          variant="outline"
          className="gap-2 bg-zinc-950 border-zinc-800 text-zinc-300"
        >
          <RefreshCw className="w-4 h-4" /> Atualizar dados
        </Button>
      </div>

      {!hasPropriedade && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-lg flex items-center gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Cadastre sua propriedade para ver dados da sua região.</p>
          <Link to="/perfil" className="ml-auto text-sm font-semibold hover:underline">
            Cadastrar Propriedade →
          </Link>
        </div>
      )}

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 h-12 w-full md:w-auto overflow-x-auto flex flex-nowrap justify-start">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="lancamentos"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6"
          >
            Contas a Pagar / Receber
          </TabsTrigger>
          <TabsTrigger
            value="fluxo"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6"
          >
            Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger
            value="custo"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6"
          >
            Custo de Produção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab refreshKey={refreshKey} />
        </TabsContent>
        <TabsContent value="lancamentos">
          <LancamentosTab refreshKey={refreshKey} />
        </TabsContent>
        <TabsContent value="fluxo">
          <FluxoCaixaTab refreshKey={refreshKey} />
        </TabsContent>
        <TabsContent value="custo">
          <CustoProducaoTab />
        </TabsContent>
      </Tabs>

      <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-400">AgroIA v1.0.0</span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Status: Online
          </span>
        </div>
        <div className="mt-4 md:mt-0">
          <a href="#" className="hover:text-primary transition-colors">
            Suporte Técnico
          </a>
        </div>
      </div>
    </div>
  )
}
