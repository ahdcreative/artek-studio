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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          model: string | null
          sender: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          model?: string | null
          sender: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          model?: string | null
          sender?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          curseforge_url: string | null
          featured: boolean | null
          id: string
          is_early_access: boolean
          is_free: boolean
          is_published: boolean | null
          metadata: Json | null
          modkit_project: string | null
          notes: string | null
          package_url: string | null
          patreon_url: string | null
          preview_url: string | null
          section: string | null
          slug: string
          sort_order: number | null
          status: number
          summary_en: string | null
          summary_it: string | null
          tier_price_eur: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          curseforge_url?: string | null
          featured?: boolean | null
          id?: string
          is_early_access?: boolean
          is_free?: boolean
          is_published?: boolean | null
          metadata?: Json | null
          modkit_project?: string | null
          notes?: string | null
          package_url?: string | null
          patreon_url?: string | null
          preview_url?: string | null
          section?: string | null
          slug: string
          sort_order?: number | null
          status?: number
          summary_en?: string | null
          summary_it?: string | null
          tier_price_eur?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          curseforge_url?: string | null
          featured?: boolean | null
          id?: string
          is_early_access?: boolean
          is_free?: boolean
          is_published?: boolean | null
          metadata?: Json | null
          modkit_project?: string | null
          notes?: string | null
          package_url?: string | null
          patreon_url?: string | null
          preview_url?: string | null
          section?: string | null
          slug?: string
          sort_order?: number | null
          status?: number
          summary_en?: string | null
          summary_it?: string | null
          tier_price_eur?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      studio_audit_logs: {
        Row: {
          checked_at: string
          findings: Json
          id: string
          source: string
          status: string
          summary: string
        }
        Insert: {
          checked_at?: string
          findings?: Json
          id?: string
          source?: string
          status?: string
          summary: string
        }
        Update: {
          checked_at?: string
          findings?: Json
          id?: string
          source?: string
          status?: string
          summary?: string
        }
        Relationships: []
      }
      studio_integrations: {
        Row: {
          access_token: string
          campaign_id: string | null
          expires_at: string | null
          provider: string
          refresh_token: string
          updated_at: string
        }
        Insert: {
          access_token: string
          campaign_id?: string | null
          expires_at?: string | null
          provider: string
          refresh_token: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          campaign_id?: string | null
          expires_at?: string | null
          provider?: string
          refresh_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      studio_posts: {
        Row: {
          body_en: string
          body_it: string
          cover_url: string | null
          created_at: string
          external_url: string | null
          gallery_urls: Json
          id: string
          is_early_access: boolean
          is_paid: boolean
          is_published: boolean
          metadata: Json
          platform: string
          post_type: string
          project_slug: string | null
          published_at: string
          slug: string
          summary_en: string | null
          summary_it: string | null
          tags: string[]
          tier_name: string | null
          title_en: string
          title_it: string
          updated_at: string
        }
        Insert: {
          body_en: string
          body_it: string
          cover_url?: string | null
          created_at?: string
          external_url?: string | null
          gallery_urls?: Json
          id?: string
          is_early_access?: boolean
          is_paid?: boolean
          is_published?: boolean
          metadata?: Json
          platform?: string
          post_type?: string
          project_slug?: string | null
          published_at?: string
          slug: string
          summary_en?: string | null
          summary_it?: string | null
          tags?: string[]
          tier_name?: string | null
          title_en: string
          title_it: string
          updated_at?: string
        }
        Update: {
          body_en?: string
          body_it?: string
          cover_url?: string | null
          created_at?: string
          external_url?: string | null
          gallery_urls?: Json
          id?: string
          is_early_access?: boolean
          is_paid?: boolean
          is_published?: boolean
          metadata?: Json
          platform?: string
          post_type?: string
          project_slug?: string | null
          published_at?: string
          slug?: string
          summary_en?: string | null
          summary_it?: string | null
          tags?: string[]
          tier_name?: string | null
          title_en?: string
          title_it?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "studio_posts_project_slug_fkey"
            columns: ["project_slug"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["slug"]
          },
        ]
      }
      studio_settings: {
        Row: {
          avatar_url: string | null
          bio_en: string
          bio_it: string
          brand_name: string
          curseforge_url: string | null
          domain: string
          hero_banner_url: string | null
          id: string
          metadata: Json
          patreon_url: string
          tagline_en: string
          tagline_it: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio_en: string
          bio_it: string
          brand_name: string
          curseforge_url?: string | null
          domain: string
          hero_banner_url?: string | null
          id: string
          metadata?: Json
          patreon_url: string
          tagline_en: string
          tagline_it: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio_en?: string
          bio_it?: string
          brand_name?: string
          curseforge_url?: string | null
          domain?: string
          hero_banner_url?: string | null
          id?: string
          metadata?: Json
          patreon_url?: string
          tagline_en?: string
          tagline_it?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
