import { getPayload } from 'payload'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
process.env.PAYLOAD_SKIP_DEPENDENCY_CHECK = 'true'

async function run() {
  try {
    const config = (await import('../src/payload.config')).default
    const payload = await getPayload({ config })

    console.log('Fetching Published Posts...')
    const posts = await payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
      },
      limit: 100,
    })

    console.log(`Found ${posts.docs.length} published posts.`)
    posts.docs.forEach((p) => {
      console.log(`- [${p.status}] ${p.title} (PublishedAt: ${p.publishedAt})`)
    })

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

run()
