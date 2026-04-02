import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Tractor, ArrowLeft, Loader2, UserPlus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

const registerSchema = z
  .object({
    nomeCompleto: z.string().min(3, 'Mínimo de 3 caracteres.'),
    email: z.string().email('E-mail inválido.'),
    senha: z
      .string()
      .min(8, 'Mínimo de 8 caracteres.')
      .regex(/[A-Za-z]/, 'Requer uma letra.')
      .regex(/[0-9]/, 'Requer um número.')
      .regex(/[^A-Za-z0-9]/, 'Requer um símbolo.'),
    confirmarSenha: z.string(),
    tipoUsuario: z.enum(['Produtor', 'Cooperativa'], { required_error: 'Obrigatório.' }),
    estado: z.enum(['Paraná', 'Rondônia'], { required_error: 'Obrigatório.' }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nomeCompleto: '', email: '', senha: '', confirmarSenha: '' },
    mode: 'onChange',
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const normalizedEmail = data.email.trim().toLowerCase()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: data.senha,
        options: {
          data: {
            name: data.nomeCompleto,
            user_type: data.tipoUsuario,
            estado: data.estado,
          },
        },
      })

      if (authError) {
        const errorMsg = authError.message || ''
        if (errorMsg.includes('already registered')) {
          toast({
            title: 'Erro de Cadastro',
            description: 'Este e-mail já está em uso.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Erro',
            description: errorMsg || 'Erro ao criar conta no Supabase Auth.',
            variant: 'destructive',
          })
        }
        return
      }

      toast({
        title: 'Sucesso',
        description: 'Conta criada com sucesso! Faça login agora.',
        className: 'bg-[#1a3c34] text-white border-[#f4d03f]',
      })
      navigate('/login')
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao processar o cadastro.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const messageClass = 'text-[#1a3c34] bg-[#f4d03f]/40 px-2 py-1 rounded text-xs mt-1 inline-block'

  return (
    <div className="min-h-screen bg-[#1a3c34] flex flex-col justify-center items-center p-4 selection:bg-[#f4d03f]/30 font-sans">
      <Link
        to="/"
        className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Início
      </Link>

      <div className="mb-6 flex flex-col items-center mt-12 sm:mt-8">
        <div className="w-16 h-16 bg-[#f4d03f] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Tractor className="w-8 h-8 text-[#1a3c34]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
      </div>

      <Card className="w-full max-w-md border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-2xl text-[#1a3c34] flex items-center justify-center gap-2">
            Novo Usuário <UserPlus className="w-5 h-5 text-[#1a3c34]" />
          </CardTitle>
          <CardDescription>Preencha os dados para acessar a plataforma AgroIA.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nomeCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="João da Silva"
                        className="focus-visible:ring-[#1a3c34]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="joao@fazenda.com"
                        className="focus-visible:ring-[#1a3c34]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoUsuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-[#1a3c34]">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Produtor">Produtor</SelectItem>
                          <SelectItem value="Cooperativa">Cooperativa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-[#1a3c34]">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Paraná">Paraná</SelectItem>
                          <SelectItem value="Rondônia">Rondônia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="focus-visible:ring-[#1a3c34]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmarSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="focus-visible:ring-[#1a3c34]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 h-11 text-base mt-4 transition-all"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-[#f4d03f]" /> Criando
                    conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t bg-muted/30 pt-4">
          <div className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-semibold text-[#1a3c34] hover:underline">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
