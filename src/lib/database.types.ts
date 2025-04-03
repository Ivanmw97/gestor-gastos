export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          amount: number
          date: string
          description: string
          category: string
          type: 'income' | 'expense'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          amount: number
          date: string
          description: string
          category: string
          type: 'income' | 'expense'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          amount?: number
          date?: string
          description?: string
          category?: string
          type?: 'income' | 'expense'
        }
      }
      
      budgets: {
        Row: {
          id: string
          created_at: string
          user_id: string
          category: string
          limit: number
          month: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          category: string
          limit: number
          month: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          category?: string
          limit?: number
          month?: string
        }
      }
      
      categories: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          color: string
          icon: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          color: string
          icon?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          type?: 'income' | 'expense'
          color?: string
          icon?: string | null
        }
      }
      
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          currency: string
          theme: 'light' | 'dark' | 'system'
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          currency?: string
          theme?: 'light' | 'dark' | 'system'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          currency?: string
          theme?: 'light' | 'dark' | 'system'
        }
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
  }
}