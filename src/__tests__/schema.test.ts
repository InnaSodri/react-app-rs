import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { formSchema } from '../forms/schema'

type FormData = z.infer<typeof formSchema>

const base: FormData = {
  name: 'Alice',
  age: 22,
  email: 'a@a.com',
  password: 'A1a!xxxx',
  confirm: 'A1a!xxxx',
  gender: 'male',
  accept: true,
  imageBase64: undefined,
  country: 'Israel',
  strength: { hasLower: true, hasUpper: true, hasNumber: true, hasSpecial: true }
}

describe('formSchema', () => {
  it('rejects when passwords do not match', () => {
    const r = formSchema.safeParse({ ...base, confirm: 'mismatch' })
    expect(r.success).toBe(false)
    if (!r.success) {
      const issues = r.error.issues
      expect(issues.some(i => i.path.join('.') === 'confirm')).toBe(true)
    }
  })

  it('requires genderOther when gender is other', () => {
    const r = formSchema.safeParse({ ...base, gender: 'other', genderOther: '' })
    expect(r.success).toBe(false)
    if (!r.success) {
      const issues = r.error.issues
      expect(issues.some(i => i.path.join('.') === 'genderOther')).toBe(true)
    }
  })

  it('passes with valid genderOther for gender other', () => {
    const r = formSchema.safeParse({ ...base, gender: 'other', genderOther: 'Non-binary' })
    expect(r.success).toBe(true)
  })
})
