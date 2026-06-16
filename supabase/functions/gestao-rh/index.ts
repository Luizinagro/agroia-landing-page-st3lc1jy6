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

    // ── FUNCIONÁRIOS ──────────────────────────────────────────────

    if (action === 'criar_funcionario') {
      const { nome, cpf, funcao, data_admissao, salario_base, telefone, observacao } = body
      if (!nome || !funcao) return err('"nome" e "funcao" são obrigatórios')
      const { data, error } = await admin
        .from('rh_funcionarios')
        .insert({
          user_id: user.id,
          nome,
          cpf,
          funcao,
          data_admissao: data_admissao || new Date().toISOString().split('T')[0],
          salario_base: Number(salario_base) || 0,
          telefone,
          observacao,
          ativo: true,
        })
        .select()
        .single()
      if (error) throw error
      return ok(data)
    }

    if (action === 'listar_funcionarios') {
      const { ativo } = body
      let q = admin.from('rh_funcionarios').select('*').eq('user_id', user.id)
      if (ativo !== undefined) q = q.eq('ativo', ativo !== false && ativo !== 'false')
      const { data, error } = await q.order('nome')
      if (error) throw error
      return ok(data)
    }

    if (action === 'atualizar_funcionario') {
      const { id, ...campos } = body
      if (!id) return err('"id" é obrigatório')
      delete campos.action
      delete campos.user_id
      const { data, error } = await admin
        .from('rh_funcionarios')
        .update(campos)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
      if (error) throw error
      return ok(data)
    }

    if (action === 'desligar_funcionario') {
      const { id, data_desligamento, motivo } = body
      if (!id) return err('"id" é obrigatório')
      const { data, error } = await admin
        .from('rh_funcionarios')
        .update({
          ativo: false,
          data_desligamento: data_desligamento || new Date().toISOString().split('T')[0],
          motivo_desligamento: motivo,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
      if (error) throw error
      return ok(data)
    }

    // ── PONTO DIÁRIO ──────────────────────────────────────────────

    if (action === 'registrar_ponto') {
      const { funcionario_id, data, hora_entrada, hora_saida, horas_extras, observacao } = body
      if (!funcionario_id || !data) return err('"funcionario_id" e "data" são obrigatórios')

      let horas_trabalhadas = 0
      if (hora_entrada && hora_saida) {
        const [h1, m1] = hora_entrada.split(':').map(Number)
        const [h2, m2] = hora_saida.split(':').map(Number)
        horas_trabalhadas = (h2 * 60 + m2 - h1 * 60 - m1) / 60
      }

      const { data: ponto, error } = await admin
        .from('rh_ponto')
        .upsert(
          {
            funcionario_id,
            data,
            hora_entrada,
            hora_saida,
            horas_trabalhadas: Number(horas_trabalhadas.toFixed(2)),
            horas_extras: Number(horas_extras) || 0,
            observacao,
          },
          { onConflict: 'funcionario_id,data' },
        )
        .select()
        .single()
      if (error) throw error
      return ok(ponto)
    }

    if (action === 'listar_ponto') {
      const { funcionario_id, mes, ano } = body
      if (!funcionario_id) return err('"funcionario_id" é obrigatório')
      const anoUsar = ano || new Date().getFullYear()
      const mesUsar = mes || new Date().getMonth() + 1
      const mesStr = String(mesUsar).padStart(2, '0')
      const { data, error } = await admin
        .from('rh_ponto')
        .select('*')
        .eq('funcionario_id', funcionario_id)
        .gte('data', `${anoUsar}-${mesStr}-01`)
        .lte('data', `${anoUsar}-${mesStr}-31`)
        .order('data')
      if (error) throw error

      const total_horas = (data || []).reduce(
        (s: number, p: any) => s + Number(p.horas_trabalhadas || 0),
        0,
      )
      const dias_trabalhados = (data || []).filter(
        (p: any) => Number(p.horas_trabalhadas || 0) > 0,
      ).length
      const horas_extras = (data || []).reduce(
        (s: number, p: any) => s + Number(p.horas_extras || 0),
        0,
      )
      return ok({
        pontos: data,
        resumo: {
          total_horas: Number(total_horas.toFixed(1)),
          dias_trabalhados,
          horas_extras: Number(horas_extras.toFixed(1)),
        },
      })
    }

    // ── ATIVIDADES POR FUNCIONÁRIO ────────────────────────────────

    if (action === 'registrar_atividade') {
      const { funcionario_id, data, descricao, talhao, cultura, horas, equipamento, observacao } =
        body
      if (!funcionario_id || !descricao)
        return err('"funcionario_id" e "descricao" são obrigatórios')
      const { data: atv, error } = await admin
        .from('rh_atividades')
        .insert({
          funcionario_id,
          data: data || new Date().toISOString().split('T')[0],
          descricao,
          talhao,
          cultura,
          horas: Number(horas) || 0,
          equipamento,
          observacao,
        })
        .select()
        .single()
      if (error) throw error
      return ok(atv)
    }

    if (action === 'listar_atividades') {
      const { funcionario_id, data_inicio, data_fim, limit } = body
      let q = admin.from('rh_atividades').select(`*, rh_funcionarios(nome, funcao)`)
      if (funcionario_id) q = q.eq('funcionario_id', funcionario_id)
      if (data_inicio) q = q.gte('data', data_inicio)
      if (data_fim) q = q.lte('data', data_fim)
      const { data, error } = await q
        .order('data', { ascending: false })
        .limit(Number(limit) || 100)
      if (error) throw error
      return ok(data)
    }

    // ── RELATÓRIO MENSAL ──────────────────────────────────────────

    if (action === 'relatorio_mensal') {
      const anoAtual = body.ano || new Date().getFullYear()
      const mesAtual = body.mes || new Date().getMonth() + 1
      const mesStr = String(mesAtual).padStart(2, '0')

      const { data: funcionarios } = await admin
        .from('rh_funcionarios')
        .select('id, nome, funcao, salario_base')
        .eq('user_id', user.id)
        .eq('ativo', true)
      const relatorio = []

      for (const f of funcionarios || []) {
        const { data: pontos } = await admin
          .from('rh_ponto')
          .select('horas_trabalhadas, horas_extras, data')
          .eq('funcionario_id', f.id)
          .gte('data', `${anoAtual}-${mesStr}-01`)
          .lte('data', `${anoAtual}-${mesStr}-31`)
        const { data: atividades } = await admin
          .from('rh_atividades')
          .select('descricao, horas, data')
          .eq('funcionario_id', f.id)
          .gte('data', `${anoAtual}-${mesStr}-01`)
          .lte('data', `${anoAtual}-${mesStr}-31`)

        const total_horas = (pontos || []).reduce(
          (s: number, p: any) => s + Number(p.horas_trabalhadas || 0),
          0,
        )
        const horas_extras = (pontos || []).reduce(
          (s: number, p: any) => s + Number(p.horas_extras || 0),
          0,
        )
        const dias = (pontos || []).filter((p: any) => Number(p.horas_trabalhadas || 0) > 0).length

        relatorio.push({
          funcionario: { id: f.id, nome: f.nome, funcao: f.funcao },
          salario_base: f.salario_base,
          dias_trabalhados: dias,
          horas_totais: Number(total_horas.toFixed(1)),
          horas_extras: Number(horas_extras.toFixed(1)),
          total_atividades: (atividades || []).length,
          atividades_resumo: (atividades || []).slice(0, 5),
        })
      }

      const folha_total = relatorio.reduce((s, f) => s + Number(f.salario_base || 0), 0)
      return ok({
        mes: mesAtual,
        ano: anoAtual,
        funcionarios: relatorio,
        total_folha: Number(folha_total.toFixed(2)),
        total_funcionarios: relatorio.length,
      })
    }

    // ── DASHBOARD ─────────────────────────────────────────────────

    if (action === 'dashboard_rh') {
      const hoje = new Date()
      const mesStr = String(hoje.getMonth() + 1).padStart(2, '0')
      const anoAtual = hoje.getFullYear()

      const { data: funcionarios } = await admin
        .from('rh_funcionarios')
        .select('id, nome, funcao')
        .eq('user_id', user.id)
        .eq('ativo', true)
      const { data: atv_hoje } = await admin
        .from('rh_atividades')
        .select('funcionario_id, descricao')
        .eq('data', hoje.toISOString().split('T')[0])
      const { data: pontos_mes } = await admin
        .from('rh_ponto')
        .select('funcionario_id, horas_trabalhadas')
        .gte('data', `${anoAtual}-${mesStr}-01`)
        .lte('data', `${anoAtual}-${mesStr}-31`)

      const total_horas_mes = (pontos_mes || []).reduce(
        (s: number, p: any) => s + Number(p.horas_trabalhadas || 0),
        0,
      )

      return ok({
        total_funcionarios: (funcionarios || []).length,
        atividades_hoje: (atv_hoje || []).length,
        total_horas_mes: Number(total_horas_mes.toFixed(1)),
        funcionarios_ativos: funcionarios,
      })
    }

    return err(
      `Ação desconhecida: "${action}". Disponíveis: criar_funcionario, listar_funcionarios, atualizar_funcionario, desligar_funcionario, registrar_ponto, listar_ponto, registrar_atividade, listar_atividades, relatorio_mensal, dashboard_rh`,
    )
  } catch (error: any) {
    return err(error?.message || 'Erro interno', 500)
  }
})
