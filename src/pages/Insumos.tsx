import { useRef } from 'react'
import { useGsapAnimations } from '@/hooks/use-gsap-animations'
import { Package, Search, Plus, AlertTriangle } from 'lucide-react'
import { SEO } from '@/components/SEO'

const INSUMOS_MOCK = [
  {
    id: 1,
    nome: 'Fertilizante NPK 10-10-10',
    categoria: 'Fertilizantes',
    qtd: 50,
    unidade: 'sacas (50kg)',
    status: 'ok',
  },
  {
    id: 2,
    nome: 'Semente de Soja Brasmax',
    categoria: 'Sementes',
    qtd: 120,
    unidade: 'sacas (40kg)',
    status: 'ok',
  },
  {
    id: 3,
    nome: 'Herbicida Glyphosate',
    categoria: 'Defensivos',
    qtd: 5,
    unidade: 'litros',
    status: 'alerta',
  },
  {
    id: 4,
    nome: 'Ração Bovinos Engorda',
    categoria: 'Ração',
    qtd: 0,
    unidade: 'sacas (30kg)',
    status: 'critico',
  },
  {
    id: 5,
    nome: 'Semente de Milho Agro',
    categoria: 'Sementes',
    qtd: 200,
    unidade: 'sacas (20kg)',
    status: 'ok',
  },
]

export default function Insumos() {
  const ref = useRef<HTMLDivElement>(null)
  useGsapAnimations(ref)

  return (
    <div ref={ref} className="min-h-screen bg-background p-4 sm:p-8 pt-24">
      <SEO title="Estoque de Insumos | AgroIA" description="Gerenciamento de estoque de insumos" />

      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 gsap-grow">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
              <Package className="w-8 h-8 text-agro-green" />
              Estoque de Insumos
            </h1>
            <p className="text-white/60 mt-2">Gerencie seus produtos, sementes e defensivos.</p>
          </div>

          <button className="btn-agro-primary px-6 py-3 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Insumo
          </button>
        </div>

        <div className="card-glass mb-8 p-4 flex items-center gap-3 gsap-grow">
          <Search className="w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Buscar insumos por nome ou categoria..."
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30"
          />
        </div>

        <div className="grid-responsive gsap-stagger-container">
          {INSUMOS_MOCK.map((item) => (
            <div
              key={item.id}
              className="card-glass p-6 gsap-stagger-item flex flex-col relative overflow-hidden"
            >
              {item.status === 'alerta' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
              )}
              {item.status === 'critico' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
              )}
              {item.status === 'ok' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-agro-green" />
              )}

              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 bg-white/5 px-3 py-1 rounded-full">
                  {item.categoria}
                </span>
                {item.status !== 'ok' && (
                  <AlertTriangle
                    className={`w-5 h-5 ${item.status === 'critico' ? 'text-red-500' : 'text-yellow-500'}`}
                  />
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-6">{item.nome}</h3>

              <div className="mt-auto flex items-end justify-between">
                <div>
                  <p className="text-sm text-white/50 mb-1">Quantidade em Estoque</p>
                  <p className="text-3xl font-black text-white">
                    {item.qtd}{' '}
                    <span className="text-base font-normal text-white/50">{item.unidade}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
