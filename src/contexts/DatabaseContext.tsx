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
  preco: string
  markup_10pct: boolean
  estoque: number
  image: string
}

interface DatabaseContextType {
  previsoes: Previsao[]
  alertas: Alerta[]
  comunidadePosts: Post[]
  animais: Animal[]
  produtos: Produto[]
  loading: boolean
  addAnimal: (animal: Omit<Animal, 'id' | 'user_id'>) => Promise<void>
  addPost: (post: Omit<Post, 'id' | 'user_id'>) => Promise<void>
  dismissAlerta: (id: string) => Promise<void>
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

  const loadData = () => {
    if (!user) {
      setPrevisoes([])
      setAlertas([])
      setComunidadePosts([])
      setAnimais([])
      setProdutos([])
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
      const allProdutos: Produto[] = JSON.parse(
        localStorage.getItem('db_marketplace_produtos') || '[]',
      )
      setProdutos(allProdutos)

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

  return (
    <DatabaseContext.Provider
      value={{
        previsoes,
        alertas,
        comunidadePosts,
        animais,
        produtos,
        loading,
        addAnimal,
        addPost,
        dismissAlerta,
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
