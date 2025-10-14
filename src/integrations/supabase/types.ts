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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      automated_bots: {
        Row: {
          base_currency: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          max_active_deals: number
          min_balance_required: number
          name: string
          quote_currency: string
          risk_level: string
          stop_loss_percentage: number | null
          strategy_id: string
          take_profit_percentage: number | null
          trading_pair: string
          updated_at: string
        }
        Insert: {
          base_currency: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_active_deals?: number
          min_balance_required?: number
          name: string
          quote_currency: string
          risk_level?: string
          stop_loss_percentage?: number | null
          strategy_id: string
          take_profit_percentage?: number | null
          trading_pair: string
          updated_at?: string
        }
        Update: {
          base_currency?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_active_deals?: number
          min_balance_required?: number
          name?: string
          quote_currency?: string
          risk_level?: string
          stop_loss_percentage?: number | null
          strategy_id?: string
          take_profit_percentage?: number | null
          trading_pair?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automated_bots_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "trading_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_trades: {
        Row: {
          bot_id: string
          created_at: string
          exchange_order_id: string | null
          executed_at: string | null
          fees: number
          id: string
          price: number
          profit_loss: number | null
          quantity: number
          status: string
          symbol: string
          total_value: number
          trade_type: string
        }
        Insert: {
          bot_id: string
          created_at?: string
          exchange_order_id?: string | null
          executed_at?: string | null
          fees?: number
          id?: string
          price: number
          profit_loss?: number | null
          quantity: number
          status?: string
          symbol: string
          total_value: number
          trade_type: string
        }
        Update: {
          bot_id?: string
          created_at?: string
          exchange_order_id?: string | null
          executed_at?: string | null
          fees?: number
          id?: string
          price?: number
          profit_loss?: number | null
          quantity?: number
          status?: string
          symbol?: string
          total_value?: number
          trade_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_trades_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "trading_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      contents_bot: {
        Row: {
          created_at: string
          id: string
          media_type: string
          media_url: string
          metadata: Json | null
          prompt: string
          provider: string
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_type: string
          media_url: string
          metadata?: Json | null
          prompt: string
          provider: string
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_type?: string
          media_url?: string
          metadata?: Json | null
          prompt?: string
          provider?: string
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kyc_verifications: {
        Row: {
          created_at: string | null
          document_back_url: string | null
          document_front_url: string | null
          document_type: string
          id: string
          rejected_at: string | null
          rejection_reason: string | null
          selfie_url: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_back_url?: string | null
          document_front_url?: string | null
          document_type: string
          id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          selfie_url?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_back_url?: string | null
          document_front_url?: string | null
          document_type?: string
          id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          selfie_url?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          asset_symbol: string
          change_24h: number | null
          id: string
          market_cap: number | null
          price: number
          recorded_at: string
          volume_24h: number | null
        }
        Insert: {
          asset_symbol: string
          change_24h?: number | null
          id?: string
          market_cap?: number | null
          price: number
          recorded_at?: string
          volume_24h?: number | null
        }
        Update: {
          asset_symbol?: string
          change_24h?: number | null
          id?: string
          market_cap?: number | null
          price?: number
          recorded_at?: string
          volume_24h?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          subscription_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          subscription_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          subscription_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_rate: number | null
          created_at: string
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          status: string
          total_commission: number | null
          updated_at: string
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          status?: string
          total_commission?: number | null
          updated_at?: string
        }
        Update: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          status?: string
          total_commission?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          last_pin_change: string | null
          passkey_credential_id: string | null
          passkey_enabled: boolean | null
          passkey_public_key: string | null
          pin_enabled: boolean | null
          pin_hash: string | null
          two_factor_enabled: boolean | null
          two_factor_method: string | null
          two_factor_secret: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          last_pin_change?: string | null
          passkey_credential_id?: string | null
          passkey_enabled?: boolean | null
          passkey_public_key?: string | null
          pin_enabled?: boolean | null
          pin_hash?: string | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          last_pin_change?: string | null
          passkey_credential_id?: string | null
          passkey_enabled?: boolean | null
          passkey_public_key?: string | null
          pin_enabled?: boolean | null
          pin_hash?: string | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_activity: string
          session_token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          session_token: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          session_token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      signals: {
        Row: {
          confidence_level: number | null
          created_at: string
          created_by: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          price: number
          signal_type: string
          source: string | null
          stop_loss: number | null
          symbol: string
          target_price: number | null
          updated_at: string
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          price: number
          signal_type: string
          source?: string | null
          stop_loss?: number | null
          symbol: string
          target_price?: number | null
          updated_at?: string
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          price?: number
          signal_type?: string
          source?: string | null
          stop_loss?: number | null
          symbol?: string
          target_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_bots: {
        Row: {
          automated_bot_id: string | null
          base_currency: string
          created_at: string
          current_balance: number
          description: string | null
          exchange: string
          id: string
          initial_balance: number
          is_activated: boolean
          max_active_deals: number
          name: string
          profit_loss: number
          profit_loss_percentage: number
          quote_currency: string
          risk_level: string
          status: string
          stop_loss_percentage: number | null
          strategy_id: string
          take_profit_percentage: number | null
          trading_pair: string
          updated_at: string
          user_id: string
        }
        Insert: {
          automated_bot_id?: string | null
          base_currency: string
          created_at?: string
          current_balance?: number
          description?: string | null
          exchange: string
          id?: string
          initial_balance?: number
          is_activated?: boolean
          max_active_deals?: number
          name: string
          profit_loss?: number
          profit_loss_percentage?: number
          quote_currency: string
          risk_level?: string
          status?: string
          stop_loss_percentage?: number | null
          strategy_id: string
          take_profit_percentage?: number | null
          trading_pair: string
          updated_at?: string
          user_id: string
        }
        Update: {
          automated_bot_id?: string | null
          base_currency?: string
          created_at?: string
          current_balance?: number
          description?: string | null
          exchange?: string
          id?: string
          initial_balance?: number
          is_activated?: boolean
          max_active_deals?: number
          name?: string
          profit_loss?: number
          profit_loss_percentage?: number
          quote_currency?: string
          risk_level?: string
          status?: string
          stop_loss_percentage?: number | null
          strategy_id?: string
          take_profit_percentage?: number | null
          trading_pair?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_bots_automated_bot_id_fkey"
            columns: ["automated_bot_id"]
            isOneToOne: false
            referencedRelation: "automated_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trading_bots_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "trading_strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trading_bots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_strategies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          strategy_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          strategy_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          strategy_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          available_balance: number | null
          balance: number | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          stripe_wallet_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string
          current_period_end: string
          current_period_start?: string
          id?: string
          plan_id: string
          status?: string
          stripe_wallet_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          stripe_wallet_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wallets_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "wallet_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_addresses: {
        Row: {
          address: string
          address_type: string | null
          asset_symbol: string
          created_at: string
          id: string
          is_active: boolean
          network: string
          user_id: string
        }
        Insert: {
          address: string
          address_type?: string | null
          asset_symbol: string
          created_at?: string
          id?: string
          is_active?: boolean
          network: string
          user_id: string
        }
        Update: {
          address?: string
          address_type?: string | null
          asset_symbol?: string
          created_at?: string
          id?: string
          is_active?: boolean
          network?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_assets: {
        Row: {
          asset_name: string
          asset_symbol: string
          average_cost: number | null
          balance: number
          created_at: string
          id: string
          locked_balance: number
          total_invested: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_name: string
          asset_symbol: string
          average_cost?: number | null
          balance?: number
          created_at?: string
          id?: string
          locked_balance?: number
          total_invested?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_name?: string
          asset_symbol?: string
          average_cost?: number | null
          balance?: number
          created_at?: string
          id?: string
          locked_balance?: number
          total_invested?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_plans: {
        Row: {
          billing_period: string
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          is_popular: boolean
          max_bots: number
          max_exchanges: number
          plan_name: string
          price: number
          updated_at: string
          wallet_type: string | null
        }
        Insert: {
          billing_period: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          max_bots?: number
          max_exchanges?: number
          plan_name: string
          price: number
          updated_at?: string
          wallet_type?: string | null
        }
        Update: {
          billing_period?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          max_bots?: number
          max_exchanges?: number
          plan_name?: string
          price?: number
          updated_at?: string
          wallet_type?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          asset_symbol: string
          completed_at: string | null
          created_at: string
          external_transaction_id: string | null
          fees: number | null
          from_address: string | null
          id: string
          network: string | null
          notes: string | null
          price_per_unit: number | null
          status: string
          to_address: string | null
          total_value: number
          transaction_hash: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          asset_symbol: string
          completed_at?: string | null
          created_at?: string
          external_transaction_id?: string | null
          fees?: number | null
          from_address?: string | null
          id?: string
          network?: string | null
          notes?: string | null
          price_per_unit?: number | null
          status?: string
          to_address?: string | null
          total_value: number
          transaction_hash?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          asset_symbol?: string
          completed_at?: string | null
          created_at?: string
          external_transaction_id?: string | null
          fees?: number | null
          from_address?: string | null
          id?: string
          network?: string | null
          notes?: string | null
          price_per_unit?: number | null
          status?: string
          to_address?: string | null
          total_value?: number
          transaction_hash?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid?: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          required_role: Database["public"]["Enums"]["app_role"]
          user_uuid: string
        }
        Returns: boolean
      }
      is_admin_or_sub_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "sub_admin" | "user"
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
    Enums: {
      app_role: ["admin", "sub_admin", "user"],
    },
  },
} as const
