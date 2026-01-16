import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'AI 作品',
    plural: 'AI 作品集',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status'],
    group: '內容管理',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ===== 基本資訊 =====
    {
      name: 'title',
      label: '作品標題',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: '網址代稱',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: '用於 URL，例如 "ai-chatbot-project"',
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
    {
      name: 'thumbnail',
      label: '縮圖',
      type: 'upload',
      relationTo: 'media',
    },
    // ===== 技術棧 =====
    {
      name: 'techStack',
      label: '技術棧',
      type: 'array',
      admin: {
        description: '使用的技術、框架、工具等',
      },
      fields: [
        {
          name: 'name',
          label: '技術名稱',
          type: 'text',
          required: true,
        },
      ],
    },
    // ===== Prompt 提示詞區塊 =====
    {
      name: 'promptLogic',
      label: 'Prompt 提示詞邏輯',
      type: 'code',
      admin: {
        language: 'markdown',
        description: '記錄 AI 專案使用的核心 Prompt 邏輯',
      },
    },
    // ===== 開發思維 =====
    {
      name: 'devThinking',
      label: '開發思維',
      type: 'richText',
      admin: {
        description: '記錄開發過程中的思考、決策與心得',
      },
    },
    // ===== 技術架構拆解 =====
    {
      name: 'architecture',
      label: '技術架構拆解',
      type: 'richText',
      admin: {
        description: '詳細說明專案的技術架構與設計',
      },
    },
    // ===== 外部連結 =====
    {
      name: 'externalLinks',
      label: '外部連結',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: '連結文字',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: '網址',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          label: '圖示',
          type: 'select',
          options: [
            { label: 'GitHub', value: 'github' },
            { label: '外部連結', value: 'external-link' },
            { label: '影片', value: 'video' },
            { label: '文件', value: 'file-text' },
          ],
        },
      ],
    },
    // ===== 標籤（用於雙向關聯） =====
    {
      name: 'tags',
      label: '標籤',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: '選擇相關標籤，系統會自動關聯同標籤的文章',
      },
    },
  ],
}
