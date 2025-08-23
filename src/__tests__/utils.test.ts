import { it, expect } from 'vitest'
import { getPasswordStrength } from '../forms/password'
import { isValidImage } from '../forms/image'

class F extends File {
  constructor(size: number, type: string) {
    super([new Uint8Array(size)], 'x', { type })
  }
}

it('password strength rules', () => {
  const s = getPasswordStrength('A1a!xxxx')
  expect(Object.values(s).every(Boolean)).toBe(true)
})

it('image validation', () => {
  expect(isValidImage(new F(1000, 'image/png'))).toBe(true)
  expect(isValidImage(new F(3 * 1024 * 1024, 'image/png'))).toBe(false)
  expect(isValidImage(new F(1000, 'image/gif'))).toBe(false)
})
