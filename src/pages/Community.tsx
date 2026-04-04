import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MessageSquare, PlayCircle, ShoppingBag, Tractor } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GamificationCard } from '@/components/community/GamificationCard'
import { SEO } from '@/components/SEO'
import { Suspense, lazy } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Logo } from '@/components/ui/logo'

const ForumTab = lazy(() =>
  import('@/components/community/ForumTab').then((m) => ({ default: m.ForumTab })),
)
const LiveTab = lazy(() =>
  import('@/components/community/LiveTab').then((m) => ({ default: m.LiveTab })),
)
const MarketplaceTab = lazy(() =>
  import('@/components/community/MarketplaceTab').then((m) => ({ default: m.MarketplaceTab })),
)

export default function Community() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col font-sans selection:bg-primary/30">
      <SEO
        title="Comunidade Agro-Futuro"
        description="Conecte-se, aprenda e faça negócios com outros produtores na rede AgroIA."
      />
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-primary/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-400 ease-bounce">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity text-white"
          >
            <Logo className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(29,185,84,0.6)]" />
            <span>AgroIA</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:text-primary hover:bg-primary/10 hidden sm:flex font-semibold"
              asChild
            >
              <Link to="/dashboard">Voltar ao Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 mx-auto space-y-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 glass-panel p-6 rounded-2xl mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Comunidade Agro-Futuro
            </h1>
            <p className="text-[#A0A0A0] mt-2 font-medium">
              Conecte-se, aprenda e faça negócios com outros produtores.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <GamificationCard />
          </div>
        </div>

        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-[#050505] p-1 border border-primary/20 h-auto md:h-12 mb-8 rounded-xl gap-1">
            <TabsTrigger
              value="forum"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Fórum
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Próxima Live
            </TabsTrigger>
            <TabsTrigger
              value="marketplace"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black py-2.5 text-white/80 transition-all font-bold"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="forum"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
          >
            <Suspense
              fallback={
                <Skeleton className="w-full h-[400px] rounded-xl bg-[#050505] border border-primary/20" />
              }
            >
              <ForumTab />
            </Suspense>
          </TabsContent>

          <TabsContent
            value="live"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
          >
            <Suspense
              fallback={
                <Skeleton className="w-full h-[400px] rounded-xl bg-[#050505] border border-primary/20" />
              }
            >
              <LiveTab />
            </Suspense>
          </TabsContent>

          <TabsContent
            value="marketplace"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
          >
            <Suspense
              fallback={
                <Skeleton className="w-full h-[400px] rounded-xl bg-[#050505] border border-primary/20" />
              }
            >
              <MarketplaceTab />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
