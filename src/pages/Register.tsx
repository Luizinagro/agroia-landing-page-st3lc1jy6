import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      })
      if (error) throw error
      toast({
        title: 'Conta criada!',
        description: 'Verifique seu email para confirmar o cadastro.',
      })
      navigate('/login')
    } catch (error: any) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-float"></div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-black/60 border border-primary/20 backdrop-blur-xl shadow-2xl animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Logo className="h-10 w-10" />
          </Link>
          <h2 className="text-2xl font-bold text-center text-white">Crie sua conta</h2>
          <p className="text-muted-foreground text-sm mt-2 text-center">
            Comece a revolucionar sua gestão rural hoje mesmo
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black/50 border-primary/30 focus-visible:ring-primary text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-black/50 border-primary/30 focus-visible:ring-primary text-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-black hover:bg-primary/90 mt-6 font-semibold"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Conta na AgroIA'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
