import { getPayload } from 'payload'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
console.log('PAYLOAD_SECRET loaded:', !!process.env.PAYLOAD_SECRET)
console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL)

async function run() {
  try {
    // Dynamic import to ensure env vars are loaded
    const config = (await import('../src/payload.config')).default

    console.log('Starting Payload...')
    const payload = await getPayload({ config })
    console.log('Payload started.')

    console.log('Fetching Global AdSettings...')
    const adSettings = await payload.findGlobal({
      slug: 'ad-settings',
    })
    console.log('AdSettings fetched:', adSettings)

    console.log('Fetching Projects...')
    const projects = await payload.find({
      collection: 'projects',
      limit: 1,
    })
    console.log('Projects fetched:', projects.docs.length)

    console.log('Fetching Posts...')
    const posts = await payload.find({
      collection: 'posts',
      limit: 1,
    })
    console.log('Posts fetched:', posts.docs.length)

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

run()
