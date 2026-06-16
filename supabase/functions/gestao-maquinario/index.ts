import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const ok  = (data: any)  => new Response(JSON.stringify({ success: true,  data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
const err = (msg: string, status = 400) => new Response(JSON.stringify({ success: false, error: msg }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status });

async function initTables(admin: any) {
  await admin.rpc('exec_sql', { sql: '' }).catch(() => null); // warm up

  const sql = `
    CREATE TABLE IF NOT EXISTS maquinas (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      nome text NOT NULL,
      tipo text NOT NULL DEFAULT 'trator',
      marca text,
      modelo text,
      ano integer,
      placa text,
      foto_url text,
      horimetro_atual numeric DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS maquinas_horimetro (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      maquina_id uuid NOT NULL REFERENCES maquinas(id) ON DELETE CASCADE,
      data date NOT NULL DEFAULT CURRENT_DATE,
      horas numeric NOT NULL,
      observacao text,
      created_at timestamptz DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS maquinas_despesas (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      maquina_id uuid NOT NULL REFERENCES maquinas(id) ON DELETE CASCADE,
      data date NOT NULL DEFAULT CURRENT_DATE,
      categoria text NOT NULL,
      descricao text,
      valor numeric NOT NULL,
      horas_maquina numeric,
      created_at timestamptz DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS maquinas_manutencao (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      maquina_id uuid NOT NULL REFERENCES maquinas(id) ON DELETE CASCADE,
      descricao text NOT NULL,
      tipo_gatilho text NOT NULL DEFAULT 'data',
      horas_gatilho numeric,
      data_gatilho date,
      intervalo_horas numeric,
      status text NOT NULL DEFAULT 'agendado',
      data_realizada date,
      custo_realizado numeric,
      observacao text,
      created_at timestamptz DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS maquinas_documentos (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      maquina_id uuid NOT NULL REFERENCES maquinas(id) ON DELETE CASCADE,
      tipo text NOT NULL,
      descricao text,
      vencimento date,
      valor_seguro numeric,
      seguradora text,
      numero_apolice text,
      created_at timestamptz DEFAULT now()
    );
  `;

  // Executar cada statement separadamente via supabase
  const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await admin.from('_dummy_').select().limit(0).then(() => null).catch(() => null);
    try {
      await fetch(
        `${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/exec_sql`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({ sql: stmt + ';' })
        }
      );
    } catch (_) {}
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) return err('Não autenticado', 401);

    const supabaseUrl        = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey    = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return err('Não autenticado', 401);

    const admin  = createClient(supabaseUrl, supabaseServiceKey);
    const body   = req.method !== 'GET' ? await req.json().catch(() => ({})) : {};
    const url    = new URL(req.url);
    const action = body.action || url.searchParams.get('action') || '';

    // ── MÁQUINAS ───────────────────────────────────────────────────
    if (action === 'listar_maquinas') {
      const { data, error } = await admin
        .from('maquinas')
        .select(`*, maquinas_documentos(tipo, vencimento), maquinas_manutencao(descricao, horas_gatilho, data_gatilho, status)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Calcular alertas de vencimento e manutenção
      const hoje = new Date();
      const result = (data || []).map((m: any) => {
        const docs_vencendo = (m.maquinas_documentos || []).filter((d: any) => {
          if (!d.vencimento) return false;
          const diff = (new Date(d.vencimento).getTime() - hoje.getTime()) / 86400000;
          return diff <= 30 && diff >= 0;
        });
        const docs_vencidos = (m.maquinas_documentos || []).filter((d: any) => {
          if (!d.vencimento) return false;
          return new Date(d.vencimento) < hoje;
        });
        const manut_pendentes = (m.maquinas_manutencao || []).filter((mn: any) => mn.status === 'agendado');
        return {
          ...m,
          alertas: {
            docs_vencendo: docs_vencendo.length,
            docs_vencidos: docs_vencidos.length,
            manutencao_pendente: manut_pendentes.length
          }
        };
      });
      return ok(result);
    }

    if (action === 'criar_maquina') {
      const { nome, tipo, marca, modelo, ano, placa, foto_url, horimetro_atual } = body;
      if (!nome) return err('"nome" é obrigatório');
      const { data, error } = await admin.from('maquinas').insert({
        user_id: user.id, nome, tipo: tipo || 'trator',
        marca, modelo, ano, placa, foto_url,
        horimetro_atual: horimetro_atual || 0
      }).select().single();
      if (error) throw error;
      return ok(data);
    }

    if (action === 'atualizar_maquina') {
      const { id, ...campos } = body;
      if (!id) return err('"id" é obrigatório');
      delete campos.action; delete campos.user_id;
      const { data, error } = await admin.from('maquinas')
        .update({ ...campos, updated_at: new Date().toISOString() })
        .eq('id', id).eq('user_id', user.id).select().single();
      if (error) throw error;
      return ok(data);
    }

    if (action === 'deletar_maquina') {
      const { id } = body;
      if (!id) return err('"id" é obrigatório');
      const { error } = await admin.from('maquinas').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      return ok({ deleted: true });
    }

    // ── HORÍMETRO ──────────────────────────────────────────────────
    if (action === 'registrar_horimetro') {
      const { maquina_id, horas, data, observacao } = body;
      if (!maquina_id || !horas) return err('"maquina_id" e "horas" são obrigatórios');
      const { data: d, error } = await admin.from('maquinas_horimetro').insert({
        maquina_id, horas, data: data || new Date().toISOString().split('T')[0], observacao
      }).select().single();
      if (error) throw error;
      // Atualiza horímetro atual na máquina
      await admin.from('maquinas').update({ horimetro_atual: horas, updated_at: new Date().toISOString() })
        .eq('id', maquina_id).eq('user_id', user.id);
      return ok(d);
    }

    if (action === 'historico_horimetro') {
      const { maquina_id } = body;
      if (!maquina_id) return err('"maquina_id" é obrigatório');
      const { data, error } = await admin.from('maquinas_horimetro')
        .select('*').eq('maquina_id', maquina_id).order('data', { ascending: false }).limit(50);
      if (error) throw error;
      return ok(data);
    }

    // ── DESPESAS ───────────────────────────────────────────────────
    if (action === 'adicionar_despesa') {
      const { maquina_id, categoria, descricao, valor, data, horas_maquina } = body;
      if (!maquina_id || !categoria || !valor) return err('"maquina_id", "categoria" e "valor" são obrigatórios');
      const { data: d, error } = await admin.from('maquinas_despesas').insert({
        maquina_id, categoria, descricao, valor,
        data: data || new Date().toISOString().split('T')[0],
        horas_maquina
      }).select().single();
      if (error) throw error;
      return ok(d);
    }

    if (action === 'listar_despesas') {
      const { maquina_id, ano } = body;
      if (!maquina_id) return err('"maquina_id" é obrigatório');
      let q = admin.from('maquinas_despesas').select('*').eq('maquina_id', maquina_id);
      if (ano) q = q.gte('data', `${ano}-01-01`).lte('data', `${ano}-12-31`);
      const { data, error } = await q.order('data', { ascending: false });
      if (error) throw error;

      const total = (data || []).reduce((s: number, d: any) => s + Number(d.valor), 0);
      const por_categoria: Record<string, number> = {};
      for (const d of (data || [])) {
        por_categoria[d.categoria] = (por_categoria[d.categoria] || 0) + Number(d.valor);
      }
      return ok({ despesas: data, total_periodo: total, por_categoria });
    }

    // ── MANUTENÇÃO ─────────────────────────────────────────────────
    if (action === 'criar_manutencao') {
      const { maquina_id, descricao, tipo_gatilho, horas_gatilho, data_gatilho, intervalo_horas } = body;
      if (!maquina_id || !descricao) return err('"maquina_id" e "descricao" são obrigatórios');
      const { data, error } = await admin.from('maquinas_manutencao').insert({
        maquina_id, descricao, tipo_gatilho: tipo_gatilho || 'data',
        horas_gatilho, data_gatilho, intervalo_horas, status: 'agendado'
      }).select().single();
      if (error) throw error;
      return ok(data);
    }

    if (action === 'concluir_manutencao') {
      const { id, custo_realizado, observacao } = body;
      if (!id) return err('"id" é obrigatório');
      const { data, error } = await admin.from('maquinas_manutencao').update({
        status: 'realizado',
        data_realizada: new Date().toISOString().split('T')[0],
        custo_realizado, observacao
      }).eq('id', id).select().single();
      if (error) throw error;
      return ok(data);
    }

    if (action === 'listar_manutencao') {
      const { maquina_id } = body;
      if (!maquina_id) return err('"maquina_id" é obrigatório');
      const { data, error } = await admin.from('maquinas_manutencao')
        .select('*').eq('maquina_id', maquina_id).order('created_at', { ascending: false });
      if (error) throw error;
      return ok(data);
    }

    // ── DOCUMENTOS / SEGUROS ──────────────────────────────────────
    if (action === 'criar_documento') {
      const { maquina_id, tipo, descricao, vencimento, valor_seguro, seguradora, numero_apolice } = body;
      if (!maquina_id || !tipo) return err('"maquina_id" e "tipo" são obrigatórios');
      const { data, error } = await admin.from('maquinas_documentos').insert({
        maquina_id, tipo, descricao, vencimento, valor_seguro, seguradora, numero_apolice
      }).select().single();
      if (error) throw error;
      return ok(data);
    }

    if (action === 'listar_documentos') {
      const { maquina_id } = body;
      if (!maquina_id) return err('"maquina_id" é obrigatório');
      const { data, error } = await admin.from('maquinas_documentos')
        .select('*').eq('maquina_id', maquina_id).order('vencimento', { ascending: true });
      if (error) throw error;

      const hoje = new Date();
      const result = (data || []).map((d: any) => {
        let status_doc = 'ok';
        if (d.vencimento) {
          const diff = (new Date(d.vencimento).getTime() - hoje.getTime()) / 86400000;
          if (diff < 0)   status_doc = 'vencido';
          else if (diff <= 7)  status_doc = 'urgente';
          else if (diff <= 30) status_doc = 'atencao';
        }
        return { ...d, status_doc };
      });
      return ok(result);
    }

    if (action === 'deletar_documento') {
      const { id } = body;
      if (!id) return err('"id" é obrigatório');
      const { error } = await admin.from('maquinas_documentos').delete().eq('id', id);
      if (error) throw error;
      return ok({ deleted: true });
    }

    // ── RESUMO GERAL ───────────────────────────────────────────────
    if (action === 'resumo_frota') {
      const anoAtual = new Date().getFullYear();
      const { data: maquinas } = await admin.from('maquinas').select('id, nome, tipo, horimetro_atual').eq('user_id', user.id);

      const resultado = [];
      for (const m of (maquinas || [])) {
        const { data: despesas } = await admin.from('maquinas_despesas')
          .select('valor, categoria')
          .eq('maquina_id', m.id)
          .gte('data', `${anoAtual}-01-01`);
        const { data: docs } = await admin.from('maquinas_documentos')
          .select('tipo, vencimento').eq('maquina_id', m.id);

        const total_ano = (despesas || []).reduce((s: number, d: any) => s + Number(d.valor), 0);
        const hoje = new Date();
        const docs_alerta = (docs || []).filter((d: any) => {
          if (!d.vencimento) return false;
          const diff = (new Date(d.vencimento).getTime() - hoje.getTime()) / 86400000;
          return diff <= 30;
        });

        resultado.push({
          id: m.id, nome: m.nome, tipo: m.tipo,
          horimetro_atual: m.horimetro_atual,
          total_gasto_ano: Number(total_ano.toFixed(2)),
          documentos_vencendo: docs_alerta.length
        });
      }

      const total_frota = resultado.reduce((s, m) => s + m.total_gasto_ano, 0);
      return ok({
        maquinas: resultado,
        total_frota_ano: Number(total_frota.toFixed(2)),
        total_maquinas: resultado.length,
        ano: anoAtual
      });
    }

    // ── ALERTAS GLOBAIS ────────────────────────────────────────────
    if (action === 'alertas') {
      const { data: maquinas } = await admin.from('maquinas').select('id, nome').eq('user_id', user.id);
      const alertas = [];
      const hoje = new Date();

      for (const m of (maquinas || [])) {
        const { data: docs } = await admin.from('maquinas_documentos')
          .select('tipo, descricao, vencimento').eq('maquina_id', m.id);
        for (const d of (docs || [])) {
          if (!d.vencimento) continue;
          const diff = Math.ceil((new Date(d.vencimento).getTime() - hoje.getTime()) / 86400000);
          if (diff <= 30) {
            alertas.push({
              maquina: m.nome,
              tipo: 'documento',
              descricao: `${d.tipo}${d.descricao ? ': ' + d.descricao : ''}`,
              dias_restantes: diff,
              urgencia: diff < 0 ? 'vencido' : diff <= 7 ? 'urgente' : 'atencao'
            });
          }
        }

        const { data: manuts } = await admin.from('maquinas_manutencao')
          .select('descricao, data_gatilho, horas_gatilho, status').eq('maquina_id', m.id).eq('status', 'agendado');
        const { data: maq } = await admin.from('maquinas').select('horimetro_atual').eq('id', m.id).single();

        for (const mn of (manuts || [])) {
          if (mn.data_gatilho) {
            const diff = Math.ceil((new Date(mn.data_gatilho).getTime() - hoje.getTime()) / 86400000);
            if (diff <= 14) alertas.push({ maquina: m.nome, tipo: 'manutencao', descricao: mn.descricao, dias_restantes: diff, urgencia: diff < 0 ? 'atrasado' : 'atencao' });
          }
          if (mn.horas_gatilho && maq) {
            const horas_restantes = mn.horas_gatilho - Number(maq.horimetro_atual);
            if (horas_restantes <= 50) alertas.push({ maquina: m.nome, tipo: 'manutencao_horas', descricao: mn.descricao, horas_restantes: Math.round(horas_restantes), urgencia: horas_restantes <= 0 ? 'atrasado' : 'atencao' });
          }
        }
      }

      alertas.sort((a, b) => (a.dias_restantes ?? 999) - (b.dias_restantes ?? 999));
      return ok({ alertas, total: alertas.length });
    }

    return err(`Ação desconhecida: "${action}". Ações disponíveis: listar_maquinas, criar_maquina, atualizar_maquina, deletar_maquina, registrar_horimetro, historico_horimetro, adicionar_despesa, listar_despesas, criar_manutencao, concluir_manutencao, listar_manutencao, criar_documento, listar_documentos, deletar_documento, resumo_frota, alertas`);

  } catch (error: any) {
    console.error('Erro gestao-maquinario:', error);
    return err(error?.message || 'Erro interno', 500);
  }
});
