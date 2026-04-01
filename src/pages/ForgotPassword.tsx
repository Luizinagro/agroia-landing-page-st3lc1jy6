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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tractor, ArrowLeft, Loader2, KeyRound, Mail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const forgotSchema = z.object({
  email: z.string().email('Formato de e-mail inválido.'),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true)
    try {
      // Simulate API call for password recovery
      await new Promise((r) => setTimeout(r, 800))
      setIsSubmitted(true)
      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o e-mail de recuperação.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a3c34] flex flex-col justify-center items-center p-4 selection:bg-[#f4d03f]/30 font-sans">
      <Link
        to="/login"
        className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-2 transition-colors py-2 pr-4 rounded-md active:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Login
      </Link>

      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-[#f4d03f] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <Tractor className="w-8 h-8 text-[#1a3c34]" />
        </div>
        <h1 className="text-3xl font-bold text-white">AgroIA</h1>
      </div>

      <Card className="w-full max-w-md border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-[#1a3c34] flex items-center justify-center gap-2">
            Recuperar Senha <KeyRound className="w-5 h-5 text-[#1a3c34]" />
          </CardTitle>
          <CardDescription>
            Informe seu e-mail para receber as instruções de redefinição de senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail cadastrado</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="produtor@fazenda.com"
                          className="focus-visible:ring-[#1a3c34] h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[#1a3c34] bg-[#f4d03f]/40 px-2 py-1 rounded text-xs mt-1 inline-block" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 h-12 text-lg font-medium transition-all"
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin text-[#f4d03f]" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Link de Recuperação'
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto w-12 h-12 bg-[#1a3c34]/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#1a3c34]" />
              </div>
              <h3 className="text-lg font-medium text-[#1a3c34]">Verifique seu e-mail</h3>
              <p className="text-sm text-muted-foreground">
                Enviamos um link de recuperação para <strong>{form.getValues('email')}</strong>. Por
                favor, verifique também sua caixa de spam.
              </p>
              <Button
                variant="outline"
                className="w-full mt-4 h-12 border-[#1a3c34] text-[#1a3c34] hover:bg-[#1a3c34] hover:text-white transition-colors"
                onClick={() => navigate('/login')}
              >
                Voltar para o Login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col text-center border-t bg-muted/30 pt-6 pb-6">
          <Link
            to="/cadastro"
            className="font-semibold text-[#1a3c34] hover:underline decoration-[#f4d03f] decoration-2 transition-all block py-2 px-4 rounded-md active:bg-muted"
          >
            Não tem conta? Criar uma agora
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
