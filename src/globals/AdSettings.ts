import { GlobalConfig } from 'payload'

export const AdSettings: GlobalConfig = {
  slug: 'ad-settings',
  label: '全站廣告設定 (Site Ads)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'homepageFooterAd',
      label: '首頁 - 頁尾上方廣告 (Homepage Footer)',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          label: '啟用此版位',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'type',
          label: '廣告類型',
          type: 'select',
          defaultValue: 'banner',
          options: [
            { label: '圖片 Banner', value: 'banner' },
            { label: '自訂程式碼 (HTML/Script)', value: 'code' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'banner',
          label: 'Banner 設定',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled && siblingData?.type === 'banner',
          },
          fields: [
            {
              name: 'image',
              label: '圖片',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'url',
              label: '連結網址',
              type: 'text',
              required: true,
            },
            {
              name: 'openInNewTab',
              label: '在新分頁開啟',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'code',
          label: '程式碼設定',
          type: 'code',
          required: true,
          admin: {
            language: 'html',
            condition: (_, siblingData) => siblingData?.enabled && siblingData?.type === 'code',
            description: '請在此貼上 Google AdSense 或其他廣告商提供的完整程式碼',
          },
        },
      ],
    },
    {
      name: 'postFooterAd',
      label: '文章頁 - 內文結尾廣告 (Post Footer)',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          label: '啟用此版位',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'type',
          label: '廣告類型',
          type: 'select',
          defaultValue: 'banner',
          options: [
            { label: '圖片 Banner', value: 'banner' },
            { label: '自訂程式碼 (HTML/Script)', value: 'code' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'banner',
          label: 'Banner 設定',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled && siblingData?.type === 'banner',
          },
          fields: [
            {
              name: 'image',
              label: '圖片',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'url',
              label: '連結網址',
              type: 'text',
              required: true,
            },
            {
              name: 'openInNewTab',
              label: '在新分頁開啟',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'code',
          label: '程式碼設定',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled && siblingData?.type === 'code',
          },
          fields: [
            {
              name: 'content',
              label: '廣告程式碼',
              type: 'code',
              required: true,
              admin: {
                language: 'html',
                description: '請在此貼上 Google AdSense 或其他廣告商提供的完整程式碼',
              },
            },
            {
              name: 'openInNewTab',
              label: '強制在新分頁開啟所有連結',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '啟用後，程式碼中的所有連結都會自動在新分頁開啟',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'projectFooterAd',
      label: '作品集頁 - 內文結尾廣告 (Project Footer)',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          label: '啟用此版位',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'type',
          label: '廣告類型',
          type: 'select',
          defaultValue: 'banner',
          options: [
            { label: '圖片 Banner', value: 'banner' },
            { label: '自訂程式碼 (HTML/Script)', value: 'code' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'banner',
          label: 'Banner 設定',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled && siblingData?.type === 'banner',
          },
          fields: [
            {
              name: 'image',
              label: '圖片',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'url',
              label: '連結網址',
              type: 'text',
              required: true,
            },
            {
              name: 'openInNewTab',
              label: '在新分頁開啟',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'code',
          label: '程式碼設定',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled && siblingData?.type === 'code',
          },
          fields: [
            {
              name: 'content',
              label: '廣告程式碼',
              type: 'code',
              required: true,
              admin: {
                language: 'html',
                description: '請在此貼上 Google AdSense 或其他廣告商提供的完整程式碼',
              },
            },
            {
              name: 'openInNewTab',
              label: '強制在新分頁開啟所有連結',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '啟用後，程式碼中的所有連結都會自動在新分頁開啟',
              },
            },
          ],
        },
      ],
    },
  ],
}
