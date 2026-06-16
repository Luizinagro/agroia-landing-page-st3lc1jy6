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
          latitude: number
          longitude: number
          nome: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cultura_principal: string
          id?: string
          latitude: number
          longitude: number
          nome: string
          user_id: string
        }
        Update: {
          created_at?: string
          cultura_principal?: string
          id?: string
          latitude?: number
          longitude?: number
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


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: agenda_manejo
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   titulo: text (not null)
//   data_prevista: date (not null)
//   status: text (nullable, default: 'Pendente'::text)
//   tipo_atividade: text (nullable)
//   clima_recomendado: boolean (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: ai_forecasts
//   id: uuid (not null, default: gen_random_uuid())
//   commodity: text (not null)
//   current_price: numeric (not null, default: 0)
//   trend_data: jsonb (not null, default: '[]'::jsonb)
//   recommendation: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: alertas_cio
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   animal_id: uuid (not null)
//   mensagem: text (not null)
//   data_alerta: timestamp with time zone (not null, default: now())
//   status: text (nullable, default: 'pendente'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: animais
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   tipo: text (not null)
//   raca: text (nullable)
//   data_nascimento: date (nullable)
//   peso_atual: numeric (nullable)
//   ultima_data_cio: date (nullable)
//   status: text (nullable, default: 'Ativo'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   proximo_cio_estimado: date (nullable)
//   confianca_previsao: numeric (nullable)
//   recomendacoes_ia: text (nullable)
// Table: calculos_carbono
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   area_hectares: numeric (nullable)
//   cultura: text (nullable)
//   bioma: text (nullable)
//   praticas: jsonb (nullable)
//   toneladas_co2_ano: numeric (nullable)
//   receita_anual: numeric (nullable)
//   score_sustentabilidade: integer (nullable)
//   resultado_completo: jsonb (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: calculos_roi
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   custo_producao: numeric (not null)
//   receita_esperada: numeric (not null)
//   tempo_retorno: numeric (not null)
//   lucro_liquido: numeric (not null)
//   margem_lucro: numeric (not null)
//   roi_percentual: numeric (not null)
//   payback_meses: numeric (not null)
//   data_criacao: timestamp with time zone (not null, default: now())
//   cultura: text (nullable)
//   quantidade: numeric (nullable)
// Table: carrinho
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   produto_id: uuid (not null)
//   quantidade: numeric (not null, default: 1)
//   created_at: timestamp with time zone (not null, default: now())
// Table: clima
//   id: uuid (not null, default: gen_random_uuid())
//   propriedade_id: uuid (not null)
//   temperatura: numeric (not null, default: 0)
//   umidade: numeric (not null, default: 0)
//   precipitacao: numeric (not null, default: 0)
//   vento: numeric (not null, default: 0)
//   data_atualizacao: timestamp with time zone (not null, default: now())
//   created_at: timestamp with time zone (not null, default: now())
// Table: comunidade_posts
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   titulo: text (not null)
//   conteudo: text (not null)
//   categoria: text (not null)
//   data: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: consultas_ia
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   regiao: text (not null)
//   pergunta: text (not null)
//   resposta: jsonb (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   is_favorite: boolean (not null, default: false)
// Table: crm_leads
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   email: text (not null)
//   telefone: text (nullable)
//   tamanho_propriedade: text (nullable)
//   regiao: text (nullable)
//   tipo_cultura: text (nullable)
//   status: text (nullable, default: 'Novo'::text)
//   valor_estimado: numeric (nullable, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: crm_tasks
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   title: text (not null)
//   status: text (not null, default: 'pendente'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   assigned_by: uuid (nullable)
//   assigned_by_name: text (nullable)
// Table: dashboard_history
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   day: text (not null)
//   temp: numeric (not null, default: 0)
//   humidity: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: dashboard_kpis
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   produtividade: numeric (not null, default: 85)
//   sensores_ativos: text (not null, default: '12/12'::text)
//   saude_safra: text (not null, default: 'Excelente'::text)
//   receita_estimada: text (not null, default: 'Em alta'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: diagnosticos_pragas
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   cultura: text (nullable)
//   praga_identificada: text (nullable)
//   severidade: text (nullable)
//   confianca: integer (nullable)
//   latitude: numeric (nullable)
//   longitude: numeric (nullable)
//   analise_completa: jsonb (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: financeiro_lancamentos
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   descricao: text (not null)
//   tipo: text (not null)
//   categoria: text (not null, default: 'outros'::text)
//   valor: numeric (not null)
//   vencimento: date (nullable)
//   data_pagamento: date (nullable)
//   status: text (not null, default: 'pendente'::text)
//   safra: text (nullable)
//   cultura: text (nullable)
//   observacao: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: insumos_cadastro
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   categoria: text (not null)
//   unidade: text (not null, default: 'L'::text)
//   estoque_atual: numeric (nullable, default: 0)
//   estoque_minimo: numeric (nullable, default: 0)
//   preco_unitario: numeric (nullable, default: 0)
//   fornecedor: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: insumos_movimentacoes
//   id: uuid (not null, default: gen_random_uuid())
//   insumo_id: uuid (not null)
//   tipo: text (not null)
//   quantidade: numeric (not null)
//   data: date (not null, default: CURRENT_DATE)
//   fornecedor: text (nullable)
//   nota_fiscal: text (nullable)
//   preco_unitario: numeric (nullable, default: 0)
//   valor_total: numeric (nullable, default: 0)
//   talhao: text (nullable)
//   cultura: text (nullable)
//   safra: text (nullable)
//   tipo_aplicacao: text (nullable)
//   observacao: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: maquinario
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   modelo: text (nullable)
//   horas_uso: numeric (not null, default: 0)
//   proxima_manutencao_horas: numeric (nullable)
//   status: text (nullable, default: 'Operacional'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: maquinas
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   tipo: text (not null, default: 'trator'::text)
//   marca: text (nullable)
//   modelo: text (nullable)
//   ano: integer (nullable)
//   placa: text (nullable)
//   foto_url: text (nullable)
//   horimetro_atual: numeric (nullable, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: maquinas_despesas
//   id: uuid (not null, default: gen_random_uuid())
//   maquina_id: uuid (not null)
//   data: date (not null, default: CURRENT_DATE)
//   categoria: text (not null)
//   descricao: text (nullable)
//   valor: numeric (not null)
//   horas_maquina: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: maquinas_documentos
//   id: uuid (not null, default: gen_random_uuid())
//   maquina_id: uuid (not null)
//   tipo: text (not null)
//   descricao: text (nullable)
//   vencimento: date (nullable)
//   valor_seguro: numeric (nullable)
//   seguradora: text (nullable)
//   numero_apolice: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: maquinas_horimetro
//   id: uuid (not null, default: gen_random_uuid())
//   maquina_id: uuid (not null)
//   data: date (not null, default: CURRENT_DATE)
//   horas: numeric (not null)
//   observacao: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: maquinas_manutencao
//   id: uuid (not null, default: gen_random_uuid())
//   maquina_id: uuid (not null)
//   descricao: text (not null)
//   tipo_gatilho: text (not null, default: 'data'::text)
//   horas_gatilho: numeric (nullable)
//   data_gatilho: date (nullable)
//   intervalo_horas: numeric (nullable)
//   status: text (not null, default: 'agendado'::text)
//   data_realizada: date (nullable)
//   custo_realizado: numeric (nullable)
//   observacao: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: marketplace_pedidos
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   numero_pedido: text (not null)
//   data: text (not null)
//   produtos: jsonb (not null, default: '[]'::jsonb)
//   subtotal: numeric (not null)
//   frete: numeric (not null)
//   valor_total: numeric (not null)
//   status: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: marketplace_produtos
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   nome: text (not null)
//   descricao: text (not null)
//   preco_base: numeric (not null)
//   markup_10pct: boolean (not null, default: true)
//   preco_final: numeric (not null)
//   estoque: numeric (not null, default: 0)
//   image: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: order_items
//   id: uuid (not null, default: gen_random_uuid())
//   order_id: uuid (not null)
//   product_id: uuid (not null)
//   quantity: numeric (not null, default: 1)
//   unit_price: numeric (not null, default: 0)
// Table: orders
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   total_price: numeric (not null, default: 0)
//   status: text (nullable, default: 'pendente'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   delivery_address: text (nullable)
// Table: pecuaria_animais
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   tipo: text (not null)
//   peso: numeric (not null)
//   fase: text (not null)
//   racao_recomendada: text (not null)
//   custo_mensal: numeric (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: planos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   preco: text (not null)
//   periodo: text (nullable)
//   descricao: text (not null)
//   features: jsonb (not null, default: '[]'::jsonb)
//   botao: text (not null)
//   destaque: boolean (not null, default: false)
//   ordem: integer (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: precos_cache
//   id: uuid (not null, default: gen_random_uuid())
//   commodity: text (not null)
//   preco_saca: numeric (not null)
//   unidade: text (nullable, default: 'saca 60kg'::text)
//   variacao_dia: numeric (nullable, default: 0)
//   fonte: text (nullable, default: 'Gemini-IA'::text)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: previsoes
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   cultura: text (not null)
//   quantidade: numeric (not null, default: 0)
//   preco_atual: numeric (not null, default: 0)
//   previsao_30d: numeric (nullable)
//   previsao_60d: numeric (nullable)
//   data: timestamp with time zone (not null, default: now())
//   created_at: timestamp with time zone (not null, default: now())
// Table: price_alerts
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   commodity: text (not null)
//   target_price: numeric (not null)
//   condition: text (not null)
//   is_active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
// Table: products
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   price: numeric (not null, default: 0)
//   category: text (nullable)
//   image_url: text (nullable)
//   stock: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: propriedades
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   latitude: numeric (not null)
//   longitude: numeric (not null)
//   cultura_principal: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: rastreabilidade
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   etapa: text (not null)
//   data: timestamp with time zone (not null, default: now())
//   responsavel: text (nullable)
//   status: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: rebanho
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   tipo_animal: text (not null)
//   quantidade: numeric (not null, default: 0)
//   data_entrada: timestamp with time zone (not null, default: now())
//   status: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: rh_atividades
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (not null)
//   data: date (not null, default: CURRENT_DATE)
//   descricao: text (not null)
//   talhao: text (nullable)
//   cultura: text (nullable)
//   horas: numeric (nullable, default: 0)
//   equipamento: text (nullable)
//   observacao: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: rh_funcionarios
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   cpf: text (nullable)
//   funcao: text (not null)
//   data_admissao: date (nullable)
//   data_desligamento: date (nullable)
//   motivo_desligamento: text (nullable)
//   salario_base: numeric (nullable, default: 0)
//   telefone: text (nullable)
//   observacao: text (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: rh_ponto
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (not null)
//   data: date (not null)
//   hora_entrada: text (nullable)
//   hora_saida: text (nullable)
//   horas_trabalhadas: numeric (nullable, default: 0)
//   horas_extras: numeric (nullable, default: 0)
//   observacao: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: safras_benchmarking
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   ano: text (not null)
//   cultura: text (not null)
//   sacas_por_ha: numeric (not null)
//   custo_por_ha: numeric (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: satellite_analyses
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   latitude: numeric (not null)
//   longitude: numeric (not null)
//   ndvi_value: numeric (not null)
//   soil_moisture: numeric (not null)
//   temperature: numeric (not null)
//   image_url: text (nullable)
//   analysis_date: timestamp with time zone (not null, default: now())
//   created_at: timestamp with time zone (not null, default: now())
//   views_count: integer (not null, default: 0)
// Table: system_alerts
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   tipo: text (not null)
//   mensagem: text (not null)
//   data_leitura: timestamp with time zone (nullable)
//   data_criacao: timestamp with time zone (not null, default: now())
// Table: user_estoque
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   item_nome: text (not null)
//   categoria: text (nullable)
//   quantidade: numeric (not null, default: 0)
//   unidade: text (nullable, default: 'un'::text)
//   custo_total: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: user_plans
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   plan_name: text (not null)
//   plan_features: jsonb (nullable, default: '[]'::jsonb)
//   expires_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: users
//   id: uuid (not null)
//   email: text (not null)
//   name: text (nullable)
//   user_type: text (nullable, default: 'produtor'::text)
//   status: text (nullable, default: 'ativo'::text)
//   plan_active: text (nullable, default: 'Básico'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   trial_expires_at: timestamp with time zone (nullable, default: (now() + '30 days'::interval))
//   phone: text (nullable)
//   address: text (nullable)
//   plan_type: text (nullable)
//   cpf: text (nullable)
//   estado: text (nullable)
//   cidade: text (nullable)
//   terms_accepted: boolean (nullable, default: false)
//   terms_accepted_at: timestamp with time zone (nullable)
// Table: usuarios
//   id: uuid (nullable)
//   email: text (nullable)
//   nome: text (nullable)
//   plano: text (nullable)
// Table: weather_forecasts
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   cidade: text (not null)
//   cultura: text (not null)
//   temperatura: numeric (not null)
//   umidade: numeric (not null)
//   risco_pragas: text (not null)
//   data: text (not null)
//   created_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: agenda_manejo
//   PRIMARY KEY agenda_manejo_pkey: PRIMARY KEY (id)
//   FOREIGN KEY agenda_manejo_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: ai_forecasts
//   PRIMARY KEY ai_forecasts_pkey: PRIMARY KEY (id)
// Table: alertas_cio
//   FOREIGN KEY alertas_cio_animal_id_fkey: FOREIGN KEY (animal_id) REFERENCES animais(id) ON DELETE CASCADE
//   PRIMARY KEY alertas_cio_pkey: PRIMARY KEY (id)
//   FOREIGN KEY alertas_cio_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: animais
//   PRIMARY KEY animais_pkey: PRIMARY KEY (id)
//   FOREIGN KEY animais_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: calculos_carbono
//   PRIMARY KEY calculos_carbono_pkey: PRIMARY KEY (id)
//   FOREIGN KEY calculos_carbono_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: calculos_roi
//   PRIMARY KEY calculos_roi_pkey: PRIMARY KEY (id)
//   FOREIGN KEY calculos_roi_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: carrinho
//   PRIMARY KEY carrinho_pkey: PRIMARY KEY (id)
//   FOREIGN KEY carrinho_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES products(id) ON DELETE CASCADE
//   FOREIGN KEY carrinho_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: clima
//   PRIMARY KEY clima_pkey: PRIMARY KEY (id)
//   FOREIGN KEY clima_propriedade_id_fkey: FOREIGN KEY (propriedade_id) REFERENCES propriedades(id) ON DELETE CASCADE
// Table: comunidade_posts
//   PRIMARY KEY comunidade_posts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY comunidade_posts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: consultas_ia
//   PRIMARY KEY consultas_ia_pkey: PRIMARY KEY (id)
//   FOREIGN KEY consultas_ia_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: crm_leads
//   PRIMARY KEY crm_leads_pkey: PRIMARY KEY (id)
// Table: crm_tasks
//   FOREIGN KEY crm_tasks_assigned_by_fkey: FOREIGN KEY (assigned_by) REFERENCES auth.users(id)
//   PRIMARY KEY crm_tasks_pkey: PRIMARY KEY (id)
//   FOREIGN KEY crm_tasks_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: dashboard_history
//   PRIMARY KEY dashboard_history_pkey: PRIMARY KEY (id)
//   FOREIGN KEY dashboard_history_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: dashboard_kpis
//   PRIMARY KEY dashboard_kpis_pkey: PRIMARY KEY (id)
//   FOREIGN KEY dashboard_kpis_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE dashboard_kpis_user_id_key: UNIQUE (user_id)
// Table: diagnosticos_pragas
//   PRIMARY KEY diagnosticos_pragas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY diagnosticos_pragas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: financeiro_lancamentos
//   PRIMARY KEY financeiro_lancamentos_pkey: PRIMARY KEY (id)
//   CHECK financeiro_lancamentos_tipo_check: CHECK ((tipo = ANY (ARRAY['receita'::text, 'despesa'::text])))
// Table: insumos_cadastro
//   PRIMARY KEY insumos_cadastro_pkey: PRIMARY KEY (id)
// Table: insumos_movimentacoes
//   FOREIGN KEY insumos_movimentacoes_insumo_id_fkey: FOREIGN KEY (insumo_id) REFERENCES insumos_cadastro(id) ON DELETE CASCADE
//   PRIMARY KEY insumos_movimentacoes_pkey: PRIMARY KEY (id)
//   CHECK insumos_movimentacoes_tipo_check: CHECK ((tipo = ANY (ARRAY['entrada'::text, 'saida'::text])))
// Table: maquinario
//   PRIMARY KEY maquinario_pkey: PRIMARY KEY (id)
//   FOREIGN KEY maquinario_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: maquinas
//   PRIMARY KEY maquinas_pkey: PRIMARY KEY (id)
// Table: maquinas_despesas
//   FOREIGN KEY maquinas_despesas_maquina_id_fkey: FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE CASCADE
//   PRIMARY KEY maquinas_despesas_pkey: PRIMARY KEY (id)
// Table: maquinas_documentos
//   FOREIGN KEY maquinas_documentos_maquina_id_fkey: FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE CASCADE
//   PRIMARY KEY maquinas_documentos_pkey: PRIMARY KEY (id)
// Table: maquinas_horimetro
//   FOREIGN KEY maquinas_horimetro_maquina_id_fkey: FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE CASCADE
//   PRIMARY KEY maquinas_horimetro_pkey: PRIMARY KEY (id)
// Table: maquinas_manutencao
//   FOREIGN KEY maquinas_manutencao_maquina_id_fkey: FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE CASCADE
//   PRIMARY KEY maquinas_manutencao_pkey: PRIMARY KEY (id)
// Table: marketplace_pedidos
//   PRIMARY KEY marketplace_pedidos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY marketplace_pedidos_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: marketplace_produtos
//   PRIMARY KEY marketplace_produtos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY marketplace_produtos_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: order_items
//   FOREIGN KEY order_items_order_id_fkey: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
//   PRIMARY KEY order_items_pkey: PRIMARY KEY (id)
//   FOREIGN KEY order_items_product_id_fkey: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
// Table: orders
//   PRIMARY KEY orders_pkey: PRIMARY KEY (id)
//   CHECK orders_status_check: CHECK ((status = ANY (ARRAY['pendente'::text, 'pago'::text, 'enviado'::text])))
//   FOREIGN KEY orders_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: pecuaria_animais
//   PRIMARY KEY pecuaria_animais_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pecuaria_animais_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: planos
//   UNIQUE planos_nome_key: UNIQUE (nome)
//   PRIMARY KEY planos_pkey: PRIMARY KEY (id)
// Table: precos_cache
//   PRIMARY KEY precos_cache_pkey: PRIMARY KEY (id)
// Table: previsoes
//   PRIMARY KEY previsoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY previsoes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: price_alerts
//   PRIMARY KEY price_alerts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY price_alerts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: products
//   CHECK products_category_check: CHECK ((category = ANY (ARRAY['ração'::text, 'fertilizante'::text, 'sementes'::text, 'defensivos'::text])))
//   PRIMARY KEY products_pkey: PRIMARY KEY (id)
// Table: propriedades
//   PRIMARY KEY propriedades_pkey: PRIMARY KEY (id)
//   FOREIGN KEY propriedades_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: rastreabilidade
//   PRIMARY KEY rastreabilidade_pkey: PRIMARY KEY (id)
//   FOREIGN KEY rastreabilidade_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: rebanho
//   PRIMARY KEY rebanho_pkey: PRIMARY KEY (id)
//   FOREIGN KEY rebanho_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: rh_atividades
//   FOREIGN KEY rh_atividades_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES rh_funcionarios(id) ON DELETE CASCADE
//   PRIMARY KEY rh_atividades_pkey: PRIMARY KEY (id)
// Table: rh_funcionarios
//   PRIMARY KEY rh_funcionarios_pkey: PRIMARY KEY (id)
// Table: rh_ponto
//   UNIQUE rh_ponto_funcionario_id_data_key: UNIQUE (funcionario_id, data)
//   FOREIGN KEY rh_ponto_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES rh_funcionarios(id) ON DELETE CASCADE
//   PRIMARY KEY rh_ponto_pkey: PRIMARY KEY (id)
// Table: safras_benchmarking
//   PRIMARY KEY safras_benchmarking_pkey: PRIMARY KEY (id)
//   FOREIGN KEY safras_benchmarking_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: satellite_analyses
//   PRIMARY KEY satellite_analyses_pkey: PRIMARY KEY (id)
//   FOREIGN KEY satellite_analyses_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: system_alerts
//   PRIMARY KEY system_alerts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY system_alerts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: user_estoque
//   PRIMARY KEY user_estoque_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_estoque_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: user_plans
//   PRIMARY KEY user_plans_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_plans_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: users
//   FOREIGN KEY users_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY users_pkey: PRIMARY KEY (id)
// Table: weather_forecasts
//   PRIMARY KEY weather_forecasts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY weather_forecasts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: agenda_manejo
//   Policy "agenda_manejo_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: ai_forecasts
//   Policy "ai_forecasts_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "ai_forecasts_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: alertas_cio
//   Policy "Service role can manage all alertas_cio" (ALL, PERMISSIVE) roles={service_role}
//     USING: true
//     WITH CHECK: true
//   Policy "Users can manage own alertas_cio" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: animais
//   Policy "Users can manage own animais" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: calculos_roi
//   Policy "calculos_roi_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "calculos_roi_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "calculos_roi_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "calculos_roi_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
// Table: carrinho
//   Policy "carrinho_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "carrinho_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "carrinho_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "carrinho_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//     WITH CHECK: (user_id = auth.uid())
// Table: clima
//   Policy "Service role can manage all clima" (ALL, PERMISSIVE) roles={service_role}
//     USING: true
//     WITH CHECK: true
//   Policy "Users can insert clima for their properties" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (propriedade_id IN ( SELECT propriedades.id    FROM propriedades   WHERE (propriedades.user_id = auth.uid())))
//   Policy "Users can view clima for their properties" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (propriedade_id IN ( SELECT propriedades.id    FROM propriedades   WHERE (propriedades.user_id = auth.uid())))
// Table: comunidade_posts
//   Policy "Users can delete own comunidade_posts" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "Users can insert own comunidade_posts" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can read own comunidade_posts" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "Users can update own comunidade_posts" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
// Table: consultas_ia
//   Policy "Users can manage own consultas_ia" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: crm_leads
//   Policy "admins_all_crm_leads" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM users   WHERE ((users.id = auth.uid()) AND (users.user_type = 'admin'::text))))
// Table: crm_tasks
//   Policy "Users can manage their own tasks" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((auth.uid() = user_id) OR (auth.uid() = assigned_by))
//     WITH CHECK: ((auth.uid() = user_id) OR (auth.uid() = assigned_by))
// Table: dashboard_history
//   Policy "Users can read own dashboard_history" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
// Table: dashboard_kpis
//   Policy "Users can read own dashboard_kpis" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
// Table: diagnosticos_pragas
//   Policy "Users can delete own diagnosticos" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "Users can insert own diagnosticos" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can update own diagnosticos" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "Users can view own diagnosticos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
// Table: financeiro_lancamentos
//   Policy "financeiro_lancamentos_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "financeiro_lancamentos_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "financeiro_lancamentos_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "financeiro_lancamentos_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
// Table: maquinario
//   Policy "maquinario_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: marketplace_pedidos
//   Policy "Users can manage own marketplace_pedidos" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: marketplace_produtos
//   Policy "Anyone can read marketplace_produtos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Users can manage own marketplace_produtos" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: order_items
//   Policy "order_items_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (order_id IN ( SELECT orders.id    FROM orders   WHERE (orders.user_id = auth.uid())))
//   Policy "order_items_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (order_id IN ( SELECT orders.id    FROM orders   WHERE (orders.user_id = auth.uid())))
//   Policy "order_items_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (order_id IN ( SELECT orders.id    FROM orders   WHERE (orders.user_id = auth.uid())))
//   Policy "order_items_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (order_id IN ( SELECT orders.id    FROM orders   WHERE (orders.user_id = auth.uid())))
// Table: orders
//   Policy "orders_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "orders_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "orders_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "orders_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//     WITH CHECK: (user_id = auth.uid())
// Table: pecuaria_animais
//   Policy "Users can manage own pecuaria_animais" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: planos
//   Policy "Anyone can read planos" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: previsoes
//   Policy "previsoes_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "previsoes_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "previsoes_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "previsoes_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//     WITH CHECK: (user_id = auth.uid())
// Table: price_alerts
//   Policy "price_alerts_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "price_alerts_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "price_alerts_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "price_alerts_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//     WITH CHECK: (user_id = auth.uid())
// Table: products
//   Policy "products_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "products_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "products_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "products_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: propriedades
//   Policy "Users can manage own propriedades" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: rastreabilidade
//   Policy "rastreabilidade_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "rastreabilidade_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "rastreabilidade_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "rastreabilidade_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//     WITH CHECK: (user_id = auth.uid())
// Table: rebanho
//   Policy "rebanho_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "rebanho_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "rebanho_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "rebanho_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//     WITH CHECK: (user_id = auth.uid())
// Table: safras_benchmarking
//   Policy "safras_benchmarking_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: satellite_analyses
//   Policy "Public can read satellite_analyses" (SELECT, PERMISSIVE) roles={anon,authenticated}
//     USING: true
//   Policy "Users can insert own satellite analyses" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((auth.uid() = user_id) AND user_has_satellite_access())
//   Policy "Users can read own satellite analyses" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
// Table: system_alerts
//   Policy "Users can read own system_alerts" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "Users can update own system_alerts" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
// Table: user_estoque
//   Policy "user_estoque_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: user_plans
//   Policy "user_plans_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "user_plans_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "user_plans_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "user_plans_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//     WITH CHECK: (user_id = auth.uid())
// Table: users
//   Policy "Users can read all users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Users can read own data" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//   Policy "Users can update own data" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: (auth.uid() = id)
// Table: weather_forecasts
//   Policy "Users can delete own weather_forecasts" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "Users can insert own weather_forecasts" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can read own weather_forecasts" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "Users can update own weather_forecasts" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     INSERT INTO public.users (
//       id, 
//       email, 
//       name, 
//       user_type, 
//       status, 
//       plan_active, 
//       created_at, 
//       trial_expires_at,
//       phone,
//       cpf,
//       estado,
//       cidade,
//       terms_accepted,
//       terms_accepted_at
//     )
//     VALUES (
//       NEW.id,
//       COALESCE(NEW.email, ''),
//       COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'nome', 'Usuário'),
//       'produtor',
//       'ativo',
//       'Básico',
//       NOW(),
//       NOW() + INTERVAL '30 days',
//       NEW.raw_user_meta_data->>'phone',
//       NEW.raw_user_meta_data->>'cpf',
//       NEW.raw_user_meta_data->>'estado',
//       NEW.raw_user_meta_data->>'cidade',
//       COALESCE((NEW.raw_user_meta_data->>'terms_accepted')::boolean, false),
//       NULLIF(NEW.raw_user_meta_data->>'terms_accepted_at', '')::timestamptz
//     )
//     ON CONFLICT (id) DO NOTHING;
//     
//     RETURN NEW;
//   EXCEPTION WHEN OTHERS THEN
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION increment_satellite_views(uuid)
//   CREATE OR REPLACE FUNCTION public.increment_satellite_views(row_id uuid)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     UPDATE public.satellite_analyses
//     SET views_count = COALESCE(views_count, 0) + 1
//     WHERE id = row_id;
//   END;
//   $function$
//   
// FUNCTION user_has_satellite_access()
//   CREATE OR REPLACE FUNCTION public.user_has_satellite_access()
//    RETURNS boolean
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     user_plan TEXT;
//   BEGIN
//     SELECT plan_active INTO user_plan FROM public.users WHERE id = auth.uid();
//     RETURN user_plan IN ('Completo', 'Família Coop');
//   END;
//   $function$
//   

// --- INDEXES ---
// Table: alertas_cio
//   CREATE INDEX alertas_cio_animal_id_idx ON public.alertas_cio USING btree (animal_id)
//   CREATE INDEX alertas_cio_user_id_idx ON public.alertas_cio USING btree (user_id)
// Table: crm_tasks
//   CREATE INDEX crm_tasks_user_id_idx ON public.crm_tasks USING btree (user_id)
// Table: dashboard_kpis
//   CREATE UNIQUE INDEX dashboard_kpis_user_id_key ON public.dashboard_kpis USING btree (user_id)
// Table: diagnosticos_pragas
//   CREATE INDEX idx_diagnosticos_user ON public.diagnosticos_pragas USING btree (user_id)
// Table: planos
//   CREATE UNIQUE INDEX planos_nome_key ON public.planos USING btree (nome)
// Table: precos_cache
//   CREATE INDEX idx_precos_cache_commodity ON public.precos_cache USING btree (commodity)
//   CREATE INDEX idx_precos_cache_created ON public.precos_cache USING btree (created_at DESC)
// Table: propriedades
//   CREATE INDEX propriedades_user_id_idx ON public.propriedades USING btree (user_id)
// Table: rh_ponto
//   CREATE UNIQUE INDEX rh_ponto_funcionario_id_data_key ON public.rh_ponto USING btree (funcionario_id, data)

