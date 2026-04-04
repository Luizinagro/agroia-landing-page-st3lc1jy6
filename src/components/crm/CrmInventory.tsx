import { Search, Plus, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
]

export function CrmInventory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Estoque de Insumos</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Controle total sobre seus insumos. Evite desperdícios.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Insumo
        </Button>
      </div>

      <div className="bg-[#050505] border border-[#1DB954]/20 rounded-xl p-3 flex items-center gap-3">
        <Search className="w-5 h-5 text-[#E0E0E0]" />
        <input
          type="text"
          placeholder="Buscar insumos..."
          className="bg-transparent border-none outline-none text-[#FFFFFF] w-full placeholder:text-[#E0E0E0]/50 font-medium text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INSUMOS_MOCK.map((item) => (
          <div
            key={item.id}
            className="bg-[#050505] border border-[#1DB954]/20 rounded-[16px] p-5 flex flex-col relative overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(29,185,84,0.15)]"
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/20 px-2 py-1 rounded-full">
                {item.categoria}
              </span>
              {item.status !== 'ok' && (
                <AlertTriangle
                  className={`w-4 h-4 ${item.status === 'critico' ? 'text-red-500' : 'text-yellow-500'}`}
                />
              )}
            </div>
            <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">{item.nome}</h3>
            <div className="mt-auto flex items-end justify-between">
              <div>
                <p className="text-xs text-[#E0E0E0] font-semibold mb-1">Em Estoque</p>
                <p className="text-2xl font-black text-[#FFFFFF]">
                  {item.qtd}{' '}
                  <span className="text-sm font-medium text-[#E0E0E0]">{item.unidade}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
