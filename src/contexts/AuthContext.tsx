import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabaseUrl, getSupabaseHeaders } from '@/lib/supabase'

export type User = {
  id: string
  email: string
  senha_hash?: string
  nome: string
  tipo_usuario: string
  estado: string
  data_criacao: string
  data_trial_expira: string
  plano_ativo: string
  plano?: string // Alias for compatibility with existing modules
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('sb_access_token')
      const userId = localStorage.getItem('sb_user_id')

      if (token && userId && supabaseUrl) {
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=*`, {
            headers: getSupabaseHeaders(token),
          })
          if (res.ok) {
            const data = await res.json()
            if (data && data.length > 0) {
              const u = data[0]
              u.plano = u.plano_ativo
              setUser(u)
            } else {
              logout()
            }
          } else {
            logout()
          }
        } catch (err) {
          console.error('Auth init error', err)
          logout()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email: string, senha: string) => {
    if (!supabaseUrl) {
      throw new Error('Supabase integration missing. Please set VITE_SUPABASE_URL in .env')
    }

    // Securely check if user exists via RPC to provide accurate error messages
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/check_user_exists`, {
      method: 'POST',
      headers: getSupabaseHeaders(),
      body: JSON.stringify({ lookup_email: email }),
    })

    if (rpcRes.ok) {
      const exists = await rpcRes.json()
      if (exists === false) {
        throw new Error('Usuário não existe no banco de dados')
      }
    }

    // Perform Auth
    const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: getSupabaseHeaders(),
      body: JSON.stringify({ email, password: senha }),
    })

    const authData = await authRes.json()
    if (!authRes.ok) {
      throw new Error('E-mail ou senha inválidos')
    }

    const token = authData.access_token
    const userId = authData.user?.id

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=*`, {
      headers: getSupabaseHeaders(token),
    })

    const profileData = await profileRes.json()
    if (!profileRes.ok || !profileData || profileData.length === 0) {
      throw new Error('Usuário não existe no banco de dados')
    }

    const u = profileData[0]
    u.plano = u.plano_ativo

    localStorage.setItem('sb_access_token', token)
    localStorage.setItem('sb_user_id', userId)
    setUser(u)
    seedUserData(userId)
  }

  const logout = () => {
    localStorage.removeItem('sb_access_token')
    localStorage.removeItem('sb_user_id')
    setUser(null)
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user || !supabaseUrl) return
    const token = localStorage.getItem('sb_access_token')

    const dbUpdates = { ...updates }
    if (dbUpdates.plano) {
      dbUpdates.plano_ativo = dbUpdates.plano
      delete dbUpdates.plano
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: {
        ...getSupabaseHeaders(token),
        Prefer: 'return=representation',
      },
      body: JSON.stringify(dbUpdates),
    })

    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) {
        const u = data[0]
        u.plano = u.plano_ativo
        setUser(u)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

function seedUserData(userId: string) {
  // Previsoes
  const previsoes = JSON.parse(localStorage.getItem('db_previsoes') || '[]')
  previsoes.push({
    id: Math.random().toString(36).substring(7),
    user_id: userId,
    cidade: 'Cascavel - PR',
    cultura: 'Soja',
    temperatura: 28,
    umidade: 65,
    risco_pragas: 'Baixo',
    data: new Date().toISOString(),
  })
  localStorage.setItem('db_previsoes', JSON.stringify(previsoes))

  // Alertas
  const alertas = JSON.parse(localStorage.getItem('db_alertas') || '[]')
  alertas.push(
    {
      id: Math.random().toString(36).substring(7),
      user_id: userId,
      tipo: 'pest',
      mensagem: 'Alerta de Ferrugem Asiática na região com alta probabilidade.',
      data_leitura: null,
      data_criacao: new Date().toISOString(),
    },
    {
      id: Math.random().toString(36).substring(7),
      user_id: userId,
      tipo: 'climate',
      mensagem: 'Previsão de chuvas fortes nas próximas 48h.',
      data_leitura: null,
      data_criacao: new Date().toISOString(),
    },
  )
  localStorage.setItem('db_alertas', JSON.stringify(alertas))

  // Comunidade
  const posts = JSON.parse(localStorage.getItem('db_comunidade_posts') || '[]')
  posts.push({
    id: Math.random().toString(36).substring(7),
    user_id: userId,
    titulo: 'Dúvida sobre manejo de pastagem',
    conteudo: 'Qual a melhor época para iniciar o pastejo rotacionado?',
    categoria: 'Pecuária',
    data: 'Hoje',
  })
  localStorage.setItem('db_comunidade_posts', JSON.stringify(posts))

  // Animais
  const animais = JSON.parse(localStorage.getItem('db_pecuaria_animais') || '[]')
  animais.push({
    id: Math.random().toString(36).substring(7),
    user_id: userId,
    tipo: 'bovino',
    peso: 450,
    fase: 'terminacao',
    racao_recomendada: 'Yara',
    custo_mensal: 405,
  })
  localStorage.setItem('db_pecuaria_animais', JSON.stringify(animais))

  // Produtos (shared)
  if (!localStorage.getItem('db_marketplace_produtos')) {
    const produtos = [
      {
        id: '1',
        nome: 'Ração BASF',
        preco: 'R$ 2.090/ton',
        markup_10pct: true,
        estoque: 50,
        image: 'https://img.usecurling.com/p/400/300?q=animal%20feed',
      },
      {
        id: '2',
        nome: 'Sementes Monsoy',
        preco: 'R$ 800/sc',
        markup_10pct: true,
        estoque: 200,
        image: 'https://img.usecurling.com/p/400/300?q=soybean%20seeds',
      },
      {
        id: '3',
        nome: 'Fertilizante Yara',
        preco: 'R$ 1.200/ton',
        markup_10pct: true,
        estoque: 150,
        image: 'https://img.usecurling.com/p/400/300?q=fertilizer%20bags',
      },
    ]
    localStorage.setItem('db_marketplace_produtos', JSON.stringify(produtos))
  }
}
