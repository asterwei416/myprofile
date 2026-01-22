import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://aster.dev'
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 1. 靜態頁面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // 2. 獲取所有已發布的文章
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // 3. 獲取所有已發布的作品
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })

  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...blogUrls, ...projectUrls]
}
