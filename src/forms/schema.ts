import { z } from 'zod'

export const strengthSchema = z.object({
  hasNumber: z.boolean(),
  hasUpper: z.boolean(),
  hasLower: z.boolean(),
  hasSpecial: z.boolean()
})

export const formSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    age: z.number().int().min(0, 'Age must be >= 0'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Min 8 characters'),
    confirm: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    genderOther: z.string().optional(),
    accept: z.literal(true, { errorMap: () => ({ message: 'You must accept' }) }),
    imageBase64: z.string().optional(),
    country: z.string().trim().min(1, 'Country is required'),
    strength: strengthSchema
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm) {
      ctx.addIssue({
        path: ['confirm'],
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match'
      })
    }
    if (data.gender === 'other' && !(data.genderOther && data.genderOther.trim())) {
      ctx.addIssue({
        path: ['genderOther'],
        code: z.ZodIssueCode.custom,
        message: 'Please specify'
      })
    }
  })

export type FormData = z.infer<typeof formSchema>
