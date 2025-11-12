// Database types for Supabase
// This file should be generated from your Supabase schema using: npx supabase gen types typescript
// For now, we'll define the types manually based on the documentation

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // UUID
          fullname: string;
          email: string;
          state: string;
          phone_number: string;
          city: string;
          primary_trade: string;
          shift_preference: string;
          years_of_experience: number;
          has_valid_licence: boolean;
          priority: number;
          resume_file_url: string | null;
          created_by: string; // UUID
          role: string;
          company_id: string | null; // UUID
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          fullname: string;
          email: string;
          state: string;
          phone_number: string;
          city: string;
          primary_trade: string;
          shift_preference: string;
          years_of_experience: number;
          has_valid_licence: boolean;
          priority?: number;
          resume_file_url?: string | null;
          created_by: string;
          role: string;
          company_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          fullname?: string;
          email?: string;
          state?: string;
          phone_number?: string;
          city?: string;
          primary_trade?: string;
          shift_preference?: string;
          years_of_experience?: number;
          has_valid_licence?: boolean;
          priority?: number;
          resume_file_url?: string | null;
          created_by?: string;
          role?: string;
          company_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string; // UUID
          owner_id: string; // UUID from auth.users
          name: string;
          industry: string;
          headquarters: string;
          founded: string;
          website: string | null;
          description: string | null;
          size: string | null;
          logo_url: string | null;
          specialties: string[];
          values: string[];
          benefits: string[];
          contact_email: string;
          contact_phone: string;
          contact_address: string;
          linkedin: string | null;
          twitter: string | null;
          facebook: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          industry: string;
          headquarters: string;
          founded: string;
          website?: string | null;
          description?: string | null;
          size?: string | null;
          logo_url?: string | null;
          specialties?: string[];
          values?: string[];
          benefits?: string[];
          contact_email: string;
          contact_phone: string;
          contact_address: string;
          linkedin?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          industry?: string;
          headquarters?: string;
          founded?: string;
          website?: string | null;
          description?: string | null;
          size?: string | null;
          logo_url?: string | null;
          specialties?: string[];
          values?: string[];
          benefits?: string[];
          contact_email?: string;
          contact_phone?: string;
          contact_address?: string;
          linkedin?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserProfileInsert =
  Database["public"]["Tables"]["profiles"]["Insert"];
export type UserProfileUpdate =
  Database["public"]["Tables"]["profiles"]["Update"];

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
export type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];
