import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useCart, Product } from '@/contexts/CartContext'
import { useSubscription } from '@/hooks/useSubscription'
import { Tag, Filter, PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/store/ProductCard'
import { CartSheet } from '@/components/store/CartSheet'

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

  return (
    <div className="container mx-auto py-8 animate-fade-in bg-bg-dark min-h-screen rounded-[24px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-card/60 backdrop-blur-sm p-6 rounded-[24px] border border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Tag className="h-8 w-8 text-premium-gold" />
            Loja de Insumos
          </h1>
          <p className="text-muted-foreground mt-1 max-w-xl">
            Adquira insumos de qualidade premium para impulsionar a sua produção rural.
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
        <div className="grid-responsive">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse border border-green-100 shadow-sm rounded-xl h-80 bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid-responsive">
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
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-green-200 text-center px-4 shadow-sm">
              <PackageSearch className="h-16 w-16 text-yellow-500 opacity-60 mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-green-700/70 max-w-md">
                Não há insumos cadastrados nesta categoria no momento.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
