import { z } from "zod"

// Auth validations
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export const signupSchema = z.object({
  companyName: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
})

// Employee validations
export const employeeSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  role: z.string().min(1, "Le rôle est requis"),
  hourlyRate: z.number().min(0, "Le taux horaire doit être positif").optional(),
  maxHoursPerWeek: z.number().min(0).max(60, "Maximum 60 heures par semaine").optional(),
  availability: z
    .object({
      monday: z.array(z.string()).optional(),
      tuesday: z.array(z.string()).optional(),
      wednesday: z.array(z.string()).optional(),
      thursday: z.array(z.string()).optional(),
      friday: z.array(z.string()).optional(),
      saturday: z.array(z.string()).optional(),
      sunday: z.array(z.string()).optional(),
    })
    .optional(),
})

// Schedule validations
export const scheduleGenerateSchema = z.object({
  name: z.string().min(1, "Le nom du planning est requis"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  minHoursPerEmployee: z.number().min(0).optional(),
  maxHoursPerEmployee: z.number().min(0).optional(),
  constraints: z.string().optional(),
  respectPreferences: z.boolean().default(true),
  balanceWorkload: z.boolean().default(true),
  minimizeCosts: z.boolean().default(false),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type EmployeeInput = z.infer<typeof employeeSchema>
export type ScheduleGenerateInput = z.infer<typeof scheduleGenerateSchema>

