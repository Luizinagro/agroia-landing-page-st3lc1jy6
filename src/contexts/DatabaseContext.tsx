import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

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

  const loadData = () => {
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
    setTimeout(() => {
      const allPrevisoes: Previsao[] = JSON.parse(localStorage.getItem('db_previsoes') || '[]')
      setPrevisoes(allPrevisoes.filter((p) => p.user_id === user.id))

      const allAlertas: Alerta[] = JSON.parse(localStorage.getItem('db_alertas') || '[]')
      setAlertas(allAlertas.filter((a) => a.user_id === user.id && !a.data_leitura))

      const allPosts: Post[] = JSON.parse(localStorage.getItem('db_comunidade_posts') || '[]')
      setComunidadePosts(allPosts.filter((p) => p.user_id === user.id))

      const allAnimais: Animal[] = JSON.parse(localStorage.getItem('db_pecuaria_animais') || '[]')
      setAnimais(allAnimais.filter((a) => a.user_id === user.id))

      let allProdutos: Produto[] = JSON.parse(
        localStorage.getItem('db_marketplace_produtos') || '[]',
      )

      if (allProdutos.length === 0) {
        allProdutos = [
          {
            id: 'prod-1',
            nome: 'Ração BASF',
            descricao: 'Ração de alta performance para nutrição bovina de corte.',
            preco_base: 2090,
            markup_10pct: true,
            preco_final: 2299,
            estoque: 100,
            image: 'https://img.usecurling.com/p/400/300?q=cattle%20feed',
          },
          {
            id: 'prod-2',
            nome: 'Sementes Monsoy',
            descricao: 'Sementes de soja com alto vigor e germinação.',
            preco_base: 800,
            markup_10pct: true,
            preco_final: 880,
            estoque: 50,
            image: 'https://img.usecurling.com/p/400/300?q=soybean%20seeds',
          },
        ]
        localStorage.setItem('db_marketplace_produtos', JSON.stringify(allProdutos))
      }
      setProdutos(allProdutos)

      const allPedidos: Pedido[] = JSON.parse(
        localStorage.getItem('db_marketplace_pedidos') || '[]',
      )
      setPedidos(allPedidos.filter((p) => p.user_id === user.id))

      setLoading(false)
    }, 800)
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const saveToLocal = (key: string, data: any[]) => localStorage.setItem(key, JSON.stringify(data))

  const addPrevisao = async (p: Omit<Previsao, 'id' | 'user_id'>) => {
    if (!user) return
    const newP: Previsao = { ...p, id: Math.random().toString(36).substring(7), user_id: user.id }
    const all = JSON.parse(localStorage.getItem('db_previsoes') || '[]')
    all.push(newP)
    saveToLocal('db_previsoes', all)
    setPrevisoes((prev) => [...prev, newP])
  }
  const updatePrevisao = async (id: string, p: Partial<Previsao>) => {
    const all: Previsao[] = JSON.parse(localStorage.getItem('db_previsoes') || '[]')
    const updated = all.map((item) => (item.id === id ? { ...item, ...p } : item))
    saveToLocal('db_previsoes', updated)
    setPrevisoes((prev) => prev.map((item) => (item.id === id ? { ...item, ...p } : item)))
  }
  const deletePrevisao = async (id: string) => {
    const all: Previsao[] = JSON.parse(localStorage.getItem('db_previsoes') || '[]')
    saveToLocal(
      'db_previsoes',
      all.filter((item) => item.id !== id),
    )
    setPrevisoes((prev) => prev.filter((item) => item.id !== id))
  }

  const addAnimal = async (animal: Omit<Animal, 'id' | 'user_id'>) => {
    if (!user) return
    const newAnimal: Animal = {
      ...animal,
      id: Math.random().toString(36).substring(7),
      user_id: user.id,
    }
    const all = JSON.parse(localStorage.getItem('db_pecuaria_animais') || '[]')
    all.push(newAnimal)
    saveToLocal('db_pecuaria_animais', all)
    setAnimais((prev) => [...prev, newAnimal])
  }
  const updateAnimal = async (id: string, animal: Partial<Animal>) => {
    const all: Animal[] = JSON.parse(localStorage.getItem('db_pecuaria_animais') || '[]')
    const updated = all.map((item) => (item.id === id ? { ...item, ...animal } : item))
    saveToLocal('db_pecuaria_animais', updated)
    setAnimais((prev) => prev.map((item) => (item.id === id ? { ...item, ...animal } : item)))
  }
  const deleteAnimal = async (id: string) => {
    const all: Animal[] = JSON.parse(localStorage.getItem('db_pecuaria_animais') || '[]')
    saveToLocal(
      'db_pecuaria_animais',
      all.filter((item) => item.id !== id),
    )
    setAnimais((prev) => prev.filter((item) => item.id !== id))
  }

  const addPost = async (post: Omit<Post, 'id' | 'user_id'>) => {
    if (!user) return
    const newPost: Post = { ...post, id: Math.random().toString(36).substring(7), user_id: user.id }
    const all = JSON.parse(localStorage.getItem('db_comunidade_posts') || '[]')
    all.push(newPost)
    saveToLocal('db_comunidade_posts', all)
    setComunidadePosts((prev) => [...prev, newPost])
  }
  const updatePost = async (id: string, post: Partial<Post>) => {
    const all: Post[] = JSON.parse(localStorage.getItem('db_comunidade_posts') || '[]')
    const updated = all.map((item) => (item.id === id ? { ...item, ...post } : item))
    saveToLocal('db_comunidade_posts', updated)
    setComunidadePosts((prev) => prev.map((item) => (item.id === id ? { ...item, ...post } : item)))
  }
  const deletePost = async (id: string) => {
    const all: Post[] = JSON.parse(localStorage.getItem('db_comunidade_posts') || '[]')
    saveToLocal(
      'db_comunidade_posts',
      all.filter((item) => item.id !== id),
    )
    setComunidadePosts((prev) => prev.filter((item) => item.id !== id))
  }

  const addProduto = async (produto: Omit<Produto, 'id' | 'user_id'>) => {
    if (!user) return
    const newP: Produto = {
      ...produto,
      id: Math.random().toString(36).substring(7),
      user_id: user.id,
    }
    const all = JSON.parse(localStorage.getItem('db_marketplace_produtos') || '[]')
    all.push(newP)
    saveToLocal('db_marketplace_produtos', all)
    setProdutos((prev) => [...prev, newP])
  }
  const updateProduto = async (id: string, produto: Partial<Produto>) => {
    const all: Produto[] = JSON.parse(localStorage.getItem('db_marketplace_produtos') || '[]')
    const updated = all.map((item) => (item.id === id ? { ...item, ...produto } : item))
    saveToLocal('db_marketplace_produtos', updated)
    setProdutos((prev) => prev.map((item) => (item.id === id ? { ...item, ...produto } : item)))
  }
  const deleteProduto = async (id: string) => {
    const all: Produto[] = JSON.parse(localStorage.getItem('db_marketplace_produtos') || '[]')
    saveToLocal(
      'db_marketplace_produtos',
      all.filter((item) => item.id !== id),
    )
    setProdutos((prev) => prev.filter((item) => item.id !== id))
  }

  const dismissAlerta = async (id: string) => {
    if (!user) return
    const all: Alerta[] = JSON.parse(localStorage.getItem('db_alertas') || '[]')
    const updated = all.map((a) =>
      a.id === id ? { ...a, data_leitura: new Date().toISOString() } : a,
    )
    saveToLocal('db_alertas', updated)
    setAlertas((prev) => prev.filter((a) => a.id !== id))
  }

  const addPedido = async (pedido: Omit<Pedido, 'id' | 'user_id' | 'data' | 'numero_pedido'>) => {
    if (!user) return
    const newPedido: Pedido = {
      ...pedido,
      id: Math.random().toString(36).substring(7),
      user_id: user.id,
      data: new Date().toISOString(),
      numero_pedido: Math.floor(10000 + Math.random() * 90000).toString(),
    }
    const all = JSON.parse(localStorage.getItem('db_marketplace_pedidos') || '[]')
    all.push(newPedido)
    saveToLocal('db_marketplace_pedidos', all)
    setPedidos((prev) => [newPedido, ...prev])
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
