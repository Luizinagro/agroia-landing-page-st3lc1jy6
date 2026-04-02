import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tractor, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { checkRateLimit, logSystemEvent } from '@/lib/security'

const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido.'),
  senha: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginFormValues) => {
    // Implement Login Rate Limiting (5 attempts / 5 mins)
    const canLogin = checkRateLimit('login', data.email, 5, 5 * 60 * 1000)
    if (!canLogin) {
      toast({
        title: 'Acesso Bloqueado',
        description: 'Muitas tentativas de login. Tente novamente em 5 minutos.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      await login(data.email, data.senha)
      toast({
        title: 'Bem-vindo(a)!',
        description: 'Login realizado com segurança.',
        className: 'bg-[#1a3c34] text-white border-[#f4d03f]',
      })
      navigate('/dashboard')
    } catch (error: any) {
      logSystemEvent('AUTH_ERROR', `Falha de autenticação para ${data.email}`)
      const msg = error.message

      if (msg.includes('Invalid login credentials')) {
        toast({
          title: 'Credenciais Inválidas',
          description: 'E-mail ou senha incorretos.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro de Autenticação',
          description: msg || 'Credenciais inválidas.',
          variant: 'destructive',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col justify-center items-center p-4 selection:bg-agro-green/30 font-sans">
      <Link
        to="/"
        className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Início
      </Link>

      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-premium-gold rounded-[24px] flex items-center justify-center mb-4 shadow-lg">
          <Tractor className="w-8 h-8 text-bg-dark" />
        </div>
        <h1 className="text-3xl font-bold text-white">AgroIA</h1>
        <p className="text-white/60 mt-2">Plataforma Inteligente para o Agronegócio</p>
      </div>

      <Card className="w-full max-w-md border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            Acesso Seguro <ShieldCheck className="w-5 h-5 text-white" />
          </CardTitle>
          <CardDescription>Entre com suas credenciais protegidas de ponta a ponta.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="produtor@fazenda.com"
                        className="focus-visible:ring-agro-green bg-background/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive bg-destructive/10 px-2 py-1 rounded text-xs mt-1 inline-block" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-agro-green hover:underline decoration-agro-green decoration-2 transition-all py-2 px-1 -mr-1 rounded-md active:bg-muted"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        className="focus-visible:ring-agro-green bg-background/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive bg-destructive/10 px-2 py-1 rounded text-xs mt-1 inline-block" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-agro-green text-white hover:bg-agro-green-hover h-11 text-lg font-medium transition-all"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
                    Autenticando...
                  </>
                ) : (
                  'Entrar de Forma Segura'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col text-center border-t bg-muted/30 pt-4">
          <div className="text-sm mb-4 w-full">
            <Link
              to="/cadastro"
              className="font-semibold text-agro-green hover:underline decoration-agro-green decoration-2 transition-all block py-2 px-4 rounded-md active:bg-muted"
            >
              Não tem conta? Criar uma agora
            </Link>
          </div>
          <div className="text-xs text-muted-foreground mb-4 bg-muted p-2 rounded-md">
            Este site é protegido pelo reCAPTCHA v3 e as{' '}
            <a href="#" className="underline hover:text-agro-green">
              Políticas de Privacidade
            </a>{' '}
            e{' '}
            <a href="#" className="underline hover:text-agro-green">
              Termos de Serviço
            </a>{' '}
            do Google se aplicam.
          </div>
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
