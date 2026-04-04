import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '@/lib/supabase/client'

export type Previsao = {
  id: string
  user_id: string
  cidade: string
  cultura: string
  temperatura: number
  umidade: number
  risco_pragas: string
  data: string
}
export type Alerta = {
  id: string
  user_id: string
  tipo: 'pest' | 'climate' | 'planting'
  mensagem: string
  data_leitura: string | null
  data_criacao: string
}
export type Post = {
  id: string
  user_id: string
  titulo: string
  conteudo: string
  categoria: string
  data: string
}
export type Animal = {
  id: string
  user_id: string
  tipo: string
  peso: number
  fase: string
  racao_recomendada: string
  custo_mensal: number
}
export type Produto = {
  id: string
  user_id?: string
  nome: string
  descricao: string
  preco_base: number
  markup_10pct: boolean
  preco_final: number
  estoque: number
  image: string
}
export type CartItem = {
  produto: Produto
  quantidade: number
}
export type Pedido = {
  id: string
  user_id: string
  numero_pedido: string
  data: string
  produtos: CartItem[]
  subtotal: number
  frete: number
  valor_total: number
  status: string
}

interface DatabaseContextType {
  previsoes: Previsao[]
  alertas: Alerta[]
  comunidadePosts: Post[]
  animais: Animal[]
  produtos: Produto[]
  pedidos: Pedido[]
  loading: boolean
  addPrevisao: (p: Omit<Previsao, 'id' | 'user_id'>) => Promise<void>
  updatePrevisao: (id: string, p: Partial<Previsao>) => Promise<void>
  deletePrevisao: (id: string) => Promise<void>
  addAnimal: (animal: Omit<Animal, 'id' | 'user_id'>) => Promise<void>
  updateAnimal: (id: string, animal: Partial<Animal>) => Promise<void>
  deleteAnimal: (id: string) => Promise<void>
  addPost: (post: Omit<Post, 'id' | 'user_id'>) => Promise<void>
  updatePost: (id: string, post: Partial<Post>) => Promise<void>
  deletePost: (id: string) => Promise<void>
  addProduto: (produto: Omit<Produto, 'id' | 'user_id'>) => Promise<void>
  updateProduto: (id: string, produto: Partial<Produto>) => Promise<void>
  deleteProduto: (id: string) => Promise<void>
  dismissAlerta: (id: string) => Promise<void>
  addPedido: (pedido: Omit<Pedido, 'id' | 'user_id' | 'data' | 'numero_pedido'>) => Promise<void>
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [previsoes, setPrevisoes] = useState<Previsao[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [comunidadePosts, setComunidadePosts] = useState<Post[]>([])
  const [animais, setAnimais] = useState<Animal[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  const loadData = async () => {
    if (!user) {
      setPrevisoes([])
      setAlertas([])
      setComunidadePosts([])
      setAnimais([])
      setProdutos([])
      setPedidos([])
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      // Tabela esperada: weather_forecasts (para não conflitar com previsões de mercado na db original)
      const prevRes = await supabase
        .from('weather_forecasts' as any)
        .select('*')
        .eq('user_id', user.id)
      // Tabela esperada: system_alerts
      const alertasRes = await supabase
        .from('system_alerts' as any)
        .select('*')
        .eq('user_id', user.id)
        .is('data_leitura', null)
      // Tabela esperada: comunidade_posts
      const postsRes = await supabase
        .from('comunidade_posts' as any)
        .select('*')
        .eq('user_id', user.id)
      // Tabela esperada: pecuaria_animais
      const animaisRes = await supabase
        .from('pecuaria_animais' as any)
        .select('*')
        .eq('user_id', user.id)
      // Tabela esperada: marketplace_produtos
      const prodRes = await supabase.from('marketplace_produtos' as any).select('*')
      // Tabela esperada: marketplace_pedidos
      const pedidosRes = await supabase
        .from('marketplace_pedidos' as any)
        .select('*')
        .eq('user_id', user.id)

      if (prevRes.data) setPrevisoes(prevRes.data)
      if (alertasRes.data) setAlertas(alertasRes.data)
      if (postsRes.data) setComunidadePosts(postsRes.data)
      if (animaisRes.data) setAnimais(animaisRes.data)
      if (prodRes.data) setProdutos(prodRes.data)
      if (pedidosRes.data) setPedidos(pedidosRes.data)
    } catch (err) {
      console.error('Error loading data from Supabase', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const addPrevisao = async (p: Omit<Previsao, 'id' | 'user_id'>) => {
    if (!user) return
    const { data, error } = await supabase
      .from('weather_forecasts' as any)
      .insert({ ...p, user_id: user.id })
      .select()
    if (!error && data) setPrevisoes((prev) => [...prev, data[0]])
  }

  const updatePrevisao = async (id: string, p: Partial<Previsao>) => {
    const { data, error } = await supabase
      .from('weather_forecasts' as any)
      .update(p)
      .eq('id', id)
      .select()
    if (!error && data) {
      setPrevisoes((prev) => prev.map((item) => (item.id === id ? data[0] : item)))
    }
  }

  const deletePrevisao = async (id: string) => {
    const { error } = await supabase
      .from('weather_forecasts' as any)
      .delete()
      .eq('id', id)
    if (!error) setPrevisoes((prev) => prev.filter((item) => item.id !== id))
  }

  const addAnimal = async (animal: Omit<Animal, 'id' | 'user_id'>) => {
    if (!user) return
    const { data, error } = await supabase
      .from('pecuaria_animais' as any)
      .insert({ ...animal, user_id: user.id })
      .select()
    if (!error && data) setAnimais((prev) => [...prev, data[0]])
  }

  const updateAnimal = async (id: string, animal: Partial<Animal>) => {
    const { data, error } = await supabase
      .from('pecuaria_animais' as any)
      .update(animal)
      .eq('id', id)
      .select()
    if (!error && data) {
      setAnimais((prev) => prev.map((item) => (item.id === id ? data[0] : item)))
    }
  }

  const deleteAnimal = async (id: string) => {
    const { error } = await supabase
      .from('pecuaria_animais' as any)
      .delete()
      .eq('id', id)
    if (!error) setAnimais((prev) => prev.filter((item) => item.id !== id))
  }

  const addPost = async (post: Omit<Post, 'id' | 'user_id'>) => {
    if (!user) return
    const { data, error } = await supabase
      .from('comunidade_posts' as any)
      .insert({ ...post, user_id: user.id })
      .select()
    if (!error && data) setComunidadePosts((prev) => [...prev, data[0]])
  }

  const updatePost = async (id: string, post: Partial<Post>) => {
    const { data, error } = await supabase
      .from('comunidade_posts' as any)
      .update(post)
      .eq('id', id)
      .select()
    if (!error && data) {
      setComunidadePosts((prev) => prev.map((item) => (item.id === id ? data[0] : item)))
    }
  }

  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('comunidade_posts' as any)
      .delete()
      .eq('id', id)
    if (!error) setComunidadePosts((prev) => prev.filter((item) => item.id !== id))
  }

  const addProduto = async (produto: Omit<Produto, 'id' | 'user_id'>) => {
    if (!user) return
    const { data, error } = await supabase
      .from('marketplace_produtos' as any)
      .insert({ ...produto, user_id: user.id })
      .select()
    if (!error && data) setProdutos((prev) => [...prev, data[0]])
  }

  const updateProduto = async (id: string, produto: Partial<Produto>) => {
    const { data, error } = await supabase
      .from('marketplace_produtos' as any)
      .update(produto)
      .eq('id', id)
      .select()
    if (!error && data) {
      setProdutos((prev) => prev.map((item) => (item.id === id ? data[0] : item)))
    }
  }

  const deleteProduto = async (id: string) => {
    const { error } = await supabase
      .from('marketplace_produtos' as any)
      .delete()
      .eq('id', id)
    if (!error) setProdutos((prev) => prev.filter((item) => item.id !== id))
  }

  const dismissAlerta = async (id: string) => {
    if (!user) return
    const { error } = await supabase
      .from('system_alerts' as any)
      .update({ data_leitura: new Date().toISOString() })
      .eq('id', id)
    if (!error) setAlertas((prev) => prev.filter((a) => a.id !== id))
  }

  const addPedido = async (pedido: Omit<Pedido, 'id' | 'user_id' | 'data' | 'numero_pedido'>) => {
    if (!user) return
    const newPedido = {
      ...pedido,
      user_id: user.id,
      data: new Date().toISOString(),
      numero_pedido: Math.floor(10000 + Math.random() * 90000).toString(),
    }
    const { data, error } = await supabase
      .from('marketplace_pedidos' as any)
      .insert(newPedido)
      .select()
    if (!error && data) setPedidos((prev) => [data[0], ...prev])
  }

  return (
    <DatabaseContext.Provider
      value={{
        previsoes,
        alertas,
        comunidadePosts,
        animais,
        produtos,
        pedidos,
        loading,
        addPrevisao,
        updatePrevisao,
        deletePrevisao,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        addPost,
        updatePost,
        deletePost,
        addProduto,
        updateProduto,
        deleteProduto,
        dismissAlerta,
        addPedido,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}

export const useDatabase = () => {
  const context = useContext(DatabaseContext)
  if (!context) throw new Error('useDatabase must be used within DatabaseProvider')
  return context
}
