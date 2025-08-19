import { it, expect } from 'vitest'
import { toBase64 } from '../forms/image'

it('converts file to base64', async () => {
  const dataUrl = 'data:image/png;base64,AAA'
  const realCtor = (globalThis as unknown as { FileReader: new () => FileReader }).FileReader

  class MockFileReader {
    result: string | ArrayBuffer | null = null
    onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null
    onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null
    readAsDataURL(blob: Blob): void {
      void blob
      this.result = dataUrl
      const ev = new ProgressEvent('load') as ProgressEvent<FileReader>
      this.onload?.call(this as unknown as FileReader, ev)
    }
  }

  ;(globalThis as unknown as { FileReader: new () => FileReader }).FileReader =
    MockFileReader as unknown as new () => FileReader

  const file = new File([new Uint8Array([1, 2, 3])], 'a.png', { type: 'image/png' })
  const res = await toBase64(file)
  expect(res).toBe(dataUrl)

  ;(globalThis as unknown as { FileReader: new () => FileReader }).FileReader = realCtor
})
