export function getPasswordStrength(p: string) {
    return {
      hasNumber: /\d/.test(p),
      hasUpper: /[A-Z]/.test(p),
      hasLower: /[a-z]/.test(p),
      hasSpecial: /[^A-Za-z0-9]/.test(p)
    }
  }
  