import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SEO } from '@/components/SEO'
import { Logo } from '@/components/ui/logo'
import { Suspense, lazy } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { FeatureGuard } from '@/components/FeatureGuard'

const CalculadoraRacao = lazy(() =>
  import('@/components/pecuaria/CalculadoraRacao').then((m) => ({ default: m.CalculadoraRacao })),
)
const RastreabilidadeEsg = lazy(() =>
  import('@/components/pecuaria/RastreabilidadeEsg').then((m) => ({
    default: m.RastreabilidadeEsg,
  })),
)
const MercadoCepea = lazy(() =>
  import('@/components/pecuaria/MercadoCepea').then((m) => ({ default: m.MercadoCepea })),
)
const Rebanho = lazy(() =>
  import('@/components/pecuaria/Rebanho').then((m) => ({ default: m.Rebanho })),
)

export default function Pecuaria() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col font-sans">
      <SEO
        title="Gestão de Pecuária"
        description="Manejo inteligente de rebanhos. Otimize custos com nutrição, garanta certificações ESG e monitore indicadores mercadológicos."
      />

      <main className="flex-1 container py-8 mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 bg-[#050505] p-6 rounded-2xl border border-[#1DB954]/20">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF] flex items-center gap-3">
              <Logo className="w-8 h-8 text-[#1DB954]" />
              Gestão de Pecuária
            </h1>
            <p className="text-[#E0E0E0] mt-2 text-lg font-medium">
              Manejo inteligente de rebanhos. Otimize custos com nutrição, garanta certificações ESG
              e monitore indicadores mercadológicos.
            </p>
          </div>
        </div>

        <Tabs defaultValue="calculadora" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-[#050505] border border-[#1DB954]/20 rounded-xl mb-8">
            <TabsTrigger
              value="calculadora"
              className="py-3 text-sm font-bold data-[state=active]:bg-[#1DB954] data-[state=active]:text-[#000000] text-[#E0E0E0] rounded-lg transition-all"
            >
              Calculadora Ração
            </TabsTrigger>
            <TabsTrigger
              value="esg"
              className="py-3 text-sm font-bold data-[state=active]:bg-[#1DB954] data-[state=active]:text-[#000000] text-[#E0E0E0] rounded-lg transition-all"
            >
              Rastreabilidade ESG
            </TabsTrigger>
            <TabsTrigger
              value="cepea"
              className="py-3 text-sm font-bold data-[state=active]:bg-[#1DB954] data-[state=active]:text-[#000000] text-[#E0E0E0] rounded-lg transition-all"
            >
              Mercado CEPEA
            </TabsTrigger>
            <TabsTrigger
              value="rebanho"
              className="py-3 text-sm font-bold data-[state=active]:bg-[#1DB954] data-[state=active]:text-[#000000] text-[#E0E0E0] rounded-lg transition-all"
            >
              Rebanho
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent
              value="calculadora"
              className="m-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-xl" />}>
                <CalculadoraRacao />
              </Suspense>
            </TabsContent>
            <TabsContent
              value="esg"
              className="m-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-xl" />}>
                <FeatureGuard feature="rastreabilidade" requiredPlan="Pecuário Solo ou Superior">
                  <RastreabilidadeEsg />
                </FeatureGuard>
              </Suspense>
            </TabsContent>
            <TabsContent
              value="cepea"
              className="m-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-xl" />}>
                <MercadoCepea />
              </Suspense>
            </TabsContent>
            <TabsContent
              value="rebanho"
              className="m-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-xl" />}>
                <Rebanho />
              </Suspense>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
