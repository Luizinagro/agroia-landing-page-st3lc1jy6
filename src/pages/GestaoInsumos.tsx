import { useState } from 'react'
import { DashboardInsumos } from '@/components/gestao-insumos/DashboardInsumos'
import { ListaInsumos } from '@/components/gestao-insumos/ListaInsumos'

export default function GestaoInsumos() {
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((k) => k + 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Insumos e Estoque 🌿
        </h1>
        <p className="text-zinc-400">
          Gerencie seus produtos, controle de compras e aplicações no campo.
        </p>
      </div>

      <DashboardInsumos refreshKey={refreshKey} />
      <ListaInsumos refreshKey={refreshKey} onRefresh={refresh} />
    </div>
  )
}
