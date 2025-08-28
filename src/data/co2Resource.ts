import type { Dataset } from './types'


function createResource<T>(fn: () => Promise<T>) {
let status: 'pending' | 'success' | 'error' = 'pending'
let value: T | undefined
let reason: unknown
const suspender = fn().then(
(v) => { status = 'success'; value = v },
(e) => { status = 'error'; reason = e }
)
return {
read(): T {
if (status === 'pending') throw suspender
if (status === 'error') throw reason
return value as T
}
}
}


const url = import.meta.env.VITE_CO2_URL || '/co2-data.json'


const fetchAndParse = async (): Promise<Dataset> => {
const res = await fetch(url)
const text = await res.text()
const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
type WorkerReply = { ok: true; data: Dataset } | { ok: false; error: string }
const parsed: Dataset = await new Promise((resolve, reject) => {
worker.onmessage = (e: MessageEvent<WorkerReply>) => {
const payload = e.data
if (payload.ok) resolve(payload.data)
else reject(new Error(payload.error || 'parse error'))
worker.terminate()
}
worker.postMessage(text)
})
return parsed
}


export const co2Resource = createResource(fetchAndParse)