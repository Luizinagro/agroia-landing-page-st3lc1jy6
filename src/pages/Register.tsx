import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

const ESTADOS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    estado: '',
    cidade: '',
    acceptTerms: false,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, estado: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.acceptTerms) {
      toast({
        title: 'Termos obrigatórios',
        description:
          'Você precisa aceitar os Termos de Uso e a Política de Privacidade para continuar.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            name: formData.name,
            cpf: formData.cpf,
            phone: formData.phone,
            estado: formData.estado,
            cidade: formData.cidade,
            terms_accepted: formData.acceptTerms,
            terms_accepted_at: new Date().toISOString(),
          },
        },
      })
      if (error) throw error
      toast({
        title: 'Conta criada com sucesso!',
        description:
          'Verifique seu email para confirmar o cadastro, ou faça login se a confirmação estiver desativada.',
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
    <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4 relative overflow-hidden py-24">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-float"></div>

      <div className="w-full max-w-2xl p-8 rounded-2xl bg-black/60 border border-primary/20 backdrop-blur-xl shadow-2xl animate-fade-in-up mt-8">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center justify-center mb-6">
            <Logo />
          </Link>
          <h2 className="text-2xl font-bold text-center text-white">Crie sua conta</h2>
          <p className="text-muted-foreground text-sm mt-2 text-center">
            Complete seu cadastro para ter acesso a toda inteligência da AgroIA
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">
                Nome Completo *
              </Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-black/50 border-primary/30 focus-visible:ring-primary text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-muted-foreground">
                CPF *
              </Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
                required
                className="bg-black/50 border-primary/30 focus-visible:ring-primary text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-muted-foreground">
                Telefone (WhatsApp) *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-black/50 border-primary/30 focus-visible:ring-primary text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-muted-foreground">
                Estado *
              </Label>
              <Select value={formData.estado} onValueChange={handleStateChange} required>
                <SelectTrigger className="bg-black/50 border-primary/30 focus:ring-primary text-foreground">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-primary/20 text-white max-h-60">
                  {ESTADOS.map((uf) => (
                    <SelectItem
                      key={uf}
                      value={uf}
                      className="focus:bg-primary/20 focus:text-white cursor-pointer"
                    >
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cidade" className="text-muted-foreground">
                Cidade *
              </Label>
              <Input
                id="cidade"
                placeholder="Sua cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
                className="bg-black/50 border-primary/30 focus-visible:ring-primary text-foreground"
              />
            </div>
          </div>

          <div className="border-t border-primary/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">
                Email de Acesso *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-black/50 border-primary/30 focus-visible:ring-primary text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">
                Senha *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="bg-black/50 border-primary/30 focus-visible:ring-primary text-foreground"
              />
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, acceptTerms: checked === true }))
              }
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-black border-primary/50"
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-medium text-muted-foreground cursor-pointer"
              >
                Eu concordo com os{' '}
                <Dialog>
                  <DialogTrigger asChild>
                    <span
                      className="text-primary hover:underline cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Termos de Uso
                    </span>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col bg-zinc-950 border-primary/20 text-foreground">
                    <DialogHeader>
                      <DialogTitle>Termos de Uso - AgroIA</DialogTitle>
                      <DialogDescription>
                        Leia atentamente os termos de uso antes de prosseguir.
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <p>
                          <strong>1. Aceitação dos Termos</strong>
                          <br />
                          Ao acessar e utilizar a plataforma AgroIA, você concorda em cumprir e
                          ficar vinculado aos seguintes Termos de Uso. Se você não concorda com
                          estes termos, por favor, não utilize a plataforma.
                        </p>
                        <p>
                          <strong>2. Descrição do Serviço</strong>
                          <br />A AgroIA fornece serviços de análise de dados agrícolas, previsões
                          de mercado baseadas em IA, monitoramento por satélite e ferramentas de
                          gestão agropecuária.
                        </p>
                        <p>
                          <strong>3. Cadastro e Segurança</strong>
                          <br />
                          Você é responsável por manter a confidencialidade de sua conta e senha, e
                          por todas as atividades que ocorram sob sua conta. Você concorda em
                          fornecer informações verdadeiras, exatas, atuais e completas durante o
                          registro.
                        </p>
                        <p>
                          <strong>4. Privacidade e Dados</strong>
                          <br />O uso de seus dados pessoais é regido por nossa Política de
                          Privacidade. Ao utilizar a AgroIA, você consente com o processamento de
                          seus dados (incluindo dados agronômicos e de geolocalização) para a
                          prestação e melhoria dos serviços.
                        </p>
                        <p>
                          <strong>5. Propriedade Intelectual</strong>
                          <br />
                          Todo o conteúdo, design, algoritmos e modelos de IA da plataforma são de
                          propriedade exclusiva da AgroIA. É proibida a reprodução, modificação ou
                          distribuição sem autorização prévia.
                        </p>
                        <p>
                          <strong>6. Limitação de Responsabilidade</strong>
                          <br />A AgroIA fornece previsões e análises com base em modelos de IA e
                          dados de terceiros. Não garantimos a exatidão absoluta e não nos
                          responsabilizamos por decisões financeiras ou agronômicas tomadas com base
                          nas informações da plataforma. O uso das informações é de sua inteira
                          responsabilidade.
                        </p>
                        <p>
                          <strong>7. Modificações dos Termos</strong>
                          <br />A AgroIA reserva-se o direito de modificar estes termos a qualquer
                          momento. As alterações entrarão em vigor imediatamente após a publicação
                          na plataforma.
                        </p>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>{' '}
                e a{' '}
                <Dialog>
                  <DialogTrigger asChild>
                    <span
                      className="text-primary hover:underline cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Política de Privacidade
                    </span>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col bg-zinc-950 border-primary/20 text-foreground">
                    <DialogHeader>
                      <DialogTitle>Política de Privacidade - AgroIA</DialogTitle>
                      <DialogDescription>
                        Saiba como coletamos e utilizamos seus dados.
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <p>
                          <strong>1. Coleta de Dados</strong>
                          <br />
                          Coletamos informações fornecidas por você durante o cadastro (Nome, CPF,
                          e-mail, telefone, Estado, Cidade) e dados inseridos na plataforma
                          (localização da propriedade, dados de safra, rebanho, etc.).
                        </p>
                        <p>
                          <strong>2. Uso dos Dados</strong>
                          <br />
                          Utilizamos seus dados para fornecer serviços personalizados, gerar
                          análises preditivas via IA, enviar alertas regionais e melhorar
                          continuamente nossos algoritmos e funcionalidades.
                        </p>
                        <p>
                          <strong>3. Compartilhamento de Dados</strong>
                          <br />
                          Não vendemos seus dados pessoais. Podemos compartilhar informações
                          anonimizadas e agregadas com parceiros para fins estatísticos ou de
                          pesquisa. Dados podem ser compartilhados com autoridades competentes
                          quando exigido por lei.
                        </p>
                        <p>
                          <strong>4. Segurança</strong>
                          <br />
                          Empregamos medidas de segurança técnicas e organizacionais (como
                          criptografia e infraestrutura em nuvem segura) para proteger seus dados
                          contra acesso não autorizado, alteração ou destruição.
                        </p>
                        <p>
                          <strong>5. Retenção de Dados</strong>
                          <br />
                          Seus dados serão mantidos enquanto sua conta estiver ativa ou pelo tempo
                          necessário para cumprir obrigações legais e regulatórias.
                        </p>
                        <p>
                          <strong>6. Seus Direitos (LGPD)</strong>
                          <br />
                          Você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão
                          de seus dados pessoais a qualquer momento. Para exercer esses direitos,
                          entre em contato através de nossos canais de suporte na plataforma.
                        </p>
                        <p>
                          <strong>7. Alterações na Política</strong>
                          <br />
                          Esta política pode ser atualizada periodicamente. Notificaremos os
                          usuários sobre mudanças significativas através de alertas na plataforma ou
                          por e-mail.
                        </p>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>{' '}
                da AgroIA. *
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-black hover:bg-primary/90 mt-6 font-semibold h-12 text-lg"
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
