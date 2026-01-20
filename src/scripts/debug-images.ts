import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Load .env from project root
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const envPath = path.resolve(dirname, '../../.env')

console.log('Loading .env from:', envPath)
if (fs.existsSync(envPath)) {
  console.log('.env file found.')
  const result = config({ path: envPath })
  if (result.parsed) {
    console.log('Keys in .env:', Object.keys(result.parsed))
  }
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('PAYLOAD_SECRET is missing in process.env. Cannot continue.')
  process.exit(1)
}

// Dynamic import to handle ESM hoisting
// We need env vars loaded BEFORE payload config is imported
async function debugImages() {
  console.log('Importing Payload and Config...')
  const { getPayload } = await import('payload')
  const { default: payloadConfig } = await import('../payload.config')

  console.log('Starting Payload initialization...')
  try {
    const payload = await getPayload({ config: payloadConfig })

    const projects = await payload.find({
      collection: 'projects',
      limit: 3,
    })

    console.log('--- Projects (First 3) ---')
    projects.docs.forEach((p) => {
      console.log(`Project: ${p.title}`)
      console.log('Thumbnail:', JSON.stringify(p.thumbnail, null, 2))
    })

    const posts = await payload.find({
      collection: 'posts',
      limit: 3,
    })

    console.log('--- Posts (First 3) ---')
    posts.docs.forEach((p) => {
      console.log(`Post: ${p.title}`)
      console.log('Thumbnail:', JSON.stringify(p.thumbnail, null, 2))
    })
  } catch (error) {
    console.error('Error in debug script:', error)
  }

  process.exit(0)
}

debugImages()
