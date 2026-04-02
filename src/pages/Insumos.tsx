import { Search, Plus, AlertTriangle } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Logo } from '@/components/ui/logo'

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
  return (
    <div className="min-h-screen bg-[#000000] p-4 sm:p-8">
      <SEO
        title="Estoque de Insumos | AgroIA"
        description="Controle total sobre seus insumos. Evite desperdícios e garanta a disponibilidade no momento certo."
      />

      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 bg-[#050505] p-6 rounded-2xl border border-[#1DB954]/20">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF] flex items-center gap-3">
              <Logo className="w-8 h-8 text-[#1DB954]" />
              Estoque de Insumos
            </h1>
            <p className="text-[#E0E0E0] mt-2 text-lg font-medium">
              Controle total sobre seus insumos. Evite desperdícios e garanta a disponibilidade no
              momento certo.
            </p>
          </div>

          <button className="btn-agro-primary font-bold whitespace-nowrap px-6 py-3 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Insumo
          </button>
        </div>

        <div className="bg-[#050505] border border-[#1DB954]/20 rounded-xl p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#E0E0E0]" />
          <input
            type="text"
            placeholder="Buscar insumos por nome ou categoria..."
            className="bg-transparent border-none outline-none text-[#FFFFFF] w-full placeholder:text-[#E0E0E0]/50 font-medium"
          />
        </div>

        <div className="grid-responsive">
          {INSUMOS_MOCK.map((item) => (
            <div
              key={item.id}
              className="bg-[#050505] border border-[#1DB954]/20 rounded-[16px] p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(29,185,84,0.15)]"
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
                <span className="text-xs font-bold uppercase tracking-wider text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/20 px-3 py-1 rounded-full">
                  {item.categoria}
                </span>
                {item.status !== 'ok' && (
                  <AlertTriangle
                    className={`w-5 h-5 ${item.status === 'critico' ? 'text-red-500' : 'text-yellow-500'}`}
                  />
                )}
              </div>

              <h3 className="text-xl font-bold text-[#FFFFFF] mb-6">{item.nome}</h3>

              <div className="mt-auto flex items-end justify-between">
                <div>
                  <p className="text-sm text-[#E0E0E0] font-semibold mb-1">Quantidade em Estoque</p>
                  <p className="text-3xl font-black text-[#FFFFFF]">
                    {item.qtd}{' '}
                    <span className="text-base font-medium text-[#E0E0E0]">{item.unidade}</span>
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
