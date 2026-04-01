import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabaseUrl, getSupabaseHeaders } from '@/lib/supabase'

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
    if (!supabaseUrl) {
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('sb_access_token') || undefined
      const headers = getSupabaseHeaders(token)

      const [prevRes, alertasRes, postsRes, animaisRes, prodRes, pedidosRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/previsoes?user_id=eq.${user.id}`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/alertas?user_id=eq.${user.id}&data_leitura=is.null`, {
          headers,
        }),
        fetch(`${supabaseUrl}/rest/v1/comunidade_posts?user_id=eq.${user.id}`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/pecuaria_animais?user_id=eq.${user.id}`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/marketplace_produtos`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/marketplace_pedidos?user_id=eq.${user.id}`, { headers }),
      ])

      if (prevRes.ok) setPrevisoes(await prevRes.json())
      if (alertasRes.ok) setAlertas(await alertasRes.json())
      if (postsRes.ok) setComunidadePosts(await postsRes.json())
      if (animaisRes.ok) setAnimais(await animaisRes.json())
      if (prodRes.ok) setProdutos(await prodRes.json())
      if (pedidosRes.ok) setPedidos(await pedidosRes.json())
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

  const apiFetch = async (endpoint: string, method: string, body?: any) => {
    const token = localStorage.getItem('sb_access_token') || undefined
    const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
      method,
      headers: { ...getSupabaseHeaders(token), Prefer: 'return=representation' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
    return res
  }

  const addPrevisao = async (p: Omit<Previsao, 'id' | 'user_id'>) => {
    if (!user || !supabaseUrl) return
    const res = await apiFetch('previsoes', 'POST', { ...p, user_id: user.id })
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) setPrevisoes((prev) => [...prev, data[0]])
    }
  }

  const updatePrevisao = async (id: string, p: Partial<Previsao>) => {
    if (!supabaseUrl) return
    const res = await apiFetch(`previsoes?id=eq.${id}`, 'PATCH', p)
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) {
        setPrevisoes((prev) => prev.map((item) => (item.id === id ? data[0] : item)))
      }
    }
  }

  const deletePrevisao = async (id: string) => {
    if (!supabaseUrl) return
    const res = await apiFetch(`previsoes?id=eq.${id}`, 'DELETE')
    if (res.ok) {
      setPrevisoes((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const addAnimal = async (animal: Omit<Animal, 'id' | 'user_id'>) => {
    if (!user || !supabaseUrl) return
    const res = await apiFetch('pecuaria_animais', 'POST', { ...animal, user_id: user.id })
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) setAnimais((prev) => [...prev, data[0]])
    }
  }

  const updateAnimal = async (id: string, animal: Partial<Animal>) => {
    if (!supabaseUrl) return
    const res = await apiFetch(`pecuaria_animais?id=eq.${id}`, 'PATCH', animal)
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) {
        setAnimais((prev) => prev.map((item) => (item.id === id ? data[0] : item)))
      }
    }
  }

  const deleteAnimal = async (id: string) => {
    if (!supabaseUrl) return
    const res = await apiFetch(`pecuaria_animais?id=eq.${id}`, 'DELETE')
    if (res.ok) {
      setAnimais((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const addPost = async (post: Omit<Post, 'id' | 'user_id'>) => {
    if (!user || !supabaseUrl) return
    const res = await apiFetch('comunidade_posts', 'POST', { ...post, user_id: user.id })
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) setComunidadePosts((prev) => [...prev, data[0]])
    }
  }

  const updatePost = async (id: string, post: Partial<Post>) => {
    if (!supabaseUrl) return
    const res = await apiFetch(`comunidade_posts?id=eq.${id}`, 'PATCH', post)
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) {
        setComunidadePosts((prev) => prev.map((item) => (item.id === id ? data[0] : item)))
      }
    }
  }

  const deletePost = async (id: string) => {
    if (!supabaseUrl) return
    const res = await apiFetch(`comunidade_posts?id=eq.${id}`, 'DELETE')
    if (res.ok) {
      setComunidadePosts((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const addProduto = async (produto: Omit<Produto, 'id' | 'user_id'>) => {
    if (!user || !supabaseUrl) return
    const res = await apiFetch('marketplace_produtos', 'POST', { ...produto, user_id: user.id })
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) setProdutos((prev) => [...prev, data[0]])
    }
  }

  const updateProduto = async (id: string, produto: Partial<Produto>) => {
    if (!supabaseUrl) return
    const res = await apiFetch(`marketplace_produtos?id=eq.${id}`, 'PATCH', produto)
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) {
        setProdutos((prev) => prev.map((item) => (item.id === id ? data[0] : item)))
      }
    }
  }

  const deleteProduto = async (id: string) => {
    if (!supabaseUrl) return
    const res = await apiFetch(`marketplace_produtos?id=eq.${id}`, 'DELETE')
    if (res.ok) {
      setProdutos((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const dismissAlerta = async (id: string) => {
    if (!user || !supabaseUrl) return
    const res = await apiFetch(`alertas?id=eq.${id}`, 'PATCH', {
      data_leitura: new Date().toISOString(),
    })
    if (res.ok) {
      setAlertas((prev) => prev.filter((a) => a.id !== id))
    }
  }

  const addPedido = async (pedido: Omit<Pedido, 'id' | 'user_id' | 'data' | 'numero_pedido'>) => {
    if (!user || !supabaseUrl) return
    const newPedido = {
      ...pedido,
      user_id: user.id,
      data: new Date().toISOString(),
      numero_pedido: Math.floor(10000 + Math.random() * 90000).toString(),
    }
    const res = await apiFetch('marketplace_pedidos', 'POST', newPedido)
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) setPedidos((prev) => [data[0], ...prev])
    }
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
