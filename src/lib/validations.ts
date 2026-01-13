import { z } from 'zod'

// Auth schemas
export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Onboarding schemas
export const householdSizeSchema = z.object({
  planType: z.enum(['small', 'medium', 'large']),
})

export const frequencySchema = z.object({
  frequency: z.enum(['biweekly', 'weekly', 'twice_weekly']),
})

export const customizeSchema = z.object({
  planType: z.enum(['small', 'medium', 'large']),
  frequency: z.enum(['biweekly', 'weekly', 'twice_weekly']),
  bagCount: z.number().min(1).max(10),
})

export const pickupDaySchema = z.object({
  pickupDay1: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
  pickupDay2: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']).optional(),
  pickupWindowStart: z.string(),
  pickupWindowEnd: z.string(),
})

export const checkoutSchema = z.object({
  addressStreet: z.string().min(1, 'Street address is required'),
  addressCity: z.string().min(1, 'City is required'),
  addressState: z.string().min(1, 'State is required'),
  addressZip: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit zip code'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
})

// Zip code check
export const zipCheckSchema = z.object({
  zipCode: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit zip code'),
})

// Waitlist
export const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  zipCode: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit zip code'),
})

// Account update
export const accountUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  addressStreet: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressZip: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit zip code').optional(),
})

// Support ticket
export const supportTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// Provider application
export const providerApplicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  addressStreet: z.string().min(1, 'Street address is required'),
  addressCity: z.string().min(1, 'City is required'),
  addressState: z.string().min(1, 'State is required'),
  addressZip: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit zip code'),
  hasTransportation: z.boolean().refine(val => val === true, 'Reliable transportation is required'),
  hasWasherDryer: z.boolean().refine(val => val === true, 'Washer and dryer are required'),
  hoursPerWeek: z.number().min(5, 'Minimum 5 hours per week required').max(40),
  interestStatement: z.string().optional(),
})

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type HouseholdSizeInput = z.infer<typeof householdSizeSchema>
export type FrequencyInput = z.infer<typeof frequencySchema>
export type CustomizeInput = z.infer<typeof customizeSchema>
export type PickupDayInput = z.infer<typeof pickupDaySchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ZipCheckInput = z.infer<typeof zipCheckSchema>
export type WaitlistInput = z.infer<typeof waitlistSchema>
export type AccountUpdateInput = z.infer<typeof accountUpdateSchema>
export type SupportTicketInput = z.infer<typeof supportTicketSchema>
export type ProviderApplicationInput = z.infer<typeof providerApplicationSchema>
