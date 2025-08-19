export function isValidImage(file: File) {
    const okType = ['image/png','image/jpeg'].includes(file.type)
    const okSize = file.size <= 2 * 1024 * 1024
    return okType && okSize
  }
  export function toBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(String(r.result))
      r.onerror = () => reject(r.error)
      r.readAsDataURL(file)
    })
  }
  