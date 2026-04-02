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

    const normalizedEmail = email.trim().toLowerCase()

    // Securely check if user exists via RPC to provide accurate error messages
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/check_user_exists`, {
      method: 'POST',
      headers: getSupabaseHeaders(),
      body: JSON.stringify({ lookup_email: normalizedEmail }),
    })

    if (rpcRes.ok) {
      const exists = await rpcRes.json()
      if (exists === false) {
        throw new Error('Usuário não existe no banco de dados')
      }
    }

    // Perform Auth - Secure comparison for email and password fields
    const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: getSupabaseHeaders(),
      body: JSON.stringify({ email: normalizedEmail, password: senha }),
    })

    const authData = await authRes.json()
    if (!authRes.ok) {
      throw new Error('Senha Incorreta')
    }

    const token = authData.access_token
    const userId = authData.user?.id

    // Ensure login logic specifically targets the users table used by registration, querying by email
    let u = null

    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(normalizedEmail)}&select=*`,
      {
        headers: getSupabaseHeaders(token),
      },
    )

    if (profileRes.ok) {
      const data = await profileRes.json()
      if (data && data.length > 0) {
        u = data[0]
      }
    }

    if (!u) {
      throw new Error('Perfil não encontrado')
    }

    u.plano = u.plano_ativo

    localStorage.setItem('sb_access_token', token)
    localStorage.setItem('sb_user_id', userId)
    setUser(u)
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
