import { useLocation, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react'
import { SEO } from '@/components/SEO'

export default function BlockedAccess() {
  const location = useLocation()
  const requiredPlan = location.state?.requiredPlan || 'Premium'
  const from = location.state?.from || '/dashboard'

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-sans animate-in fade-in duration-500 bg-background">
      <SEO title="Acesso Bloqueado" description="Funcionalidade restrita ao seu plano atual." />

      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg border border-border p-8 text-center animate-slide-up">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1.5 shadow-sm border border-border">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-3">Acesso Restrito</h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          Esta funcionalidade requer o plano{' '}
          <strong className="text-green-700 dark:text-green-500 font-semibold">
            {requiredPlan}
          </strong>
          . Faça o upgrade agora para desbloquear este e muitos outros recursos exclusivos.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md font-medium h-12"
            size="lg"
          >
            <Link to="/selecionar-plano">Fazer Upgrade Agora</Link>
          </Button>

          <Button asChild variant="outline" className="w-full h-12" size="lg">
            <Link to={from === location.pathname ? '/dashboard' : from}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
