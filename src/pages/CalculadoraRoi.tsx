import { SEO } from '@/components/SEO'
import { Tractor, ArrowLeft, TrendingUp, BarChart3, LineChart, PieChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CalculadoraRoi() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans animate-in fade-in duration-500">
      <SEO
        title="Calculadora de ROI"
        description="Calcule o retorno sobre investimento da sua safra."
      />

      <header className="sticky top-0 z-50 w-full bg-[#1a3c34]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a3c34]/80 border-b border-white/10 shadow-sm">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <TrendingUp className="w-6 h-6 text-[#f4d03f]" />
            <span>Calculadora de ROI</span>
          </div>
          <nav className="ml-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:bg-white/10 hover:text-[#f4d03f]"
            >
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-6 py-8 mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a3c34] flex items-center gap-3 mb-2">
            Projeção Financeira e ROI
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Utilize nossa inteligência artificial para projetar o retorno dos seus investimentos em
            insumos e maquinários com base em dados históricos e tendências de mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>Investimentos</CardTitle>
              <CardDescription>Simule custos de produção</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-800">R$ 0,00</p>
              <p className="text-sm text-muted-foreground mt-1">Nenhum dado inserido</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <LineChart className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle>Receita Estimada</CardTitle>
              <CardDescription>Projeção de safra/produção</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-800">R$ 0,00</p>
              <p className="text-sm text-muted-foreground mt-1">Baseado na cotação atual</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-green-50/50">
            <CardHeader className="pb-2">
              <PieChart className="w-8 h-8 text-[#1a3c34] mb-2" />
              <CardTitle>ROI Projetado</CardTitle>
              <CardDescription>Retorno sobre o Investimento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">0%</p>
              <p className="text-sm text-green-600/80 mt-1">Aguardando dados...</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
          <Tractor className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Simulador em Construção</h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            A ferramenta completa de cálculo de ROI está sendo calibrada com os dados de mercado
            mais recentes para oferecer precisão máxima para a sua propriedade.
          </p>
          <Button disabled className="bg-[#1a3c34]">
            Iniciar Simulação
          </Button>
        </div>
      </main>
    </div>
  )
}
