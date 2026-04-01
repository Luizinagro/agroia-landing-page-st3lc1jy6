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
  addAnimal: (animal: Omit<Animal, 'id' | 'user_id'>) => Promise<void>
  addPost: (post: Omit<Post, 'id' | 'user_id'>) => Promise<void>
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
      // RLS Implementation: Filter by user.id
      const allPrevisoes: Previsao[] = JSON.parse(localStorage.getItem('db_previsoes') || '[]')
      setPrevisoes(allPrevisoes.filter((p) => p.user_id === user.id))

      const allAlertas: Alerta[] = JSON.parse(localStorage.getItem('db_alertas') || '[]')
      setAlertas(allAlertas.filter((a) => a.user_id === user.id && !a.data_leitura))

      const allPosts: Post[] = JSON.parse(localStorage.getItem('db_comunidade_posts') || '[]')
      setComunidadePosts(allPosts.filter((p) => p.user_id === user.id)) // RLS explicit in AC

      const allAnimais: Animal[] = JSON.parse(localStorage.getItem('db_pecuaria_animais') || '[]')
      setAnimais(allAnimais.filter((a) => a.user_id === user.id))

      // Marketplace has no RLS mentioned to be restricted by user, just global products
      let allProdutos: Produto[] = JSON.parse(
        localStorage.getItem('db_marketplace_produtos') || '[]',
      )

      if (allProdutos.length === 0) {
        allProdutos = [
          {
            id: 'prod-1',
            nome: 'Ração BASF',
            descricao:
              'Ração de alta performance para nutrição bovina de corte, garantindo ganho de peso acelerado.',
            preco_base: 2090,
            markup_10pct: true,
            preco_final: 2299,
            estoque: 100,
            image: 'https://img.usecurling.com/p/400/300?q=cattle%20feed',
          },
          {
            id: 'prod-2',
            nome: 'Sementes Monsoy',
            descricao:
              'Sementes de soja com alto vigor e germinação, desenvolvidas para máxima produtividade.',
            preco_base: 800,
            markup_10pct: true,
            preco_final: 880,
            estoque: 50,
            image: 'https://img.usecurling.com/p/400/300?q=soybean%20seeds',
          },
          {
            id: 'prod-3',
            nome: 'Fertilizante Yara',
            descricao:
              'Fertilizante NPK equilibrado, ideal para a fase de crescimento de diversas culturas.',
            preco_base: 1200,
            markup_10pct: true,
            preco_final: 1320,
            estoque: 200,
            image: 'https://img.usecurling.com/p/400/300?q=fertilizer',
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

  const addAnimal = async (animal: Omit<Animal, 'id' | 'user_id'>) => {
    if (!user) return
    const newAnimal: Animal = {
      ...animal,
      id: Math.random().toString(36).substring(7),
      user_id: user.id,
    }
    const allAnimais = JSON.parse(localStorage.getItem('db_pecuaria_animais') || '[]')
    allAnimais.push(newAnimal)
    localStorage.setItem('db_pecuaria_animais', JSON.stringify(allAnimais))
    setAnimais((prev) => [...prev, newAnimal])
  }

  const addPost = async (post: Omit<Post, 'id' | 'user_id'>) => {
    if (!user) return
    const newPost: Post = { ...post, id: Math.random().toString(36).substring(7), user_id: user.id }
    const allPosts = JSON.parse(localStorage.getItem('db_comunidade_posts') || '[]')
    allPosts.push(newPost)
    localStorage.setItem('db_comunidade_posts', JSON.stringify(allPosts))
    setComunidadePosts((prev) => [...prev, newPost])
  }

  const dismissAlerta = async (id: string) => {
    if (!user) return
    const allAlertas: Alerta[] = JSON.parse(localStorage.getItem('db_alertas') || '[]')
    const updated = allAlertas.map((a) =>
      a.id === id ? { ...a, data_leitura: new Date().toISOString() } : a,
    )
    localStorage.setItem('db_alertas', JSON.stringify(updated))
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
    const allPedidos = JSON.parse(localStorage.getItem('db_marketplace_pedidos') || '[]')
    allPedidos.push(newPedido)
    localStorage.setItem('db_marketplace_pedidos', JSON.stringify(allPedidos))
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
        addAnimal,
        addPost,
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
