import { z } from "zod";

// Updated schema to match Supabase database structure (snake_case)
export const personalSchema = z.object({
  fullname: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone_number: z.string().min(7, "Enter a valid phone number"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

export const tradeSchema = z.object({
  primary_trade: z.string().min(1, "Select your primary trade"),
  years_of_experience: z.coerce
    .number()
    .min(0)
    .max(60)
    .or(z.string().regex(/^\d+$/).transform((v) => Number(v))),
  has_valid_licence: z.boolean().optional(),
  shift_preference: z.enum(["day", "night", "any"]).default("any"),
});

export const resumeSchema = z.object({
  resume_file_url: z.string().nullable().optional(),
});

export const assessmentSchema = z.object({
  q1: z.enum(["safety", "speed", "cost"]).optional(),
  q2: z.enum(["cylinder", "sphere", "torus"]).optional(),
});

// Additional fields for complete profile
export const profileMetaSchema = z.object({
  id: z.string().uuid().optional(),
  created_by: z.string().uuid().optional(),
  role: z.enum(["candidate", "employer"]).default("candidate"),
  company_id: z.string().uuid().nullable().optional(),
  priority: z.number().min(1).max(5).default(1),
});

export const profileSchema = personalSchema
  .and(tradeSchema)
  .and(resumeSchema)
  .and(assessmentSchema)
  .and(profileMetaSchema);

export type ProfileFormValues = z.infer<typeof profileSchema>;


