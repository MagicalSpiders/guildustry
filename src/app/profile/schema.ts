import { z } from "zod";

/**
 * Zod Validation Schemas for Candidate Profile
 * Matches Supabase database structure (snake_case)
 */

// Step 1: Personal Information
export const personalSchema = z.object({
  fullname: z.string().min(2, "Please enter your full name").max(100, "Name is too long"),
  email: z.string().email("Enter a valid email address"),
  phone_number: z.string().min(7, "Enter a valid phone number").max(20, "Phone number is too long"),
  city: z.string().min(2, "City is required").max(100, "City name is too long"),
  state: z.string().min(2, "State is required").max(100, "State name is too long"),
});

// Step 2: Trade & Experience
export const tradeSchema = z.object({
  primary_trade: z.string().min(1, "Select your primary trade"),
  years_of_experience: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .max(60, "Please enter a valid number of years")
    .or(z.string().regex(/^\d+$/, "Must be a number").transform((v) => Number(v))),
  has_valid_licence: z.boolean().optional().default(false),
  shift_preference: z.enum(["day", "night", "any"]).default("any"),
});

// Step 3: Resume (Optional)
export const resumeSchema = z.object({
  resume_file_url: z.string().nullable().optional()
    .or(z.literal(""))
    .transform(val => val === "" ? null : val),
});

// Step 4: Assessment (Required)
export const assessmentSchema = z.object({
  priority_choice: z.enum(["Safety first", "Deliver on time", "Control costs"]),
  shape_choice: z.enum(["Cylinder", "Sphere", "Torus"]),
});

// Metadata fields
export const profileMetaSchema = z.object({
  id: z.string().uuid().optional(),
  created_by: z.string().uuid().optional(),
  role: z.enum(["candidate", "employer"]).default("candidate"),
  company_id: z.string().uuid().nullable().optional(),
  priority: z.number().int().min(1).max(5).default(1),
});

// Complete profile schema (all steps combined)
export const profileSchema = personalSchema
  .and(tradeSchema)
  .and(resumeSchema)
  .and(assessmentSchema)
  .and(profileMetaSchema);

// TypeScript type for form values
export type ProfileFormValues = z.infer<typeof profileSchema>;


