// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agenda_manejo: {
        Row: {
          clima_recomendado: boolean | null
          created_at: string
          data_prevista: string
          id: string
          status: string | null
          tipo_atividade: string | null
          titulo: string
          user_id: string
        }
        Insert: {
          clima_recomendado?: boolean | null
          created_at?: string
          data_prevista: string
          id?: string
          status?: string | null
          tipo_atividade?: string | null
          titulo: string
          user_id: string
        }
        Update: {
          clima_recomendado?: boolean | null
          created_at?: string
          data_prevista?: string
          id?: string
          status?: string | null
          tipo_atividade?: string | null
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_forecasts: {
        Row: {
          commodity: string
          created_at: string
          current_price: number
          id: string
          recommendation: string | null
          trend_data: Json
        }
        Insert: {
          commodity: string
          created_at?: string
          current_price?: number
          id?: string
          recommendation?: string | null
          trend_data?: Json
        }
        Update: {
          commodity?: string
          created_at?: string
          current_price?: number
          id?: string
          recommendation?: string | null
          trend_data?: Json
        }
        Relationships: []
      }
      alertas_cio: {
        Row: {
          animal_id: string
          created_at: string
          data_alerta: string
          id: string
          mensagem: string
          status: string | null
          user_id: string
        }
        Insert: {
          animal_id: string
          created_at?: string
          data_alerta?: string
          id?: string
          mensagem: string
          status?: string | null
          user_id: string
        }
        Update: {
          animal_id?: string
          created_at?: string
          data_alerta?: string
          id?: string
          mensagem?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_cio_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
        ]
      }
      animais: {
        Row: {
          confianca_previsao: number | null
          created_at: string
          data_nascimento: string | null
          id: string
          nome: string
          peso_atual: number | null
          proximo_cio_estimado: string | null
          raca: string | null
          recomendacoes_ia: string | null
          status: string | null
          tipo: string
          ultima_data_cio: string | null
          user_id: string
        }
        Insert: {
          confianca_previsao?: number | null
          created_at?: string
          data_nascimento?: string | null
          id?: string
          nome: string
          peso_atual?: number | null
          proximo_cio_estimado?: string | null
          raca?: string | null
          recomendacoes_ia?: string | null
          status?: string | null
          tipo: string
          ultima_data_cio?: string | null
          user_id: string
        }
        Update: {
          confianca_previsao?: number | null
          created_at?: string
          data_nascimento?: string | null
          id?: string
          nome?: string
          peso_atual?: number | null
          proximo_cio_estimado?: string | null
          raca?: string | null
          recomendacoes_ia?: string | null
          status?: string | null
          tipo?: string
          ultima_data_cio?: string | null
          user_id?: string
        }
        Relationships: []
      }
      calculos_carbono: {
        Row: {
          area_hectares: number | null
          bioma: string | null
          created_at: string | null
          cultura: string | null
          id: string
          praticas: Json | null
          receita_anual: number | null
          resultado_completo: Json | null
          score_sustentabilidade: number | null
          toneladas_co2_ano: number | null
          user_id: string | null
        }
        Insert: {
          area_hectares?: number | null
          bioma?: string | null
          created_at?: string | null
          cultura?: string | null
          id?: string
          praticas?: Json | null
          receita_anual?: number | null
          resultado_completo?: Json | null
          score_sustentabilidade?: number | null
          toneladas_co2_ano?: number | null
          user_id?: string | null
        }
        Update: {
          area_hectares?: number | null
          bioma?: string | null
          created_at?: string | null
          cultura?: string | null
          id?: string
          praticas?: Json | null
          receita_anual?: number | null
          resultado_completo?: Json | null
          score_sustentabilidade?: number | null
          toneladas_co2_ano?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      calculos_roi: {
        Row: {
          cultura: string | null
          custo_producao: number
          data_criacao: string
          id: string
          lucro_liquido: number
          margem_lucro: number
          payback_meses: number
          quantidade: number | null
          receita_esperada: number
          roi_percentual: number
          tempo_retorno: number
          user_id: string
        }
        Insert: {
          cultura?: string | null
          custo_producao: number
          data_criacao?: string
          id?: string
          lucro_liquido: number
          margem_lucro: number
          payback_meses: number
          quantidade?: number | null
          receita_esperada: number
          roi_percentual: number
          tempo_retorno: number
          user_id: string
        }
        Update: {
          cultura?: string | null
          custo_producao?: number
          data_criacao?: string
          id?: string
          lucro_liquido?: number
          margem_lucro?: number
          payback_meses?: number
          quantidade?: number | null
          receita_esperada?: number
          roi_percentual?: number
          tempo_retorno?: number
          user_id?: string
        }
        Relationships: []
      }
      carrinho: {
        Row: {
          created_at: string
          id: string
          produto_id: string
          quantidade: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          produto_id: string
          quantidade?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          produto_id?: string
          quantidade?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carrinho_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      clima: {
        Row: {
          created_at: string
          data_atualizacao: string
          id: string
          precipitacao: number
          propriedade_id: string
          temperatura: number
          umidade: number
          vento: number
        }
        Insert: {
          created_at?: string
          data_atualizacao?: string
          id?: string
          precipitacao?: number
          propriedade_id: string
          temperatura?: number
          umidade?: number
          vento?: number
        }
        Update: {
          created_at?: string
          data_atualizacao?: string
          id?: string
          precipitacao?: number
          propriedade_id?: string
          temperatura?: number
          umidade?: number
          vento?: number
        }
        Relationships: [
          {
            foreignKeyName: "clima_propriedade_id_fkey"
            columns: ["propriedade_id"]
            isOneToOne: false
            referencedRelation: "propriedades"
            referencedColumns: ["id"]
          },
        ]
      }
      comunidade_posts: {
        Row: {
          categoria: string
          conteudo: string
          created_at: string
          data: string
          id: string
          titulo: string
          user_id: string
        }
        Insert: {
          categoria: string
          conteudo: string
          created_at?: string
          data: string
          id?: string
          titulo: string
          user_id: string
        }
        Update: {
          categoria?: string
          conteudo?: string
          created_at?: string
          data?: string
          id?: string
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      consultas_ia: {
        Row: {
          created_at: string
          id: string
          is_favorite: boolean
          pergunta: string
          regiao: string
          resposta: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_favorite?: boolean
          pergunta: string
          regiao: string
          resposta: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_favorite?: boolean
          pergunta?: string
          regiao?: string
          resposta?: Json
          user_id?: string
        }
        Relationships: []
      }
      crm_leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string
          regiao: string | null
          status: string | null
          tamanho_propriedade: string | null
          telefone: string | null
          tipo_cultura: string | null
          updated_at: string | null
          valor_estimado: number | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nome: string
          regiao?: string | null
          status?: string | null
          tamanho_propriedade?: string | null
          telefone?: string | null
          tipo_cultura?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          regiao?: string | null
          status?: string | null
          tamanho_propriedade?: string | null
          telefone?: string | null
          tipo_cultura?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Relationships: []
      }
      crm_tasks: {
        Row: {
          assigned_by: string | null
          assigned_by_name: string | null
          created_at: string
          id: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          assigned_by_name?: string | null
          created_at?: string
          id?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          assigned_by_name?: string | null
          created_at?: string
          id?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_history: {
        Row: {
          created_at: string
          day: string
          humidity: number
          id: string
          temp: number
          user_id: string
        }
        Insert: {
          created_at?: string
          day: string
          humidity?: number
          id?: string
          temp?: number
          user_id: string
        }
        Update: {
          created_at?: string
          day?: string
          humidity?: number
          id?: string
          temp?: number
          user_id?: string
        }
        Relationships: []
      }
      dashboard_kpis: {
        Row: {
          created_at: string
          id: string
          produtividade: number
          receita_estimada: string
          saude_safra: string
          sensores_ativos: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          produtividade?: number
          receita_estimada?: string
          saude_safra?: string
          sensores_ativos?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          produtividade?: number
          receita_estimada?: string
          saude_safra?: string
          sensores_ativos?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      diagnosticos_pragas: {
        Row: {
          analise_completa: Json | null
          confianca: number | null
          created_at: string | null
          cultura: string | null
          id: string
          latitude: number | null
          longitude: number | null
          praga_identificada: string | null
          severidade: string | null
          user_id: string | null
        }
        Insert: {
          analise_completa?: Json | null
          confianca?: number | null
          created_at?: string | null
          cultura?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          praga_identificada?: string | null
          severidade?: string | null
          user_id?: string | null
        }
        Update: {
          analise_completa?: Json | null
          confianca?: number | null
          created_at?: string | null
          cultura?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          praga_identificada?: string | null
          severidade?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      financeiro_lancamentos: {
        Row: {
          categoria: string
          created_at: string | null
          cultura: string | null
          data_pagamento: string | null
          descricao: string
          id: string
          observacao: string | null
          safra: string | null
          status: string
          tipo: string
          user_id: string
          valor: number
          vencimento: string | null
        }
        Insert: {
          categoria?: string
          created_at?: string | null
          cultura?: string | null
          data_pagamento?: string | null
          descricao: string
          id?: string
          observacao?: string | null
          safra?: string | null
          status?: string
          tipo: string
          user_id: string
          valor: number
          vencimento?: string | null
        }
        Update: {
          categoria?: string
          created_at?: string | null
          cultura?: string | null
          data_pagamento?: string | null
          descricao?: string
          id?: string
          observacao?: string | null
          safra?: string | null
          status?: string
          tipo?: string
          user_id?: string
          valor?: number
          vencimento?: string | null
        }
        Relationships: []
      }
      insumos_cadastro: {
        Row: {
          categoria: string
          created_at: string | null
          estoque_atual: number | null
          estoque_minimo: number | null
          fornecedor: string | null
          id: string
          nome: string
          preco_unitario: number | null
          unidade: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          categoria: string
          created_at?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fornecedor?: string | null
          id?: string
          nome: string
          preco_unitario?: number | null
          unidade?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          categoria?: string
          created_at?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fornecedor?: string | null
          id?: string
          nome?: string
          preco_unitario?: number | null
          unidade?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      insumos_movimentacoes: {
        Row: {
          created_at: string | null
          cultura: string | null
          data: string
          fornecedor: string | null
          id: string
          insumo_id: string
          nota_fiscal: string | null
          observacao: string | null
          preco_unitario: number | null
          quantidade: number
          safra: string | null
          talhao: string | null
          tipo: string
          tipo_aplicacao: string | null
          valor_total: number | null
        }
        Insert: {
          created_at?: string | null
          cultura?: string | null
          data?: string
          fornecedor?: string | null
          id?: string
          insumo_id: string
          nota_fiscal?: string | null
          observacao?: string | null
          preco_unitario?: number | null
          quantidade: number
          safra?: string | null
          talhao?: string | null
          tipo: string
          tipo_aplicacao?: string | null
          valor_total?: number | null
        }
        Update: {
          created_at?: string | null
          cultura?: string | null
          data?: string
          fornecedor?: string | null
          id?: string
          insumo_id?: string
          nota_fiscal?: string | null
          observacao?: string | null
          preco_unitario?: number | null
          quantidade?: number
          safra?: string | null
          talhao?: string | null
          tipo?: string
          tipo_aplicacao?: string | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "insumos_movimentacoes_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "insumos_cadastro"
            referencedColumns: ["id"]
          },
        ]
      }
      maquinario: {
        Row: {
          created_at: string
          horas_uso: number
          id: string
          modelo: string | null
          nome: string
          proxima_manutencao_horas: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          horas_uso?: number
          id?: string
          modelo?: string | null
          nome: string
          proxima_manutencao_horas?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          horas_uso?: number
          id?: string
          modelo?: string | null
          nome?: string
          proxima_manutencao_horas?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      maquinas: {
        Row: {
          ano: number | null
          created_at: string | null
          foto_url: string | null
          horimetro_atual: number | null
          id: string
          marca: string | null
          modelo: string | null
          nome: string
          placa: string | null
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ano?: number | null
          created_at?: string | null
          foto_url?: string | null
          horimetro_atual?: number | null
          id?: string
          marca?: string | null
          modelo?: string | null
          nome: string
          placa?: string | null
          tipo?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ano?: number | null
          created_at?: string | null
          foto_url?: string | null
          horimetro_atual?: number | null
          id?: string
          marca?: string | null
          modelo?: string | null
          nome?: string
          placa?: string | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      maquinas_despesas: {
        Row: {
          categoria: string
          created_at: string | null
          data: string
          descricao: string | null
          horas_maquina: number | null
          id: string
          maquina_id: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string | null
          data?: string
          descricao?: string | null
          horas_maquina?: number | null
          id?: string
          maquina_id: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string | null
          data?: string
          descricao?: string | null
          horas_maquina?: number | null
          id?: string
          maquina_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "maquinas_despesas_maquina_id_fkey"
            columns: ["maquina_id"]
            isOneToOne: false
            referencedRelation: "maquinas"
            referencedColumns: ["id"]
          },
        ]
      }
      maquinas_documentos: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          maquina_id: string
          numero_apolice: string | null
          seguradora: string | null
          tipo: string
          valor_seguro: number | null
          vencimento: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          maquina_id: string
          numero_apolice?: string | null
          seguradora?: string | null
          tipo: string
          valor_seguro?: number | null
          vencimento?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          maquina_id?: string
          numero_apolice?: string | null
          seguradora?: string | null
          tipo?: string
          valor_seguro?: number | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maquinas_documentos_maquina_id_fkey"
            columns: ["maquina_id"]
            isOneToOne: false
            referencedRelation: "maquinas"
            referencedColumns: ["id"]
          },
        ]
      }
      maquinas_horimetro: {
        Row: {
          created_at: string | null
          data: string
          horas: number
          id: string
          maquina_id: string
          observacao: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string
          horas: number
          id?: string
          maquina_id: string
          observacao?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          horas?: number
          id?: string
          maquina_id?: string
          observacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maquinas_horimetro_maquina_id_fkey"
            columns: ["maquina_id"]
            isOneToOne: false
            referencedRelation: "maquinas"
            referencedColumns: ["id"]
          },
        ]
      }
      maquinas_manutencao: {
        Row: {
          created_at: string | null
          custo_realizado: number | null
          data_gatilho: string | null
          data_realizada: string | null
          descricao: string
          horas_gatilho: number | null
          id: string
          intervalo_horas: number | null
          maquina_id: string
          observacao: string | null
          status: string
          tipo_gatilho: string
        }
        Insert: {
          created_at?: string | null
          custo_realizado?: number | null
          data_gatilho?: string | null
          data_realizada?: string | null
          descricao: string
          horas_gatilho?: number | null
          id?: string
          intervalo_horas?: number | null
          maquina_id: string
          observacao?: string | null
          status?: string
          tipo_gatilho?: string
        }
        Update: {
          created_at?: string | null
          custo_realizado?: number | null
          data_gatilho?: string | null
          data_realizada?: string | null
          descricao?: string
          horas_gatilho?: number | null
          id?: string
          intervalo_horas?: number | null
          maquina_id?: string
          observacao?: string | null
          status?: string
          tipo_gatilho?: string
        }
        Relationships: [
          {
            foreignKeyName: "maquinas_manutencao_maquina_id_fkey"
            columns: ["maquina_id"]
            isOneToOne: false
            referencedRelation: "maquinas"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_pedidos: {
        Row: {
          created_at: string
          data: string
          frete: number
          id: string
          numero_pedido: string
          produtos: Json
          status: string
          subtotal: number
          user_id: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data: string
          frete: number
          id?: string
          numero_pedido: string
          produtos?: Json
          status: string
          subtotal: number
          user_id: string
          valor_total: number
        }
        Update: {
          created_at?: string
          data?: string
          frete?: number
          id?: string
          numero_pedido?: string
          produtos?: Json
          status?: string
          subtotal?: number
          user_id?: string
          valor_total?: number
        }
        Relationships: []
      }
      marketplace_produtos: {
        Row: {
          created_at: string
          descricao: string
          estoque: number
          id: string
          image: string
          markup_10pct: boolean
          nome: string
          preco_base: number
          preco_final: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          descricao: string
          estoque?: number
          id?: string
          image: string
          markup_10pct?: boolean
          nome: string
          preco_base: number
          preco_final: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string
          estoque?: number
          id?: string
          image?: string
          markup_10pct?: boolean
          nome?: string
          preco_base?: number
          preco_final?: number
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          unit_price?: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_address: string | null
          id: string
          status: string | null
          total_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_address?: string | null
          id?: string
          status?: string | null
          total_price?: number
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_address?: string | null
          id?: string
          status?: string | null
          total_price?: number
          user_id?: string
        }
        Relationships: []
      }
      pecuaria_animais: {
        Row: {
          created_at: string
          custo_mensal: number
          fase: string
          id: string
          peso: number
          racao_recomendada: string
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custo_mensal: number
          fase: string
          id?: string
          peso: number
          racao_recomendada: string
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string
          custo_mensal?: number
          fase?: string
          id?: string
          peso?: number
          racao_recomendada?: string
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_permissions: {
        Row: {
          created_at: string | null
          id: number
          limite: number | null
          modulo: string
          permitido: boolean | null
          plano: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          limite?: number | null
          modulo: string
          permitido?: boolean | null
          plano: string
        }
        Update: {
          created_at?: string | null
          id?: number
          limite?: number | null
          modulo?: string
          permitido?: boolean | null
          plano?: string
        }
        Relationships: []
      }
      planos: {
        Row: {
          botao: string
          created_at: string
          descricao: string
          destaque: boolean
          features: Json
          id: string
          nome: string
          ordem: number
          periodo: string | null
          preco: string
        }
        Insert: {
          botao: string
          created_at?: string
          descricao: string
          destaque?: boolean
          features?: Json
          id?: string
          nome: string
          ordem?: number
          periodo?: string | null
          preco: string
        }
        Update: {
          botao?: string
          created_at?: string
          descricao?: string
          destaque?: boolean
          features?: Json
          id?: string
          nome?: string
          ordem?: number
          periodo?: string | null
          preco?: string
        }
        Relationships: []
      }
      precos_cache: {
        Row: {
          commodity: string
          created_at: string | null
          fonte: string | null
          id: string
          preco_saca: number
          unidade: string | null
          variacao_dia: number | null
        }
        Insert: {
          commodity: string
          created_at?: string | null
          fonte?: string | null
          id?: string
          preco_saca: number
          unidade?: string | null
          variacao_dia?: number | null
        }
        Update: {
          commodity?: string
          created_at?: string | null
          fonte?: string | null
          id?: string
          preco_saca?: number
          unidade?: string | null
          variacao_dia?: number | null
        }
        Relationships: []
      }
      previsoes: {
        Row: {
          created_at: string
          cultura: string
          data: string
          id: string
          preco_atual: number
          previsao_30d: number | null
          previsao_60d: number | null
          quantidade: number
          user_id: string
        }
        Insert: {
          created_at?: string
          cultura: string
          data?: string
          id?: string
          preco_atual?: number
          previsao_30d?: number | null
          previsao_60d?: number | null
          quantidade?: number
          user_id: string
        }
        Update: {
          created_at?: string
          cultura?: string
          data?: string
          id?: string
          preco_atual?: number
          previsao_30d?: number | null
          previsao_60d?: number | null
          quantidade?: number
          user_id?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          commodity: string
          condition: string
          created_at: string
          id: string
          is_active: boolean
          target_price: number
          user_id: string
        }
        Insert: {
          commodity: string
          condition: string
          created_at?: string
          id?: string
          is_active?: boolean
          target_price: number
          user_id: string
        }
        Update: {
          commodity?: string
          condition?: string
          created_at?: string
          id?: string
          is_active?: boolean
          target_price?: number
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number
          stock?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number
        }
        Relationships: []
      }
      propriedades: {
        Row: {
          created_at: string
          cultura_principal: string
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cultura_principal: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
          user_id: string
        }
        Update: {
          created_at?: string
          cultura_principal?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
      rastreabilidade: {
        Row: {
          created_at: string
          data: string
          etapa: string
          id: string
          responsavel: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: string
          etapa: string
          id?: string
          responsavel?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data?: string
          etapa?: string
          id?: string
          responsavel?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          function_name: string
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          function_name: string
          request_count?: number
          user_id: string
          window_start: string
        }
        Update: {
          function_name?: string
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      rebanho: {
        Row: {
          created_at: string
          data_entrada: string
          id: string
          quantidade: number
          status: string | null
          tipo_animal: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_entrada?: string
          id?: string
          quantidade?: number
          status?: string | null
          tipo_animal: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_entrada?: string
          id?: string
          quantidade?: number
          status?: string | null
          tipo_animal?: string
          user_id?: string
        }
        Relationships: []
      }
      rh_atividades: {
        Row: {
          created_at: string | null
          cultura: string | null
          data: string
          descricao: string
          equipamento: string | null
          funcionario_id: string
          horas: number | null
          id: string
          observacao: string | null
          talhao: string | null
        }
        Insert: {
          created_at?: string | null
          cultura?: string | null
          data?: string
          descricao: string
          equipamento?: string | null
          funcionario_id: string
          horas?: number | null
          id?: string
          observacao?: string | null
          talhao?: string | null
        }
        Update: {
          created_at?: string | null
          cultura?: string | null
          data?: string
          descricao?: string
          equipamento?: string | null
          funcionario_id?: string
          horas?: number | null
          id?: string
          observacao?: string | null
          talhao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rh_atividades_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "rh_funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      rh_funcionarios: {
        Row: {
          ativo: boolean | null
          cpf: string | null
          created_at: string | null
          data_admissao: string | null
          data_desligamento: string | null
          funcao: string
          id: string
          motivo_desligamento: string | null
          nome: string
          observacao: string | null
          salario_base: number | null
          telefone: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          data_desligamento?: string | null
          funcao: string
          id?: string
          motivo_desligamento?: string | null
          nome: string
          observacao?: string | null
          salario_base?: number | null
          telefone?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          data_desligamento?: string | null
          funcao?: string
          id?: string
          motivo_desligamento?: string | null
          nome?: string
          observacao?: string | null
          salario_base?: number | null
          telefone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rh_ponto: {
        Row: {
          created_at: string | null
          data: string
          funcionario_id: string
          hora_entrada: string | null
          hora_saida: string | null
          horas_extras: number | null
          horas_trabalhadas: number | null
          id: string
          observacao: string | null
        }
        Insert: {
          created_at?: string | null
          data: string
          funcionario_id: string
          hora_entrada?: string | null
          hora_saida?: string | null
          horas_extras?: number | null
          horas_trabalhadas?: number | null
          id?: string
          observacao?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          funcionario_id?: string
          hora_entrada?: string | null
          hora_saida?: string | null
          horas_extras?: number | null
          horas_trabalhadas?: number | null
          id?: string
          observacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rh_ponto_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "rh_funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      safras_benchmarking: {
        Row: {
          ano: string
          created_at: string
          cultura: string
          custo_por_ha: number
          id: string
          sacas_por_ha: number
          user_id: string
        }
        Insert: {
          ano: string
          created_at?: string
          cultura: string
          custo_por_ha: number
          id?: string
          sacas_por_ha: number
          user_id: string
        }
        Update: {
          ano?: string
          created_at?: string
          cultura?: string
          custo_por_ha?: number
          id?: string
          sacas_por_ha?: number
          user_id?: string
        }
        Relationships: []
      }
      satellite_analyses: {
        Row: {
          analysis_date: string
          created_at: string
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          ndvi_value: number
          soil_moisture: number
          temperature: number
          user_id: string
          views_count: number
        }
        Insert: {
          analysis_date?: string
          created_at?: string
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          ndvi_value: number
          soil_moisture: number
          temperature: number
          user_id: string
          views_count?: number
        }
        Update: {
          analysis_date?: string
          created_at?: string
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          ndvi_value?: number
          soil_moisture?: number
          temperature?: number
          user_id?: string
          views_count?: number
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          data_criacao: string
          data_leitura: string | null
          id: string
          mensagem: string
          tipo: string
          user_id: string
        }
        Insert: {
          data_criacao?: string
          data_leitura?: string | null
          id?: string
          mensagem: string
          tipo: string
          user_id: string
        }
        Update: {
          data_criacao?: string
          data_leitura?: string | null
          id?: string
          mensagem?: string
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      user_estoque: {
        Row: {
          categoria: string | null
          created_at: string
          custo_total: number
          id: string
          item_nome: string
          quantidade: number
          unidade: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          custo_total?: number
          id?: string
          item_nome: string
          quantidade?: number
          unidade?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          custo_total?: number
          id?: string
          item_nome?: string
          quantidade?: number
          unidade?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_features: Json | null
          plan_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_features?: Json | null
          plan_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_features?: Json | null
          plan_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          data_inicio: string | null
          data_renovacao: string | null
          id: string
          periodo: string
          plano: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_inicio?: string | null
          data_renovacao?: string | null
          id?: string
          periodo?: string
          plano?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_inicio?: string | null
          data_renovacao?: string | null
          id?: string
          periodo?: string
          plano?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          cidade: string | null
          cpf: string | null
          created_at: string | null
          email: string
          estado: string | null
          id: string
          name: string | null
          phone: string | null
          plan_active: string | null
          plan_type: string | null
          status: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          trial_expires_at: string | null
          user_type: string | null
        }
        Insert: {
          address?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string | null
          email: string
          estado?: string | null
          id: string
          name?: string | null
          phone?: string | null
          plan_active?: string | null
          plan_type?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          trial_expires_at?: string | null
          user_type?: string | null
        }
        Update: {
          address?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string
          estado?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          plan_active?: string | null
          plan_type?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          trial_expires_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      weather_forecasts: {
        Row: {
          cidade: string
          created_at: string
          cultura: string
          data: string
          id: string
          risco_pragas: string
          temperatura: number
          umidade: number
          user_id: string
        }
        Insert: {
          cidade: string
          created_at?: string
          cultura: string
          data: string
          id?: string
          risco_pragas: string
          temperatura: number
          umidade: number
          user_id: string
        }
        Update: {
          cidade?: string
          created_at?: string
          cultura?: string
          data?: string
          id?: string
          risco_pragas?: string
          temperatura?: number
          umidade?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      meu_plano: {
        Row: {
          data_renovacao: string | null
          periodo: string | null
          plano: string | null
          plano_display: string | null
          status: string | null
        }
        Insert: {
          data_renovacao?: string | null
          periodo?: string | null
          plano?: string | null
          plano_display?: never
          status?: string | null
        }
        Update: {
          data_renovacao?: string | null
          periodo?: string | null
          plano?: string | null
          plano_display?: never
          status?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          email: string | null
          id: string | null
          nome: string | null
          plano: string | null
        }
        Insert: {
          email?: string | null
          id?: string | null
          nome?: string | null
          plano?: string | null
        }
        Update: {
          email?: string | null
          id?: string | null
          nome?: string | null
          plano?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit:
        | {
            Args: {
              p_function: string
              p_max_requests: number
              p_user_id: string
              p_window_minutes: number
            }
            Returns: boolean
          }
        | {
            Args: {
              p_function: string
              p_max_requests: number
              p_user_id: string
              p_window_minutes: number
            }
            Returns: boolean
          }
      check_user_permission: {
        Args: { p_modulo: string; p_user_id: string }
        Returns: boolean
      }
      increment_satellite_views: {
        Args: { row_id: string }
        Returns: undefined
      }
      user_has_satellite_access: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

