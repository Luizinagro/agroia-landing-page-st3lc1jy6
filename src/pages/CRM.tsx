import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CRM() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isAdmin = user?.user_type === 'admin' || user?.tipo_usuario === 'admin'

  useEffect(() => {
    if (user && !isAdmin) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, isAdmin, navigate])

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
        <p className="text-zinc-400 mb-6 max-w-md">
          Você não tem permissão para acessar esta página. Esta área é exclusiva para
          administradores.
        </p>
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-primary text-black hover:bg-primary/90 rounded-full font-bold"
        >
          Voltar ao Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-6">CRM (Admin)</h1>
      <div className="bg-zinc-950 border border-primary/20 rounded-2xl p-8 text-center text-zinc-400 shadow-[0_0_15px_rgba(29,185,84,0.1)]">
        <p>Módulo de CRM está sendo carregado...</p>
      </div>
    </div>
  )
}
