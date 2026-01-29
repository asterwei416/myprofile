import { mongooseAdapter } from '@payloadcms/db-mongodb'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  UploadFeature,
  BlockquoteFeature,
  AlignFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

// Cloudinary Storage
import { cloudinaryStorage } from '@pemol/payload-cloudinary'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Categories } from './collections/Categories'
import { Projects } from './collections/Projects'
import { Posts } from './collections/Posts'

// Globals
import { AdSettings } from './globals/AdSettings'

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
  globals: [AdSettings],
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
      // 連結功能
      LinkFeature({
        fields: [
          {
            name: 'url',
            label: '連結網址',
            type: 'text',
            required: true,
            admin: {
              placeholder: 'https://example.com',
            },
          },
          {
            name: 'rel',
            label: 'Rel 屬性（SEO 與安全性設定）',
            type: 'select',
            hasMany: true,
            defaultValue: ['noopener', 'noreferrer'],
            options: [
              {
                label: 'noopener - 安全性（建議外部連結使用）',
                value: 'noopener',
              },
              {
                label: 'noreferrer - 隱私保護（不傳送來源資訊）',
                value: 'noreferrer',
              },
              {
                label: 'nofollow - SEO（告訴搜尋引擎不追蹤此連結）',
                value: 'nofollow',
              },
            ],
            admin: {
              description:
                '💡 預設已選「noopener + noreferrer」提升安全性；如為廣告或不信任連結可再加上「nofollow」避免影響 SEO',
            },
          },
        ],
      }),
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
  // Sharp disabled for Docker compatibility
  plugins: [
    // Cloudinary 雲端媒體儲存
    cloudinaryStorage({
      collections: {
        media: true,
      },
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
      },
      folder: 'myprofile-media',
      disableLocalStorage: true,
      enabled: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    }),
  ],
})
