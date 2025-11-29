export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
          target_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: number
          is_deleted: boolean | null
          parent_id: number | null
          problem_id: string | null
          solution_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          parent_id?: number | null
          problem_id?: string | null
          solution_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          parent_id?: number | null
          problem_id?: string | null
          solution_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          comment_id: number | null
          created_at: string | null
          id: number
          is_read: boolean | null
          problem_id: string | null
          sender_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          comment_id?: number | null
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          problem_id?: string | null
          sender_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          comment_id?: number | null
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          problem_id?: string | null
          sender_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      problems: {
        Row: {
          ai_summary: string | null
          ai_tags: string[] | null
          category: Database["public"]["Enums"]["problem_category"]
          city: string | null
          created_at: string | null
          description: string
          id: string
          latitude: number | null
          location: unknown | null
          longitude: number | null
          media_url: string | null
          pincode: string | null
          region: string | null
          status: Database["public"]["Enums"]["problem_status"] | null
          title: string
          updated_at: string | null
          user_id: string
          votes_count: number | null
        }
        Insert: {
          ai_summary?: string | null
          ai_tags?: string[] | null
          category: Database["public"]["Enums"]["problem_category"]
          city?: string | null
          created_at?: string | null
          description: string
          id?: string
          latitude: number | null
          location?: unknown | null
          longitude: number | null
          media_url?: string | null
          pincode?: string | null
          region?: string | null
          status?: Database["public"]["Enums"]["problem_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
          votes_count?: number | null
        }
        Update: {
          ai_summary?: string | null
          ai_tags?: string[] | null
          category?: Database["public"]["Enums"]["problem_category"]
          city?: string | null
          created_at?: string | null
          description?: string
          id?: string
          latitude?: number | null
          location?: unknown | null
          longitude?: number | null
          media_url?: string | null
          pincode?: string | null
          region?: string | null
          status?: Database["public"]["Enums"]["problem_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "problems_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          badges: string[] | null
          created_at: string | null
          full_name: string | null
          id: string
          latitude: number | null
          longitude: number | null
          points: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          badges?: string[] | null
          created_at?: string | null
          full_name?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          badges?: string[] | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      solutions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          media_url: string | null
          problem_id: string
          updated_at: string | null
          user_id: string
          votes_count: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          media_url?: string | null
          problem_id: string
          updated_at?: string | null
          user_id: string
          votes_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          media_url?: string | null
          problem_id?: string
          updated_at?: string | null
          user_id?: string
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "solutions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solutions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          votable_id: string
          votable_type: Database["public"]["Enums"]["votable_type"]
          vote_type: Database["public"]["Enums"]["vote_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          votable_id: string
          votable_type: Database["public"]["Enums"]["votable_type"]
          vote_type: Database["public"]["Enums"]["vote_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          votable_id?: string
          votable_type?: Database["public"]["Enums"]["votable_type"]
          vote_type?: Database["public"]["Enums"]["vote_type"]
        }
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      problem_correlations: {
        Row: {
          category_a: string | null
          category_b: string | null
          center_point: unknown | null
          city: string | null
          co_occurrence: number | null
          correlation_score: number | null
          latest_problem_date: string | null
          region: string | null
          region_id: string | null
        }
        Relationships: []
      }
      problem_vote_totals: {
        Row: {
          downvotes: number | null
          last_activity_at: string | null
          net_votes: number | null
          problem_id: string | null
          total_votes: number | null
          upvotes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_problem_correlations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_filtered_correlations: {
        Args: {
          start_date?: string
          end_date?: string
          cat_filter?: string[]
          city_filter?: string
        }
        Returns: {
          region_id: string
          city: string
          region: string
          category_a: string
          category_b: string
          correlation_score: number
          co_occurrence: number
          latest_problem_date: string
        }[]
      }
      get_ministry_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_nearby_correlations: {
        Args: {
          lat: number
          lng: number
          radius: number
        }
        Returns: {
          region_id: string
          category_a: string
          category_b: string
          correlation_score: number
          co_occurrence: number
          center_point_wkt: string
        }[]
      }
      nearby_problems: {
        Args: {
          lat: number
          lng: number
        }
        Returns: {
          category: Database["public"]["Enums"]["problem_category"] | null
          created_at: string | null
          description: string | null
          distance_km: number | null
          id: string | null
          latitude: number | null
          longitude: number | null
          media_url: string | null
          status: Database["public"]["Enums"]["problem_status"] | null
          title: string | null
          user_id: string | null
          votes_count: number | null
        }[]
      }
      vote_problem: {
        Args: {
          p_problem_id: string
          p_vote_type: Database["public"]["Enums"]["vote_type"]
        }
        Returns: number
      }
    }
    Enums: {
      commentable_type: "problem" | "solution"
      problem_category:
        | "roads"
        | "water"
        | "electricity"
        | "sanitation"
        | "education"
        | "healthcare"
        | "pollution"
        | "safety"
        | "other"
      problem_status:
        | "reported"
        | "under_review"
        | "approved"
        | "in_progress"
        | "completed"
        | "rejected"
      user_role: "citizen" | "ministry" | "admin"
      vote_type: "upvote" | "downvote"
      votable_type: "problem" | "solution"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

// Manually export the enum for direct import
export const problem_category = {
    Roads: "roads",
    Water: "water",
    Electricity: "electricity",
    Sanitation: "sanitation",
    Education: "education",
    Healthcare: "healthcare",
    Pollution: "pollution",
    Safety: "safety",
    Other: "other"
} as const;
