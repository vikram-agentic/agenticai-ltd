export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_generated_images: {
        Row: {
          aspect_ratio: string | null
          content_id: string | null
          created_at: string
          generation_params: Json | null
          id: string
          image_url: string
          prompt: string
        }
        Insert: {
          aspect_ratio?: string | null
          content_id?: string | null
          created_at?: string
          generation_params?: Json | null
          id?: string
          image_url: string
          prompt: string
        }
        Update: {
          aspect_ratio?: string | null
          content_id?: string | null
          created_at?: string
          generation_params?: Json | null
          id?: string
          image_url?: string
          prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_generated_images_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "generated_content"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage_logs: {
        Row: {
          cost_usd: number | null
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          request_data: Json | null
          response_data: Json | null
          service_name: string
          success: boolean | null
          tokens_used: number | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          request_data?: Json | null
          response_data?: Json | null
          service_name: string
          success?: boolean | null
          tokens_used?: number | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          request_data?: Json | null
          response_data?: Json | null
          service_name?: string
          success?: boolean | null
          tokens_used?: number | null
        }
        Relationships: []
      }
      content_performance: {
        Row: {
          content_id: string | null
          conversion_rate: number | null
          engagement_metrics: Json | null
          id: string
          last_updated: string
          organic_traffic: number | null
          page_views: number | null
          search_rankings: Json | null
        }
        Insert: {
          content_id?: string | null
          conversion_rate?: number | null
          engagement_metrics?: Json | null
          id?: string
          last_updated?: string
          organic_traffic?: number | null
          page_views?: number | null
          search_rankings?: Json | null
        }
        Update: {
          content_id?: string | null
          conversion_rate?: number | null
          engagement_metrics?: Json | null
          id?: string
          last_updated?: string
          organic_traffic?: number | null
          page_views?: number | null
          search_rankings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "content_performance_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "generated_content"
            referencedColumns: ["id"]
          },
        ]
      }
      content_requests: {
        Row: {
          content_type: string
          created_at: string
          created_by: string | null
          id: string
          progress: number | null
          status: string
          target_keywords: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          progress?: number | null
          status?: string
          target_keywords?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          progress?: number | null
          status?: string
          target_keywords?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_templates: {
        Row: {
          content_type: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          template_data: Json
        }
        Insert: {
          content_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          template_data: Json
        }
        Update: {
          content_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          template_data?: Json
        }
        Relationships: []
      }
      generated_content: {
        Row: {
          categories: string[] | null
          content: string
          created_at: string
          featured_image_url: string | null
          id: string
          meta_description: string | null
          outline: Json | null
          published_at: string | null
          request_id: string | null
          seo_tags: string[] | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          categories?: string[] | null
          content: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          outline?: Json | null
          published_at?: string | null
          request_id?: string | null
          seo_tags?: string[] | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          categories?: string[] | null
          content?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          outline?: Json | null
          published_at?: string | null
          request_id?: string | null
          seo_tags?: string[] | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_content_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "content_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      keywords_research: {
        Row: {
          competition_analysis: Json | null
          created_at: string
          id: string
          keywords: Json
          request_id: string | null
          search_volume_data: Json | null
          seed_keyword: string
        }
        Insert: {
          competition_analysis?: Json | null
          created_at?: string
          id?: string
          keywords: Json
          request_id?: string | null
          search_volume_data?: Json | null
          seed_keyword: string
        }
        Update: {
          competition_analysis?: Json | null
          created_at?: string
          id?: string
          keywords?: Json
          request_id?: string | null
          search_volume_data?: Json | null
          seed_keyword?: string
        }
        Relationships: [
          {
            foreignKeyName: "keywords_research_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "content_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      serp_analysis: {
        Row: {
          competitor_gaps: Json | null
          created_at: string
          id: string
          request_id: string | null
          serp_features: Json | null
          target_keyword: string
          top_results: Json
        }
        Insert: {
          competitor_gaps?: Json | null
          created_at?: string
          id?: string
          request_id?: string | null
          serp_features?: Json | null
          target_keyword: string
          top_results: Json
        }
        Update: {
          competitor_gaps?: Json | null
          created_at?: string
          id?: string
          request_id?: string | null
          serp_features?: Json | null
          target_keyword?: string
          top_results?: Json
        }
        Relationships: [
          {
            foreignKeyName: "serp_analysis_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "content_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      website_context: {
        Row: {
          content: Json
          context_type: string
          created_at: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          context_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          context_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title?: string
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
