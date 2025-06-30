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
      airlines: {
        Row: {
          alliance: string | null
          created_at: string
          frequent_flyer_program_id: string | null
          iata_code: string
          icao_code: string | null
          id: string
          name: string
        }
        Insert: {
          alliance?: string | null
          created_at?: string
          frequent_flyer_program_id?: string | null
          iata_code: string
          icao_code?: string | null
          id?: string
          name: string
        }
        Update: {
          alliance?: string | null
          created_at?: string
          frequent_flyer_program_id?: string | null
          iata_code?: string
          icao_code?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "airlines_frequent_flyer_program_id_fkey"
            columns: ["frequent_flyer_program_id"]
            isOneToOne: false
            referencedRelation: "frequent_flyer_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      airports: {
        Row: {
          city: string
          country: string
          created_at: string
          iata_code: string
          icao_code: string | null
          id: string
          is_major: boolean
          latitude: number
          longitude: number
          name: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          iata_code: string
          icao_code?: string | null
          id?: string
          is_major?: boolean
          latitude: number
          longitude: number
          name: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          iata_code?: string
          icao_code?: string | null
          id?: string
          is_major?: boolean
          latitude?: number
          longitude?: number
          name?: string
        }
        Relationships: []
      }
      early_access_signups: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      flight_routes: {
        Row: {
          created_at: string
          destination_airport: string
          id: string
          is_popular: boolean
          last_searched_at: string | null
          origin_airport: string
          route_name: string
          search_count: number
        }
        Insert: {
          created_at?: string
          destination_airport: string
          id?: string
          is_popular?: boolean
          last_searched_at?: string | null
          origin_airport: string
          route_name: string
          search_count?: number
        }
        Update: {
          created_at?: string
          destination_airport?: string
          id?: string
          is_popular?: boolean
          last_searched_at?: string | null
          origin_airport?: string
          route_name?: string
          search_count?: number
        }
        Relationships: []
      }
      flight_searches: {
        Row: {
          api_response: Json | null
          cabin_class: string
          created_at: string
          departure_date: string
          destination_airport: string
          id: string
          origin_airport: string
          passengers: number
          return_date: string | null
          search_parameters: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_response?: Json | null
          cabin_class?: string
          created_at?: string
          departure_date: string
          destination_airport: string
          id?: string
          origin_airport: string
          passengers?: number
          return_date?: string | null
          search_parameters: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_response?: Json | null
          cabin_class?: string
          created_at?: string
          departure_date?: string
          destination_airport?: string
          id?: string
          origin_airport?: string
          passengers?: number
          return_date?: string | null
          search_parameters?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      frequent_flyer_programs: {
        Row: {
          code: string
          created_at: string
          id: string
          logo_url: string | null
          name: string
          partner_programs: string[] | null
          status_levels: string[]
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          partner_programs?: string[] | null
          status_levels?: string[]
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          partner_programs?: string[] | null
          status_levels?: string[]
        }
        Relationships: []
      }
      points_wallets: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          points_balance: number
          program_id: string
          status_level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          points_balance?: number
          program_id: string
          status_level?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          points_balance?: number
          program_id?: string
          status_level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_wallets_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "frequent_flyer_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      popular_destinations: {
        Row: {
          avg_points_cost: number | null
          created_at: string
          destination_airport_id: string
          id: string
          is_featured: boolean
          last_searched_at: string | null
          origin_airport_id: string
          search_count: number
        }
        Insert: {
          avg_points_cost?: number | null
          created_at?: string
          destination_airport_id: string
          id?: string
          is_featured?: boolean
          last_searched_at?: string | null
          origin_airport_id: string
          search_count?: number
        }
        Update: {
          avg_points_cost?: number | null
          created_at?: string
          destination_airport_id?: string
          id?: string
          is_featured?: boolean
          last_searched_at?: string | null
          origin_airport_id?: string
          search_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "popular_destinations_destination_airport_id_fkey"
            columns: ["destination_airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "popular_destinations_origin_airport_id_fkey"
            columns: ["origin_airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_home_airports: {
        Row: {
          airport_id: string
          created_at: string
          id: string
          is_primary: boolean
          user_id: string
        }
        Insert: {
          airport_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          user_id: string
        }
        Update: {
          airport_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_home_airports_airport_id_fkey"
            columns: ["airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
