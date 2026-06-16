import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ok = (data: any) =>
  new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
const err = (msg: string, status = 400) =>
  new Response(JSON.stringify({ success: false, error: msg }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') || ''
    if (!authHeader) return err('Não autenticado', 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser()
    if (userError || !user) return err('Não autenticado', 401)

    const admin = createClient(supabaseUrl, supabaseServiceKey)
    const body = req.method !== 'GET' ? await req.json().catch(() => ({})) : {}
    const action = body.action || ''

    // ── LANÇAMENTOS (contas a pagar / receber) ────────────────────

    if (action === 'criar_lancamento') {
      const { descricao, tipo, categoria, valor, vencimento, safra, cultura, observacao } = body
      if (!descricao || !tipo || !valor)
        return err('"descricao", "tipo" e "valor" são obrigatórios')
      const { data, error } = await admin
        .from('financeiro_lancamentos')
        .insert({
          user_id: user.id,
          descricao,
          tipo,
          categoria: categoria || 'outros',
          valor: Number(valor),
          vencimento,
          safra,
          cultura,
          status: 'pendente',
          observacao,
        })
        .select()
        .single()
      if (error) throw error
      return ok(data)
    }

    if (action === 'listar_lancamentos') {
      const { tipo, status, mes, ano, safra } = body
      let q = admin.from('financeiro_lancamentos').select('*').eq('user_id', user.id)
      if (tipo) q = q.eq('tipo', tipo)
      if (status) q = q.eq('status', status)
      if (safra) q = q.eq('safra', safra)
      if (ano && mes)
        q = q
          .gte('vencimento', `${ano}-${String(mes).padStart(2, '0')}-01`)
          .lte('vencimento', `${ano}-${String(mes).padStart(2, '0')}-31`)
      else if (ano) q = q.gte('vencimento', `${ano}-01-01`).lte('vencimento', `${ano}-12-31`)
      const { data, error } = await q.order('vencimento', { ascending: true })
      if (error) throw error

      const receitas = (data || [])
        .filter((l: any) => l.tipo === 'receita')
        .reduce((s: number, l: any) => s + Number(l.valor), 0)
      const despesas = (data || [])
        .filter((l: any) => l.tipo === 'despesa')
        .reduce((s: number, l: any) => s + Number(l.valor), 0)
      const pendentes = (data || []).filter(
        (l: any) =>
          l.status === 'pendente' && l.tipo === 'despesa' && new Date(l.vencimento) < new Date(),
      ).length
      return ok({
        lancamentos: data,
        resumo: { receitas, despesas, saldo: receitas - despesas, pendentes_vencidos: pendentes },
      })
    }

    if (action === 'pagar_lancamento') {
      const { id, data_pagamento } = body
      if (!id) return err('"id" é obrigatório')
      const { data, error } = await admin
        .from('financeiro_lancamentos')
        .update({
          status: 'pago',
          data_pagamento: data_pagamento || new Date().toISOString().split('T')[0],
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
      if (error) throw error
      return ok(data)
    }

    if (action === 'deletar_lancamento') {
      const { id } = body
      const { error } = await admin
        .from('financeiro_lancamentos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      if (error) throw error
      return ok({ deleted: true })
    }

    // ── FLUXO DE CAIXA ────────────────────────────────────────────

    if (action === 'fluxo_caixa') {
      const ano = body.ano || new Date().getFullYear()
      const { data, error } = await admin
        .from('financeiro_lancamentos')
        .select('tipo, valor, vencimento, status')
        .eq('user_id', user.id)
        .gte('vencimento', `${ano}-01-01`)
        .lte('vencimento', `${ano}-12-31`)
      if (error) throw error

      const meses: any[] = []
      for (let m = 1; m <= 12; m++) {
        const mesStr = String(m).padStart(2, '0')
        const lancsMes = (data || []).filter((l: any) =>
          l.vencimento?.startsWith(`${ano}-${mesStr}`),
        )
        const receitas = lancsMes
          .filter((l: any) => l.tipo === 'receita')
          .reduce((s: number, l: any) => s + Number(l.valor), 0)
        const despesas = lancsMes
          .filter((l: any) => l.tipo === 'despesa')
          .reduce((s: number, l: any) => s + Number(l.valor), 0)
        meses.push({
          mes: m,
          nome_mes: new Date(ano, m - 1, 1).toLocaleDateString('pt-BR', { month: 'short' }),
          receitas,
          despesas,
          saldo: receitas - despesas,
        })
      }
      const saldo_acumulado: number[] = []
      let acum = 0
      for (const m of meses) {
        acum += m.saldo
        saldo_acumulado.push(Number(acum.toFixed(2)))
      }
      return ok({ meses, saldo_acumulado, ano })
    }

    // ── CUSTO POR SACA / HECTARE ──────────────────────────────────

    if (action === 'custo_producao') {
      const { safra, cultura, area_hectares, produtividade_sacas_ha } = body
      if (!safra) return err('"safra" é obrigatório')

      const { data, error } = await admin
        .from('financeiro_lancamentos')
        .select('categoria, valor, tipo')
        .eq('user_id', user.id)
        .eq('safra', safra)
        .eq('tipo', 'despesa')
      if (error) throw error

      const total_despesas = (data || []).reduce((s: number, l: any) => s + Number(l.valor), 0)
      const por_categoria: Record<string, number> = {}
      for (const l of data || []) {
        por_categoria[l.categoria] = (por_categoria[l.categoria] || 0) + Number(l.valor)
      }

      const area = Number(area_hectares) || 1
      const produt = Number(produtividade_sacas_ha) || 60
      const custo_por_ha = total_despesas / area
      const custo_por_saca = total_despesas / (area * produt)
      const ponto_equilibrio_sacas = custo_por_ha / (produt > 0 ? produt : 60)

      return ok({
        safra,
        cultura,
        area_hectares: area,
        total_despesas: Number(total_despesas.toFixed(2)),
        custo_por_ha: Number(custo_por_ha.toFixed(2)),
        custo_por_saca: Number(custo_por_saca.toFixed(2)),
        ponto_equilibrio_sacas: Number(ponto_equilibrio_sacas.toFixed(1)),
        por_categoria,
        produtividade_sacas_ha: produt,
      })
    }

    // ── DASHBOARD FINANCEIRO ──────────────────────────────────────

    if (action === 'dashboard') {
      const hoje = new Date()
      const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0')
      const anoAtual = hoje.getFullYear()

      const { data, error } = await admin
        .from('financeiro_lancamentos')
        .select('tipo, valor, status, vencimento')
        .eq('user_id', user.id)
        .gte('vencimento', `${anoAtual}-01-01`)
      if (error) throw error

      const doMes = (data || []).filter((l: any) =>
        l.vencimento?.startsWith(`${anoAtual}-${mesAtual}`),
      )
      const receita_mes = doMes
        .filter((l: any) => l.tipo === 'receita')
        .reduce((s: number, l: any) => s + Number(l.valor), 0)
      const despesa_mes = doMes
        .filter((l: any) => l.tipo === 'despesa')
        .reduce((s: number, l: any) => s + Number(l.valor), 0)
      const receita_ano = (data || [])
        .filter((l: any) => l.tipo === 'receita')
        .reduce((s: number, l: any) => s + Number(l.valor), 0)
      const despesa_ano = (data || [])
        .filter((l: any) => l.tipo === 'despesa')
        .reduce((s: number, l: any) => s + Number(l.valor), 0)
      const vencidas = (data || []).filter(
        (l: any) =>
          l.status === 'pendente' && l.tipo === 'despesa' && new Date(l.vencimento) < hoje,
      ).length
      const a_vencer_7d = (data || []).filter((l: any) => {
        if (l.status !== 'pendente' || l.tipo !== 'despesa') return false
        const diff = (new Date(l.vencimento).getTime() - hoje.getTime()) / 86400000
        return diff >= 0 && diff <= 7
      }).length

      return ok({
        mes_atual: {
          receitas: Number(receita_mes.toFixed(2)),
          despesas: Number(despesa_mes.toFixed(2)),
          saldo: Number((receita_mes - despesa_mes).toFixed(2)),
        },
        ano_atual: {
          receitas: Number(receita_ano.toFixed(2)),
          despesas: Number(despesa_ano.toFixed(2)),
          saldo: Number((receita_ano - despesa_ano).toFixed(2)),
        },
        alertas: { contas_vencidas: vencidas, vence_em_7_dias: a_vencer_7d },
      })
    }

    return err(
      `Ação desconhecida: "${action}". Disponíveis: criar_lancamento, listar_lancamentos, pagar_lancamento, deletar_lancamento, fluxo_caixa, custo_producao, dashboard`,
    )
  } catch (error: any) {
    return err(error?.message || 'Erro interno', 500)
  }
})
