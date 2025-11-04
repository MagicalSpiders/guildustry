import { z } from "zod";

export const personalSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

export const tradeSchema = z.object({
  primaryTrade: z.string().min(1, "Select your primary trade"),
  yearsExperience: z.coerce
    .number()
    .min(0)
    .max(60)
    .or(z.string().regex(/^\d+$/).transform((v) => Number(v))),
  hasLicense: z.boolean().optional(),
  shiftPreference: z.enum(["day", "night", "any"]).default("any"),
});

export const resumeSchema = z.object({
  resumeFileName: z.string().optional(),
});

export const assessmentSchema = z.object({
  q1: z.enum(["safety", "speed", "cost"]).optional(),
  q2: z.enum(["cylinder", "sphere", "torus"]).optional(),
});

export const profileSchema = personalSchema
  .and(tradeSchema)
  .and(resumeSchema)
  .and(assessmentSchema);

export type ProfileFormValues = z.infer<typeof profileSchema>;


