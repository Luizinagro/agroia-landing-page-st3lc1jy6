import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Package, Loader2, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

export function Estoque() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [nome, setNome] = useState('')
  const [qtd, setQtd] = useState('')
  const [custo, setCusto] = useState('')

  useEffect(() => {
    if (user) fetchItems()
  }, [user])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('user_estoque' as any)
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (data) setItems(data)
    setLoading(false)
  }

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !qtd || !custo) return

    const custoTotal = Number(qtd) * Number(custo)

    const { error } = await supabase.from('user_estoque' as any).insert({
      user_id: user?.id,
      item_nome: nome,
      quantidade: Number(qtd),
      custo_total: custoTotal,
    })

    if (!error) {
      setNome('')
      setQtd('')
      setCusto('')
      fetchItems()
      toast({ title: 'Item adicionado ao estoque!' })
    }
  }

  const deleteItem = async (id: string) => {
    await supabase
      .from('user_estoque' as any)
      .delete()
      .eq('id', id)
    fetchItems()
  }

  return (
    <div className="bg-[#050505] p-6 rounded-2xl border border-white/10 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Estoque e Insumos (Custo Total)</h2>

      <form onSubmit={addItem} className="flex gap-4 mb-6 flex-wrap md:flex-nowrap">
        <Input
          placeholder="Nome do insumo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="flex-1 bg-black/50"
        />
        <Input
          type="number"
          placeholder="Qtd"
          value={qtd}
          onChange={(e) => setQtd(e.target.value)}
          className="w-24 bg-black/50"
        />
        <Input
          type="number"
          placeholder="R$ Unitário"
          value={custo}
          onChange={(e) => setCusto(e.target.value)}
          className="w-32 bg-black/50"
        />
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-black w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Inserir
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 && (
            <p className="text-zinc-500 col-span-full">
              Estoque vazio. Registre os insumos comprados.
            </p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-white/10 bg-black/40 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem(item.id)}
                  className="h-8 w-8 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-bold text-white">{item.item_nome}</h3>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-xs text-zinc-400">Quantidade</p>
                  <p className="font-medium text-white">{item.quantidade} un</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Custo Total</p>
                  <p className="font-bold text-primary">
                    R$ {item.custo_total.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
