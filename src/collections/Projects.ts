import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: '作品',
    plural: '作品集',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status'],
    group: '網站內容',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // 當狀態改為「已發布」且沒有發布日期時，自動填入今天
        if (data?.status === 'published' && !data?.date) {
          data.date = new Date().toISOString()
        }

        // 自動同步縮圖到 SEO OG Image (若 OG Image 未設定)
        if (data?.thumbnail && !data?.seo?.ogImage) {
          if (!data.seo) data.seo = {}
          data.seo.ogImage = data.thumbnail
        }

        return data
      },
    ],
  },
  fields: [
    // ===== 基本資訊 =====
    {
      name: 'title',
      label: '標題',
      type: 'text',
      required: true,
      admin: {
        placeholder: '輸入標題...',
        style: {
          fontSize: '1.5rem',
          fontWeight: 'bold',
        },
      },
    },
    {
      name: 'slug',
      label: '網址代稱',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        components: {
          Field: '@/components/SlugField',
        },
      },
    },
    {
      name: 'date',
      label: '發布日期',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy/MM/dd',
        },
      },
    },
    {
      name: 'status',
      label: '發布狀態',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已發布', value: 'published' },
      ],
    },
    // ===== 作品內容 =====
    {
      name: 'content',
      label: '作品內容',
      type: 'richText',
      required: true,
      admin: {
        description: '使用編輯器自由創建內容：技術棧、開發思維、架構說明、圖片等',
      },
    },
    {
      name: 'summary',
      label: '重點摘要 (TL;DR)',
      type: 'textarea',
      required: false,
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/SummaryField',
        },
      },
    },
    {
      name: 'aiQA',
      label: 'AI 讀心問答',
      type: 'array',
      admin: {
        components: {
          Field: '@/components/AIQuestionField',
        },
      },
      fields: [
        {
          name: 'question',
          label: '問題',
          type: 'text',
        },
        {
          name: 'answer',
          label: '解答',
          type: 'textarea',
        },
      ],
    },
    // ===== 縮圖 (右側邊欄) =====
    // ===== 縮圖 (右側邊欄) =====
    {
      name: 'thumbnailGenerator',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/ThumbnailGenerator',
        },
      },
    },
    {
      name: 'thumbnail',
      label: '縮圖',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: '作品列表顯示的縮圖，建議尺寸 1200x630px',
      },
    },
    // ===== 分類與標籤 (右側邊欄) =====
    {
      name: 'category',
      label: '分類',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        allowCreate: true,
        position: 'sidebar',
        description: '選擇主要分類（如 n8n、GEM）',
      },
    },
    {
      name: 'tags',
      label: '標籤',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        allowCreate: true,
        position: 'sidebar',
        components: {
          Field: '@/components/TagsField',
        },
      },
    },
    // ===== SEO 設定 (右側邊欄) =====
    {
      name: 'seo',
      label: 'SEO 設定',
      type: 'group',
      admin: {
        position: 'sidebar',
        description: '搜尋引擎最佳化設定',
      },
      fields: [
        {
          name: 'metaTitle',
          label: 'Meta Title',
          type: 'text',
          admin: {
            components: {
              Field: '@/components/MetaTitleField',
            },
          },
        },
        {
          name: 'metaDescription',
          label: 'Meta Description',
          type: 'textarea',
          admin: {
            components: {
              Field: '@/components/MetaDescriptionField',
            },
          },
        },
        {
          name: 'ogImage',
          label: '社群分享圖片 (OG Image)',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: '建議尺寸 1200x630px，用於 Facebook、Twitter 等社群分享',
          },
        },
        {
          name: 'canonicalUrl',
          label: 'Canonical URL',
          type: 'text',
          admin: {
            description: '指定內容的權威網址 (留空則自動生成)',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'noIndex',
              label: '禁止索引 (noindex)',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '勾選後搜尋引擎不會索引此頁面',
                width: '50%',
              },
            },
            {
              name: 'noFollow',
              label: '禁止跟蹤連結 (nofollow)',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '勾選後搜尋引擎不會跟蹤此頁面的連結',
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
}
