// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
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
      calculos_roi: {
        Row: {
          custo_producao: number
          data_criacao: string
          id: string
          lucro_liquido: number
          margem_lucro: number
          payback_meses: number
          receita_esperada: number
          roi_percentual: number
          tempo_retorno: number
          user_id: string
        }
        Insert: {
          custo_producao: number
          data_criacao?: string
          id?: string
          lucro_liquido: number
          margem_lucro: number
          payback_meses: number
          receita_esperada: number
          roi_percentual: number
          tempo_retorno: number
          user_id: string
        }
        Update: {
          custo_producao?: number
          data_criacao?: string
          id?: string
          lucro_liquido?: number
          margem_lucro?: number
          payback_meses?: number
          receita_esperada?: number
          roi_percentual?: number
          tempo_retorno?: number
          user_id?: string
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
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
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
          created_at: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          plan_active: string | null
          status: string | null
          trial_expires_at: string | null
          user_type: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          phone?: string | null
          plan_active?: string | null
          status?: string | null
          trial_expires_at?: string | null
          user_type?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          plan_active?: string | null
          status?: string | null
          trial_expires_at?: string | null
          user_type?: string | null
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
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
// Table: ai_forecasts
//   id: uuid (not null, default: gen_random_uuid())
//   commodity: text (not null)
//   current_price: numeric (not null, default: 0)
//   trend_data: jsonb (not null, default: '[]'::jsonb)
//   recommendation: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
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
// Table: usuarios
//   id: uuid (nullable)
//   email: text (nullable)
//   nome: text (nullable)
//   plano: text (nullable)

// --- CONSTRAINTS ---
// Table: ai_forecasts
//   PRIMARY KEY ai_forecasts_pkey: PRIMARY KEY (id)
// Table: calculos_roi
//   PRIMARY KEY calculos_roi_pkey: PRIMARY KEY (id)
//   FOREIGN KEY calculos_roi_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: order_items
//   FOREIGN KEY order_items_order_id_fkey: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
//   PRIMARY KEY order_items_pkey: PRIMARY KEY (id)
//   FOREIGN KEY order_items_product_id_fkey: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
// Table: orders
//   PRIMARY KEY orders_pkey: PRIMARY KEY (id)
//   CHECK orders_status_check: CHECK ((status = ANY (ARRAY['pendente'::text, 'pago'::text, 'enviado'::text])))
//   FOREIGN KEY orders_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: price_alerts
//   PRIMARY KEY price_alerts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY price_alerts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: products
//   CHECK products_category_check: CHECK ((category = ANY (ARRAY['ração'::text, 'fertilizante'::text, 'sementes'::text, 'defensivos'::text])))
//   PRIMARY KEY products_pkey: PRIMARY KEY (id)
// Table: user_plans
//   PRIMARY KEY user_plans_pkey: PRIMARY KEY (id)
//   CHECK user_plans_plan_name_check: CHECK ((plan_name = ANY (ARRAY['Básico'::text, 'Plantio Solo'::text, 'Pecuário Solo'::text, 'Completo'::text, 'Família Coop'::text])))
//   FOREIGN KEY user_plans_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: users
//   FOREIGN KEY users_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY users_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: ai_forecasts
//   Policy "ai_forecasts_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "ai_forecasts_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: calculos_roi
//   Policy "calculos_roi_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "calculos_roi_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "calculos_roi_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//   Policy "calculos_roi_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
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
//   Policy "Users can read own data" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//   Policy "Users can update own data" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: (auth.uid() = id)

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
//       trial_expires_at
//     )
//     VALUES (
//       NEW.id,
//       COALESCE(NEW.email, ''),
//       COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'nome', 'Usuário'),
//       'produtor',
//       'ativo',
//       'Básico',
//       NOW(),
//       NOW() + INTERVAL '30 days'
//     )
//     ON CONFLICT (id) DO NOTHING;
//
//     RETURN NEW;
//   EXCEPTION WHEN OTHERS THEN
//     -- Fallback to ensure auth.users insert doesn't fail even if public.users insert fails
//     RETURN NEW;
//   END;
//   $function$
//
