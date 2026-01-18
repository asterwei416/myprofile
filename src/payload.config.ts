import { mongooseAdapter } from '@payloadcms/db-mongodb'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  UploadFeature,
  BlockquoteFeature,
  AlignFeature,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Categories } from './collections/Categories'
import { Projects } from './collections/Projects'
import { Posts } from './collections/Posts'

// 自訂 Lexical Features
import { ClearFormattingFeature } from './features/ClearFormatting/feature.server'
import { ListStartNumberFeature } from './features/ListStartNumber/feature.server'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Wei Aster Portfolio',
    },
  },
  collections: [Users, Media, Tags, Categories, Projects, Posts],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // 固定工具列 - 提供更好的編輯體驗
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      // 標題階層 (H1-H6) - 控制文字大小與結構
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
      // 圖片上傳 - 關聯至 media collection
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'caption',
                type: 'text',
                label: '圖片說明',
              },
            ],
          },
        },
      }),
      // 引用區塊
      BlockquoteFeature(),
      // 對齊功能 (左/中/右/兩端)
      AlignFeature(),
      // 清除格式 - 自訂功能
      ClearFormattingFeature(),
      // 列表起始編號 - 自訂功能
      ListStartNumberFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
