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
      assemblies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          last_maintenance: string | null
          location: string | null
          name: string
          next_maintenance: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_maintenance?: string | null
          location?: string | null
          name: string
          next_maintenance?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_maintenance?: string | null
          location?: string | null
          name?: string
          next_maintenance?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      assembly_components: {
        Row: {
          assembly_id: string
          component_id: string
        }
        Insert: {
          assembly_id: string
          component_id: string
        }
        Update: {
          assembly_id?: string
          component_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assembly_components_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assembly_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_types: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          asset_type_id: string
          created_at: string | null
          division: string | null
          hostname: string | null
          id: string
          inventory_number: string | null
          os: string | null
          user_id: string | null
          windows_license: string | null
        }
        Insert: {
          asset_type_id: string
          created_at?: string | null
          division?: string | null
          hostname?: string | null
          id?: string
          inventory_number?: string | null
          os?: string | null
          user_id?: string | null
          windows_license?: string | null
        }
        Update: {
          asset_type_id?: string
          created_at?: string | null
          division?: string | null
          hostname?: string | null
          id?: string
          inventory_number?: string | null
          os?: string | null
          user_id?: string | null
          windows_license?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_asset_type_id_fkey"
            columns: ["asset_type_id"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      component_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      components: {
        Row: {
          asset_id: string | null
          brand_id: string
          created_at: string | null
          id: string
          serial_number: string | null
          type_id: string
        }
        Insert: {
          asset_id?: string | null
          brand_id: string
          created_at?: string | null
          id?: string
          serial_number?: string | null
          type_id: string
        }
        Update: {
          asset_id?: string | null
          brand_id?: string
          created_at?: string | null
          id?: string
          serial_number?: string | null
          type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "components_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "component_types"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      it_assets_asset_components: {
        Row: {
          asset_id: string
          component_id: string
        }
        Insert: {
          asset_id: string
          component_id: string
        }
        Update: {
          asset_id?: string
          component_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "it_assets_asset_components_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "it_assets_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "it_assets_asset_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "it_assets_components"
            referencedColumns: ["id"]
          },
        ]
      }
      it_assets_assets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          division: string | null
          id: string
          last_maintenance: string | null
          name: string
          notes: string | null
          purchase_date: string | null
          status: string
          type: string
          updated_at: string
          warranty_expires: string | null
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string
          division?: string | null
          id?: string
          last_maintenance?: string | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          status: string
          type: string
          updated_at?: string
          warranty_expires?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          division?: string | null
          id?: string
          last_maintenance?: string | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          status?: string
          type?: string
          updated_at?: string
          warranty_expires?: string | null
        }
        Relationships: []
      }
      it_assets_categories: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          name: string
          parent_category: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_category?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "it_assets_categories_parent_category_fkey"
            columns: ["parent_category"]
            isOneToOne: false
            referencedRelation: "it_assets_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      it_assets_components: {
        Row: {
          created_at: string
          id: string
          manufacturer: string
          model: string
          name: string
          notes: string | null
          purchase_date: string | null
          serial_number: string | null
          type: string
          warranty_expires: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          manufacturer: string
          model: string
          name: string
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          type: string
          warranty_expires?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          manufacturer?: string
          model?: string
          name?: string
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          type?: string
          warranty_expires?: string | null
        }
        Relationships: []
      }
      it_assets_divisions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          manager: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          manager?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          manager?: string | null
          name?: string
        }
        Relationships: []
      }
      it_assets_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      maintenance_tasks: {
        Row: {
          assembly_id: string | null
          asset_id: string | null
          assigned_to: string | null
          created_at: string | null
          description: string | null
          id: string
          next_occurrence: string | null
          priority: string
          recurring: boolean | null
          scheduled_date: string
          status: string
          task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assembly_id?: string | null
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          next_occurrence?: string | null
          priority: string
          recurring?: boolean | null
          scheduled_date: string
          status: string
          task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assembly_id?: string | null
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          next_occurrence?: string | null
          priority?: string
          recurring?: boolean | null
          scheduled_date?: string
          status?: string
          task_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_asset_code: {
        Args: { p_type: string; p_department_id: string }
        Returns: string
      }
      month_to_roman: {
        Args: { month: number }
        Returns: string
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
