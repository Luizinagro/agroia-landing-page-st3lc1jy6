import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

export type User = {
  id: string
  email: string
  senha_hash?: string
  nome: string
  name?: string
  phone?: string
  address?: string
  tipo_usuario: string
  user_type?: string
  estado: string
  status?: string
  data_criacao: string
  created_at?: string
  data_trial_expira: string
  trial_expires_at?: string
  plano_ativo: string
  plan_active?: string
  plano?: string
  cpf?: string
  estado?: string
  cidade?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()

      if (data) {
        setUser({
          ...data,
          nome: data.name || 'Usuário',
          tipo_usuario: data.user_type || 'produtor',
          estado: data.status || 'Ativo',
          data_criacao: data.created_at || new Date().toISOString(),
          data_trial_expira:
            data.trial_expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          plano_ativo: data.plan_active || 'Básico',
          plano: data.plan_active || 'Básico',
        } as User)
      } else {
        // Fallback for user without profile row yet (e.g., trigger latency)
        setUser({
          id: userId,
          email: email,
          nome: 'Usuário',
          tipo_usuario: 'produtor',
          estado: 'Ativo',
          data_criacao: new Date().toISOString(),
          data_trial_expira: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          plano_ativo: 'Básico',
          plano: 'Básico',
        })
      }
    } catch (e) {
      console.error('Error fetching profile:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // FORBIDDEN: no async/await inside this callback — sync only
      if (!mounted) return
      setSession(session)
      if (session?.user) {
        setLoading(true)
        fetchProfile(session.user.id, session.user.email || '')
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '')
      } else {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, senha: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      throw error
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return
    const dbUpdates: any = { ...updates }
    if (dbUpdates.plano) {
      dbUpdates.plan_active = dbUpdates.plano
      delete dbUpdates.plano
    }
    if (dbUpdates.plano_ativo) {
      dbUpdates.plan_active = dbUpdates.plano_ativo
      delete dbUpdates.plano_ativo
    }
    if (dbUpdates.nome) {
      dbUpdates.name = dbUpdates.nome
      delete dbUpdates.nome
    }

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', user.id)
      .select()
      .single()

    if (data) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              ...data,
              nome: data.name || prev.nome,
              plano_ativo: data.plan_active || prev.plano_ativo,
              plano: data.plan_active || prev.plano,
            }
          : null,
      )
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
