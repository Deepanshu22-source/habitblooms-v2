export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          icon: string
          color: string
          category: string
          frequency: string
          target_days: number[]
          reminder_time: string | null
          created_at: string
          is_archived: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          icon?: string
          color?: string
          category?: string
          frequency?: string
          target_days?: number[]
          reminder_time?: string | null
          created_at?: string
          is_archived?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          icon?: string
          color?: string
          category?: string
          frequency?: string
          target_days?: number[]
          reminder_time?: string | null
          created_at?: string
          is_archived?: boolean
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed_at: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completed_at?: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completed_at?: string
          note?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          exam_goal: string | null
          score: number
          streak: number
          seeds: number
          streak_freezes: number
          plant_stage: number
          plant_health: number
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          exam_goal?: string | null
          score?: number
          streak?: number
          seeds?: number
          streak_freezes?: number
          plant_stage?: number
          plant_health?: number
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          exam_goal?: string | null
          score?: number
          streak?: number
          seeds?: number
          streak_freezes?: number
          plant_stage?: number
          plant_health?: number
          referred_by?: string | null
          updated_at?: string
        }
      }
      activity_feed: {
        Row: {
          id: string
          user_id: string
          exam_goal: string
          habit_name: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exam_goal: string
          habit_name: string
          action?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exam_goal?: string
          habit_name?: string
          action?: string
          created_at?: string
        }
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          p256dh?: string
          auth?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Habit = Database['public']['Tables']['habits']['Row']
export type HabitInsert = Database['public']['Tables']['habits']['Insert']
export type HabitCompletion = Database['public']['Tables']['habit_completions']['Row']
export type HabitCompletionInsert = Database['public']['Tables']['habit_completions']['Insert']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ActivityFeedItem = Database['public']['Tables']['activity_feed']['Row']
