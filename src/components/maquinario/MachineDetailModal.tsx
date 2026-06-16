import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabDespesas } from './TabDespesas'
import { TabManutencao } from './TabManutencao'
import { TabDocumentos } from './TabDocumentos'
import { TabHorimetro } from './TabHorimetro'
import { FileText, Settings, Tractor, Wrench } from 'lucide-react'

export function MachineDetailModal({ open, machineId, machineName, onOpenChange }: any) {
  if (!machineId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-zinc-950 border-primary/20 text-white max-h-[90vh] overflow-y-auto p-0 rounded-2xl hide-default-close">
        <DialogHeader className="p-6 pb-2 border-b border-white/5 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
          <DialogTitle className="text-xl flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Tractor className="w-5 h-5" />
            </div>
            {machineName || 'Detalhes da Máquina'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2">
          <Tabs defaultValue="despesas" className="w-full">
            <TabsList className="w-full bg-zinc-900 justify-start overflow-x-auto h-auto p-1 rounded-xl">
              <TabsTrigger
                value="despesas"
                className="data-[state=active]:bg-black data-[state=active]:text-primary flex-1 py-2 rounded-lg"
              >
                <FileText className="w-4 h-4 mr-2" /> Despesas
              </TabsTrigger>
              <TabsTrigger
                value="manutencao"
                className="data-[state=active]:bg-black data-[state=active]:text-primary flex-1 py-2 rounded-lg"
              >
                <Wrench className="w-4 h-4 mr-2" /> Manutenção
              </TabsTrigger>
              <TabsTrigger
                value="documentos"
                className="data-[state=active]:bg-black data-[state=active]:text-primary flex-1 py-2 rounded-lg"
              >
                <Settings className="w-4 h-4 mr-2" /> Documentos
              </TabsTrigger>
              <TabsTrigger
                value="horimetro"
                className="data-[state=active]:bg-black data-[state=active]:text-primary flex-1 py-2 rounded-lg"
              >
                <Tractor className="w-4 h-4 mr-2" /> Horímetro
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 min-h-[400px]">
              <TabsContent value="despesas" className="mt-0 outline-none">
                <TabDespesas maquinaId={machineId} />
              </TabsContent>
              <TabsContent value="manutencao" className="mt-0 outline-none">
                <TabManutencao maquinaId={machineId} />
              </TabsContent>
              <TabsContent value="documentos" className="mt-0 outline-none">
                <TabDocumentos maquinaId={machineId} />
              </TabsContent>
              <TabsContent value="horimetro" className="mt-0 outline-none">
                <TabHorimetro maquinaId={machineId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
