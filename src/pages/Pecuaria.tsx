import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalculadoraRacao } from '@/components/pecuaria/CalculadoraRacao'
import { RastreabilidadeEsg } from '@/components/pecuaria/RastreabilidadeEsg'
import { MercadoCepea } from '@/components/pecuaria/MercadoCepea'
import { Reproducao } from '@/components/pecuaria/Reproducao'
import { Tractor, ArrowLeft } from 'lucide-react'

export default function Pecuaria() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 w-full bg-agro-green text-white border-b border-white/10 shadow-sm">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-agro-yellow">
            <Tractor className="w-6 h-6" />
            <span>AgroIA Pecuária</span>
          </div>
          <nav className="ml-auto flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium hover:text-agro-yellow transition-colors flex items-center gap-2 text-white/90"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Início
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-6 py-8 mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-agro-green mb-2">
            Gestão de Pecuária
          </h1>
          <p className="text-muted-foreground">
            Otimize sua produção, rastreie certificações ESG e acompanhe o mercado em tempo real.
          </p>
        </div>

        <Tabs defaultValue="calculadora" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted rounded-xl mb-8">
            <TabsTrigger
              value="calculadora"
              className="py-3 text-sm data-[state=active]:bg-agro-green data-[state=active]:text-white rounded-lg transition-all"
            >
              Calculadora Ração
            </TabsTrigger>
            <TabsTrigger
              value="esg"
              className="py-3 text-sm data-[state=active]:bg-agro-green data-[state=active]:text-white rounded-lg transition-all"
            >
              Rastreabilidade ESG
            </TabsTrigger>
            <TabsTrigger
              value="cepea"
              className="py-3 text-sm data-[state=active]:bg-agro-green data-[state=active]:text-white rounded-lg transition-all"
            >
              Mercado CEPEA
            </TabsTrigger>
            <TabsTrigger
              value="reproducao"
              className="py-3 text-sm data-[state=active]:bg-agro-green data-[state=active]:text-white rounded-lg transition-all"
            >
              Reprodução
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent
              value="calculadora"
              className="m-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <CalculadoraRacao />
            </TabsContent>
            <TabsContent
              value="esg"
              className="m-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <RastreabilidadeEsg />
            </TabsContent>
            <TabsContent
              value="cepea"
              className="m-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <MercadoCepea />
            </TabsContent>
            <TabsContent
              value="reproducao"
              className="m-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <Reproducao />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
