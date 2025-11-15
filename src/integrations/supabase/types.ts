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
      achievements: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          key: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward: number
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          key: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward?: number
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          key?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty: Database["public"]["Enums"]["question_difficulty"]
          explanation: string
          id: string
          math_domain: Database["public"]["Enums"]["math_domain"] | null
          module_number: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          order_index: number | null
          question_text: string
          rw_domain: Database["public"]["Enums"]["rw_domain"] | null
          section: Database["public"]["Enums"]["question_section"]
          test_id: string | null
          topic: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty: Database["public"]["Enums"]["question_difficulty"]
          explanation: string
          id?: string
          math_domain?: Database["public"]["Enums"]["math_domain"] | null
          module_number: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          order_index?: number | null
          question_text: string
          rw_domain?: Database["public"]["Enums"]["rw_domain"] | null
          section: Database["public"]["Enums"]["question_section"]
          test_id?: string | null
          topic?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["question_difficulty"]
          explanation?: string
          id?: string
          math_domain?: Database["public"]["Enums"]["math_domain"] | null
          module_number?: number
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          order_index?: number | null
          question_text?: string
          rw_domain?: Database["public"]["Enums"]["rw_domain"] | null
          section?: Database["public"]["Enums"]["question_section"]
          test_id?: string | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_questions: {
        Row: {
          id: string
          question_id: string | null
          saved_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          question_id?: string | null
          saved_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          question_id?: string | null
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          completed_at: string | null
          id: string
          math_correct: number | null
          math_score: number | null
          math_total: number | null
          rw_correct: number | null
          rw_score: number | null
          rw_total: number | null
          started_at: string | null
          test_id: string | null
          total_score: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          math_correct?: number | null
          math_score?: number | null
          math_total?: number | null
          rw_correct?: number | null
          rw_score?: number | null
          rw_total?: number | null
          started_at?: string | null
          test_id?: string | null
          total_score?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          math_correct?: number | null
          math_score?: number | null
          math_total?: number | null
          rw_correct?: number | null
          rw_score?: number | null
          rw_total?: number | null
          started_at?: string | null
          test_id?: string | null
          total_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          answered_at: string | null
          attempt_id: string | null
          id: string
          is_correct: boolean | null
          is_marked: boolean | null
          question_id: string | null
          selected_answer: string | null
          time_spent: number | null
        }
        Insert: {
          answered_at?: string | null
          attempt_id?: string | null
          id?: string
          is_correct?: boolean | null
          is_marked?: boolean | null
          question_id?: string | null
          selected_answer?: string | null
          time_spent?: number | null
        }
        Update: {
          answered_at?: string | null
          attempt_id?: string | null
          id?: string
          is_correct?: boolean | null
          is_marked?: boolean | null
          question_id?: string | null
          selected_answer?: string | null
          time_spent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string | null
          id: string
          last_activity_date: string | null
          level: number
          streak_days: number
          total_questions_answered: number
          updated_at: string | null
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_questions_answered?: number
          updated_at?: string | null
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_questions_answered?: number
          updated_at?: string | null
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      math_domain:
        | "algebra"
        | "advanced_math"
        | "problem_solving_data"
        | "geometry_trig"
      question_difficulty: "easy" | "medium" | "hard"
      question_section: "reading_writing" | "math"
      rw_domain:
        | "information_ideas"
        | "craft_structure"
        | "expression_ideas"
        | "standard_english"
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
      app_role: ["admin", "user"],
      math_domain: [
        "algebra",
        "advanced_math",
        "problem_solving_data",
        "geometry_trig",
      ],
      question_difficulty: ["easy", "medium", "hard"],
      question_section: ["reading_writing", "math"],
      rw_domain: [
        "information_ideas",
        "craft_structure",
        "expression_ideas",
        "standard_english",
      ],
    },
  },
} as const
