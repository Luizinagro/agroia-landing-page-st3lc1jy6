import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tractor, ArrowLeft, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !senha) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    setIsLoading(true)
    try {
      await login(email, senha)
      toast({ title: 'Bem-vindo(a)!', description: 'Login realizado com sucesso.' })
      navigate('/dashboard')
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao fazer login.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a3c34] flex flex-col justify-center items-center p-4 selection:bg-[#f4d03f]/30 font-sans">
      <Link
        to="/"
        className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Início
      </Link>

      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-[#f4d03f] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Tractor className="w-8 h-8 text-[#1a3c34]" />
        </div>
        <h1 className="text-3xl font-bold text-white">AgroIA</h1>
        <p className="text-white/60 mt-2">Plataforma Inteligente para o Agronegócio</p>
      </div>

      <Card className="w-full max-w-md border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-[#1a3c34]">Acesso ao Sistema</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua fazenda. <br />
            (Novos usuários serão cadastrados automaticamente)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="produtor@fazenda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-[#1a3c34]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-sm font-medium text-[#1a3c34] hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="focus-visible:ring-[#1a3c34]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 h-11 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col text-center border-t bg-muted/30 pt-4">
          <div className="text-sm text-muted-foreground">
            Ao entrar, você concorda com nossos <br />
            <a href="#" className="underline hover:text-foreground">
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a href="#" className="underline hover:text-foreground">
              Política de Privacidade
            </a>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
