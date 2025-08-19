import { z } from 'zod'
export const formSchema = z.object({
  name: z.string().min(1).regex(/^[A-Z][a-zA-Z\s'-]*$/),
  age: z.coerce.number().int().min(0),
  email: z.string().email(),
  password: z.string().min(8),
  confirm: z.string(),
  gender: z.enum(['male','female','other']),
  accept: z.literal(true),
  imageBase64: z.string().optional(),
  country: z.string().min(1),
  strength: z.object({ hasNumber: z.boolean(), hasUpper: z.boolean(), hasLower: z.boolean(), hasSpecial: z.boolean() })
}).refine(d => d.password === d.confirm, { path: ['confirm'], message: 'Passwords must match' })
export type FormData = z.infer<typeof formSchema>
