import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type User = {
  id: string
  email: string
  senha?: string
  plano: string
  data_criacao: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('agroia_session')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, senha: string) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))

    // Get users from DB
    const usersStr = localStorage.getItem('db_users') || '[]'
    const users: User[] = JSON.parse(usersStr)

    let found = users.find((u) => u.email === email && u.senha === senha)
    if (!found) {
      // Auto-register for demo purposes
      found = {
        id: Math.random().toString(36).substring(7),
        email,
        senha,
        plano: 'Pro',
        data_criacao: new Date().toISOString(),
      }
      users.push(found)
      localStorage.setItem('db_users', JSON.stringify(users))

      // Seed initial data for new user
      seedUserData(found.id)
    }

    // Create session (without password)
    const sessionUser = { ...found }
    delete sessionUser.senha

    localStorage.setItem('agroia_session', JSON.stringify(sessionUser))
    setUser(sessionUser)
  }

  const logout = () => {
    localStorage.removeItem('agroia_session')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
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
