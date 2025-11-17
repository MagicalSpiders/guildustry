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
          members_count: number;
          ownerprofile: string | null; // UUID
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
          members_count?: number;
          ownerprofile?: string | null;
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
          members_count?: number;
          ownerprofile?: string | null;
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
          status: string | null; // 'open' | 'closed' | null
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
      notifications: {
        Row: {
          id: string; // UUID
          user_id: string; // UUID
          type: string; // 'system_alert' | 'job_update' | 'application_status' | 'interview_reminder' | 'company_news'
          title: string;
          message: string;
          read: boolean;
          metadata?: Json | null;
          created_at: string; // TIMESTAMPTZ
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      interviews: {
        Row: {
          id: string; // UUID
          application_id: string; // UUID
          interview_date: string; // TIMESTAMPTZ
          status: string; // 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          type: string; // 'phone' | 'in-person' | 'video'
          notes?: string | null;
          location?: string | null;
          interviewers?: string[] | null; // Array of user IDs
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          interview_date: string;
          status?: string;
          type: string;
          notes?: string | null;
          location?: string | null;
          interviewers?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          interview_date?: string;
          status?: string;
          type?: string;
          notes?: string | null;
          location?: string | null;
          interviewers?: string[] | null;
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
      interview_status: "scheduled" | "completed" | "cancelled" | "rescheduled";
      interview_type: "phone" | "in-person" | "video";
      notification_type:
        | "system_alert"
        | "job_update"
        | "application_status"
        | "interview_reminder"
        | "company_news";
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

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationInsert =
  Database["public"]["Tables"]["notifications"]["Insert"];
export type NotificationUpdate =
  Database["public"]["Tables"]["notifications"]["Update"];

export type Interview = Database["public"]["Tables"]["interviews"]["Row"];
export type InterviewInsert =
  Database["public"]["Tables"]["interviews"]["Insert"];
export type InterviewUpdate =
  Database["public"]["Tables"]["interviews"]["Update"];

// Enum types
export type InterviewStatus = Database["public"]["Enums"]["interview_status"];
export type InterviewType = Database["public"]["Enums"]["interview_type"];
export type NotificationType = Database["public"]["Enums"]["notification_type"];
