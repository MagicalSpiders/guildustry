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
      candidate_profile: {
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
          priority_choice: string; // 'Safety first' | 'Deliver on time' | 'Control costs'
          shape_choice: string; // 'Cylinder' | 'Sphere' | 'Torus'
          timestamp: string; // TIMESTAMPTZ
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
          priority_choice: string; // 'Safety first' | 'Deliver on time' | 'Control costs'
          shape_choice: string; // 'Cylinder' | 'Sphere' | 'Torus'
          timestamp?: string; // TIMESTAMPTZ (auto-generated if not provided)
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
          priority_choice?: string; // 'Safety first' | 'Deliver on time' | 'Control costs'
          shape_choice?: string; // 'Cylinder' | 'Sphere' | 'Torus'
          timestamp?: string; // TIMESTAMPTZ
          created_at?: string;
          updated_at?: string;
        };
      };
      // Legacy profiles table (for backward compatibility)
      profiles: {
        Row: {
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
          priority: number;
          resume_file_url: string | null;
          created_by: string;
          role: string;
          company_id: string | null;
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
      jobs: {
        Row: {
          id: string; // UUID
          title: string;
          description: string;
          location: string;
          salary_min: number;
          salary_max: number;
          job_type: string; // 'full-time' | 'part-time' | 'contract' | 'temporary'
          status: string; // 'open' | 'closed' | 'draft'
          requirements?: string | null;
          skills?: string[] | null;
          trade_specialty: string;
          posted_by: string; // UUID
          employer_id: string; // UUID
          company_id: string; // UUID
          posted_date: string; // TIMESTAMPTZ
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          location: string;
          salary_min: number;
          salary_max: number;
          job_type: string;
          status?: string;
          requirements?: string | null;
          skills?: string[] | null;
          trade_specialty: string;
          posted_by: string;
          employer_id: string;
          company_id: string;
          posted_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          location?: string;
          salary_min?: number;
          salary_max?: number;
          job_type?: string;
          status?: string;
          requirements?: string | null;
          skills?: string[] | null;
          trade_specialty?: string;
          posted_by?: string;
          employer_id?: string;
          company_id?: string;
          posted_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string; // UUID
          job_id: string; // UUID
          applicant_id: string; // UUID
          status: string; // 'pending' | 'underReview' | 'shortlisted' | 'interviewScheduled' | 'rejected'
          cover_letter?: string | null;
          resume_url?: string | null;
          submitted_at: string; // TIMESTAMPTZ
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          applicant_id: string;
          status?: string;
          cover_letter?: string | null;
          resume_url?: string | null;
          submitted_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          applicant_id?: string;
          status?: string;
          cover_letter?: string | null;
          resume_url?: string | null;
          submitted_at?: string;
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

// Use candidate_profile table (new)
export type UserProfile =
  Database["public"]["Tables"]["candidate_profile"]["Row"];
export type UserProfileInsert =
  Database["public"]["Tables"]["candidate_profile"]["Insert"];
export type UserProfileUpdate =
  Database["public"]["Tables"]["candidate_profile"]["Update"];

// Legacy types (for backward compatibility)
export type LegacyUserProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type LegacyUserProfileInsert =
  Database["public"]["Tables"]["profiles"]["Insert"];
export type LegacyUserProfileUpdate =
  Database["public"]["Tables"]["profiles"]["Update"];

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
export type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
export type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];

export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type ApplicationInsert =
  Database["public"]["Tables"]["applications"]["Insert"];
export type ApplicationUpdate =
  Database["public"]["Tables"]["applications"]["Update"];
