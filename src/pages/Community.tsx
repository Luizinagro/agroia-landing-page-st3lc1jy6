import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MessageSquare, PlayCircle, ShoppingBag, Tractor } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GamificationCard } from '@/components/community/GamificationCard'
import { SEO } from '@/components/SEO'
import { Suspense, lazy } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO
        title="Comunidade Agro-Futuro"
        description="Conecte-se, aprenda e faça negócios com outros produtores na rede AgroIA."
      />
      <header className="sticky top-0 z-50 w-full bg-[#1a3c34] text-white shadow-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity"
          >
            <Tractor className="w-6 h-6 text-[#f4d03f]" />
            <span>AgroIA</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:text-[#f4d03f] hover:bg-white/10 hidden sm:flex"
              asChild
            >
              <Link to="/dashboard">Voltar ao Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1a3c34]">Comunidade Agro-Futuro</h1>
            <p className="text-muted-foreground mt-1">
              Conecte-se, aprenda e faça negócios com outros produtores.
            </p>
          </div>
          <GamificationCard />
        </div>

        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabsTrigger
              value="forum"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#1a3c34] data-[state=active]:text-[#1a3c34] data-[state=active]:shadow-none rounded-none px-6 py-3 text-base font-medium text-gray-500 bg-transparent whitespace-nowrap transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Fórum
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#1a3c34] data-[state=active]:text-[#1a3c34] data-[state=active]:shadow-none rounded-none px-6 py-3 text-base font-medium text-gray-500 bg-transparent whitespace-nowrap transition-colors"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Próxima Live
            </TabsTrigger>
            <TabsTrigger
              value="marketplace"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#1a3c34] data-[state=active]:text-[#1a3c34] data-[state=active]:shadow-none rounded-none px-6 py-3 text-base font-medium text-gray-500 bg-transparent whitespace-nowrap transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="forum"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
          >
            <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-xl" />}>
              <ForumTab />
            </Suspense>
          </TabsContent>

          <TabsContent
            value="live"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
          >
            <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-xl" />}>
              <LiveTab />
            </Suspense>
          </TabsContent>

          <TabsContent
            value="marketplace"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
          >
            <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-xl" />}>
              <MarketplaceTab />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
