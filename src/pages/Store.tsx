import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useCart, Product } from '@/contexts/CartContext'
import { useSubscription } from '@/hooks/useSubscription'
import { Filter, PackageSearch } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/store/ProductCard'
import { CartSheet } from '@/components/store/CartSheet'
import { useRef } from 'react'
import { useGsapAnimations } from '@/hooks/use-gsap-animations'

const CATEGORIES = [
  { id: 'todas', label: 'Todas' },
  { id: 'sementes', label: 'Sementes' },
  { id: 'fertilizante', label: 'Fertilizantes' },
  { id: 'defensivos', label: 'Defensivos' },
  { id: 'ração', label: 'Ração' },
]

export default function Store() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('todas')
  const { addItem } = useCart()
  const { toast } = useToast()
  const { hasFeature, loading: planLoading } = useSubscription()
  const canBuy = hasFeature('loja')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        if (data) setProducts(data)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem(product)
    toast({
      title: 'Adicionado ao carrinho',
      description: `${product.name} adicionado com sucesso.`,
      duration: 3000,
    })
  }

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'todas') return products
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  const containerRef = useRef<HTMLDivElement>(null)
  useGsapAnimations(containerRef)

  return (
    <div className="container mx-auto py-8 bg-[#000000] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-[#050505] p-6 rounded-2xl border border-[#1DB954]/20 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF] flex items-center gap-3">
            <Logo className="h-8 w-8 text-[#1DB954]" />
            Loja de Insumos
          </h1>
          <p className="text-[#E0E0E0] mt-2 text-lg font-medium max-w-xl">
            Insumos premium para sua lavoura. Adquira sementes, fertilizantes e defensivos com a
            melhor qualidade do mercado.
          </p>
        </div>
        <CartSheet canBuy={canBuy} planLoading={planLoading} />
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="h-5 w-5 text-agro-green mr-2 shrink-0" />
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            className={cn(
              'rounded-[20px] whitespace-nowrap font-medium transition-all duration-400 ease-bounce',
              selectedCategory === cat.id
                ? 'bg-agro-green hover:bg-agro-green-hover text-white border-agro-green shadow-md'
                : 'bg-transparent text-foreground border-border hover:bg-accent hover:text-accent-foreground',
            )}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse border border-[#1DB954]/20 shadow-sm rounded-[16px] h-80 bg-[#050505]"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              canBuy={canBuy}
              planLoading={planLoading}
            />
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-[#050505] rounded-2xl border border-dashed border-[#1DB954]/20 text-center px-4 shadow-sm">
              <PackageSearch className="h-16 w-16 text-[#1DB954] opacity-50 mb-4" />
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-2">Nenhum produto encontrado</h3>
              <p className="text-[#E0E0E0] max-w-md font-medium">
                Não há insumos cadastrados nesta categoria no momento.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
