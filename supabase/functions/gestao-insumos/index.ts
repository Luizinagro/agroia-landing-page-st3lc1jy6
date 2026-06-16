import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
const ok  = (data: any) => new Response(JSON.stringify({ success: true, data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
const err = (msg: string, status = 400) => new Response(JSON.stringify({ success: false, error: msg }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) return err('Não autenticado', 401);

    const supabaseUrl        = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey    = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const userClient = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return err('Não autenticado', 401);

    const admin  = createClient(supabaseUrl, supabaseServiceKey);
    const body   = req.method !== 'GET' ? await req.json().catch(() => ({})) : {};
    const action = body.action || '';

    // ── CADASTRO DE INSUMOS ───────────────────────────────────────

    if (action === 'criar_insumo') {
      const { nome, categoria, unidade, estoque_atual, estoque_minimo, preco_unitario, fornecedor } = body;
      if (!nome || !categoria) return err('"nome" e "categoria" são obrigatórios');
      const { data, error } = await admin.from('insumos_cadastro').insert({
        user_id: user.id, nome, categoria, unidade: unidade || 'L',
        estoque_atual: Number(estoque_atual)||0,
        estoque_minimo: Number(estoque_minimo)||0,
        preco_unitario: Number(preco_unitario)||0, fornecedor
      }).select().single();
      if (error) throw error;
      return ok(data);
    }

    if (action === 'listar_insumos') {
      const { categoria } = body;
      let q = admin.from('insumos_cadastro').select('*').eq('user_id', user.id);
      if (categoria) q = q.eq('categoria', categoria);
      const { data, error } = await q.order('nome');
      if (error) throw error;

      const abaixo_minimo = (data||[]).filter((i:any) => Number(i.estoque_atual) <= Number(i.estoque_minimo));
      const valor_total_estoque = (data||[]).reduce((s:number,i:any) => s + Number(i.estoque_atual)*Number(i.preco_unitario), 0);
      return ok({ insumos: data, alertas_estoque: abaixo_minimo.length, valor_total_estoque: Number(valor_total_estoque.toFixed(2)) });
    }

    if (action === 'atualizar_insumo') {
      const { id, ...campos } = body;
      if (!id) return err('"id" é obrigatório');
      delete campos.action; delete campos.user_id;
      const { data, error } = await admin.from('insumos_cadastro').update(campos).eq('id', id).eq('user_id', user.id).select().single();
      if (error) throw error;
      return ok(data);
    }

    // ── MOVIMENTAÇÕES ─────────────────────────────────────────────

    if (action === 'entrada_estoque') {
      const { insumo_id, quantidade, data, fornecedor, nota_fiscal, preco_unitario, observacao } = body;
      if (!insumo_id || !quantidade) return err('"insumo_id" e "quantidade" são obrigatórios');

      const { data: mov, error: movErr } = await admin.from('insumos_movimentacoes').insert({
        insumo_id, tipo: 'entrada', quantidade: Number(quantidade),
        data: data || new Date().toISOString().split('T')[0],
        fornecedor, nota_fiscal, preco_unitario: Number(preco_unitario)||0, observacao,
        valor_total: Number(quantidade) * Number(preco_unitario||0)
      }).select().single();
      if (movErr) throw movErr;

      // Atualiza estoque
      const { data: insumo } = await admin.from('insumos_cadastro').select('estoque_atual').eq('id', insumo_id).single();
      const novo_estoque = Number(insumo?.estoque_atual||0) + Number(quantidade);
      await admin.from('insumos_cadastro').update({ estoque_atual: novo_estoque }).eq('id', insumo_id);
      return ok({ movimentacao: mov, novo_estoque });
    }

    if (action === 'saida_estoque') {
      const { insumo_id, quantidade, data, talhao, cultura, safra, tipo_aplicacao, observacao } = body;
      if (!insumo_id || !quantidade) return err('"insumo_id" e "quantidade" são obrigatórios');

      const { data: insumo } = await admin.from('insumos_cadastro').select('estoque_atual, preco_unitario').eq('id', insumo_id).single();
      if (!insumo) return err('Insumo não encontrado');
      if (Number(insumo.estoque_atual) < Number(quantidade)) return err('Estoque insuficiente');

      const { data: mov, error: movErr } = await admin.from('insumos_movimentacoes').insert({
        insumo_id, tipo: 'saida', quantidade: Number(quantidade),
        data: data || new Date().toISOString().split('T')[0],
        talhao, cultura, safra, tipo_aplicacao, observacao,
        valor_total: Number(quantidade) * Number(insumo.preco_unitario||0)
      }).select().single();
      if (movErr) throw movErr;

      const novo_estoque = Number(insumo.estoque_atual) - Number(quantidade);
      await admin.from('insumos_cadastro').update({ estoque_atual: novo_estoque }).eq('id', insumo_id);
      return ok({ movimentacao: mov, novo_estoque });
    }

    if (action === 'historico_movimentacoes') {
      const { insumo_id, tipo, limit } = body;
      let q = admin.from('insumos_movimentacoes').select(`*, insumos_cadastro(nome, unidade, categoria)`);
      if (insumo_id) q = q.eq('insumo_id', insumo_id);
      if (tipo) q = q.eq('tipo', tipo);
      const { data, error } = await q.order('data', { ascending: false }).limit(Number(limit)||50);
      if (error) throw error;
      return ok(data);
    }

    // ── DASHBOARD ─────────────────────────────────────────────────

    if (action === 'dashboard_insumos') {
      const { data: insumos, error } = await admin.from('insumos_cadastro').select('*').eq('user_id', user.id);
      if (error) throw error;

      const categorias: Record<string, { quantidade: number; valor: number }> = {};
      for (const i of (insumos||[])) {
        if (!categorias[i.categoria]) categorias[i.categoria] = { quantidade: 0, valor: 0 };
        categorias[i.categoria].quantidade++;
        categorias[i.categoria].valor += Number(i.estoque_atual) * Number(i.preco_unitario||0);
      }

      const abaixo_minimo = (insumos||[]).filter((i:any) => Number(i.estoque_atual) <= Number(i.estoque_minimo));
      const valor_total = Object.values(categorias).reduce((s, c) => s + c.valor, 0);

      return ok({
        total_produtos: (insumos||[]).length,
        valor_total_estoque: Number(valor_total.toFixed(2)),
        alertas_estoque_baixo: abaixo_minimo.length,
        produtos_sem_estoque: (insumos||[]).filter((i:any) => Number(i.estoque_atual) <= 0).length,
        por_categoria: categorias,
        produtos_criticos: abaixo_minimo.map((i:any) => ({ id: i.id, nome: i.nome, estoque_atual: i.estoque_atual, estoque_minimo: i.estoque_minimo, unidade: i.unidade }))
      });
    }

    return err(`Ação desconhecida: "${action}". Disponíveis: criar_insumo, listar_insumos, atualizar_insumo, entrada_estoque, saida_estoque, historico_movimentacoes, dashboard_insumos`);
  } catch (error: any) {
    return err(error?.message || 'Erro interno', 500);
  }
});
