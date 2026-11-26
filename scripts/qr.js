// Gera o QR Code que aponta para o site publicado.
// Uso: npm run qr            (usa a URL padrão abaixo)
//      npm run qr -- <url>   (usa outra URL)
import { mkdirSync } from 'node:fs'
import QRCode from 'qrcode'

const url = process.argv[2] ?? 'https://parabens-malu.vercel.app'
const opts = { errorCorrectionLevel: 'H', margin: 2 }

mkdirSync('qr', { recursive: true })
await QRCode.toFile('qr/qr-code.png', url, { ...opts, width: 1200 })
await QRCode.toFile('qr/qr-code.svg', url, { ...opts, type: 'svg' })

console.log(`QR Code gerado em qr/ para: ${url}`)
