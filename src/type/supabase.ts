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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      experiences: {
        Row: {
          achievements: string[] | null
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          order: number | null
          position: string
          start_date: string | null
          tech_stack: string[] | null
        }
        Insert: {
          achievements?: string[] | null
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          order?: number | null
          position: string
          start_date?: string | null
          tech_stack?: string[] | null
        }
        Update: {
          achievements?: string[] | null
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          order?: number | null
          position?: string
          start_date?: string | null
          tech_stack?: string[] | null
        }
        Relationships: []
      }
      post_series: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order: number | null
          slug: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order?: number | null
          slug: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order?: number | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      post_series_items: {
        Row: {
          created_at: string
          id: string
          order: number | null
          post_id: string | null
          series_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order?: number | null
          post_id?: string | null
          series_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order?: number | null
          post_id?: string | null
          series_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_series_items_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_series_items_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "post_series"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          like_count: number | null
          published: boolean | null
          published_at: string | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          like_count?: number | null
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          like_count?: number | null
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          available_for_work: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          name: string | null
          skills: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          available_for_work?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          skills?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          available_for_work?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          skills?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          demo_url: string | null
          description: string | null
          end_date: string | null
          featured: boolean | null
          github_url: string | null
          id: string
          images: string[] | null
          long_description: string | null
          order: number | null
          start_date: string | null
          status: string | null
          tech_stack: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          end_date?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          images?: string[] | null
          long_description?: string | null
          order?: number | null
          start_date?: string | null
          status?: string | null
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          end_date?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          images?: string[] | null
          long_description?: string | null
          order?: number | null
          start_date?: string | null
          status?: string | null
          tech_stack?: string[] | null
          thumbnail_url?: string | null
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
      increment_view_count: {
        Args: {
          post_slug: string
        }
        Returns: number
      }
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
