import { SEO } from '@/components/SEO'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Map, QrCode, ShieldCheck, ArrowRight } from 'lucide-react'

const Rastreabilidade = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 animate-fade-in-up">
      <SEO
        title="Rastreabilidade"
        description="Acompanhe a origem e o ciclo de vida dos seus produtos."
      />

      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a3c34] flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#f4d03f]" />
            Rastreabilidade de Ponta a Ponta
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Gere confiança e transparência para o mercado rastreando toda a cadeia produtiva.
          </p>
        </div>
        <Button className="bg-[#1a3c34] text-white hover:bg-[#1a3c34]/90 shadow-md">
          <QrCode className="w-4 h-4 mr-2" />
          Gerar Novo Lote
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-[#f4d03f] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-[#1a3c34]">Origem Certificada</CardTitle>
            <CardDescription>Registre a procedência de cada item</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
              <Map className="w-12 h-12 text-[#1a3c34]/40" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 text-center font-medium">
              Acompanhamento detalhado de propriedades e talhões de origem de forma imutável.
            </p>
            <Button variant="link" className="w-full mt-2 text-[#1a3c34]">
              Ver mapa de calor <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-[#1a3c34] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-[#1a3c34]">Passaporte Digital</CardTitle>
            <CardDescription>QR Codes individuais por produto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
              <QrCode className="w-12 h-12 text-[#1a3c34]/40" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 text-center font-medium">
              O consumidor final acessa todo o histórico de produção e colheita pelo celular.
            </p>
            <Button variant="link" className="w-full mt-2 text-[#1a3c34]">
              Gerenciar QR Codes <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-green-600 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-[#1a3c34]">Compliance Automático</CardTitle>
            <CardDescription>Adequação às normas exigidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
              <ShieldCheck className="w-12 h-12 text-[#1a3c34]/40" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 text-center font-medium">
              Garantia de atendimento contínuo às mais rígidas regulamentações ambientais e
              sanitárias.
            </p>
            <Button variant="link" className="w-full mt-2 text-[#1a3c34]">
              Acessar relatórios <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Rastreabilidade
