---
description: 為 Next.js + Payload CMS 實作進階 SEO 與 GEO (生成式引擎優化) 架構。
---

# SEO & GEO 最佳化套件 (SEO & GEO Optimization Skill)

## 🎯 目的 (Purpose)

本套件旨在為您的 Web 應用程式提供 **生成式引擎優化 (Generative Engine Optimization, GEO)** 能力，並同時兼顧穩健的標準 SEO。採用模組化設計，您可以自由選擇需要的基礎 SEO 工具、圖片最佳化或進階的 AI 內容增強功能。

## 📦 功能特色 (Features)

### 🟢 核心 SEO (基礎必備)

適用於絕大多數網站的標準 SEO 最佳化。

1.  **Meta 管理**：`MetaTitleField`, `MetaDescriptionField` (內建長度與像素寬度驗證)。
2.  **智慧網址**：`SlugField` (自動生成乾淨網址)。
3.  **結構化資料**：基礎 JSON-LD 設定。

### 🟡 圖片最佳化 (效能 Performance)

針對 Core Web Vitals (LCP/CLS) 與圖片 SEO 的最佳實踐。

1.  **前端**：`CloudinaryImage` (自動 WebP/AVIF 格式、LQIP 模糊預載、CLS 防護、正確的 Alt 文字渲染)。
2.  **後端**：`ThumbnailGenerator` (AI 自動生成風格一致的封面縮圖)。

### 🟣 進階 GEO (生成式優化 - 選配)

針對 AI 搜尋引擎 (ChatGPT, Perplexity, Gemini) 的語意增強模組。

1.  **AI 重點摘要 (TL;DR)**：`SummaryField` (自動生成關鍵重點，利於 AI 快速讀取)。
2.  **AI 讀心問答 (Insight Q&A)**：`AIQuestionField` + `QAAccordion` (提供深度語境，增加被 Answer Engines 引用的機會)。

## 🛠️ 安裝與使用 (Installation & Usage)

### 1. 複製元件 (Component)

請從 `resources/components` 複製到您專案的 `src/components`：

**核心 SEO (Core SEO):**

- `MetaTitleField`
- `MetaDescriptionField`
- `SlugField`

**圖片最佳化 (Image SEO):**

- `CloudinaryImage` (前端用)
- `ThumbnailGenerator` (後端用)

**進階 GEO (Advanced GEO):**

- `SummaryField`
- `AIQuestionField`
- `QAAccordion` (前端顯示 UI)

### 2. 複製工具函式 (Utilities - 圖片最佳化必備)

- `resources/utils/cloudinaryLoader.ts` -> `src/utils/cloudinaryLoader.ts`

### 3. 設定 API路由 (API Routes)

從 `resources/api` 複製對應的路由檔案：

- **Core**: `generate-meta-title`, `generate-meta-description`, `generate-slug`
- **Image**: `generate-thumbnail`
- **GEO**: `generate-summary`, `generate-ai-qa`

(請複製到 `src/app/api/.../route.ts`)

> **注意**: 請確保您的 `.env` 檔案中已設定 `GEMINI_API_KEY`。

### 4. 設定集合 (Configure Collections)

在您的 Payload Collection 設定檔中 (例如 `Posts.ts`) 引入：

```typescript
// 引入元件
import ThumbnailGenerator from '@/components/ThumbnailGenerator'
import CloudinaryImage from '@/components/CloudinaryImage' // 若需自訂 Admin View
// ... 其他 SEO/GEO 元件

fields: [
  // ... 其他欄位 ...

  // --- 圖片 SEO 欄位 (Image SEO) ---
  {
    name: 'thumbnailGenerator',
    type: 'ui',
    admin: { position: 'sidebar', components: { Field: '@/components/ThumbnailGenerator' } },
  },
  {
    name: 'thumbnail',
    type: 'upload',
    relationTo: 'media',
    admin: { position: 'sidebar', description: 'Alt Text (替代文字) 對 SEO 至關重要。' },
  },

  // ... 核心 SEO 與 GEO 欄位 (請參考原始碼範例) ...
]
```

### 5. 前端渲染 (Frontend Rendering)

**圖片渲染 (對 LCP/CLS 至關重要):**

```tsx
import { CloudinaryImage } from '@/components/CloudinaryImage'
;<CloudinaryImage
  src={data.url}
  alt={data.alt || '請務必填寫描述性 Alt 文字'}
  width={800}
  height={600}
  priority={index === 0} // 第一張圖 (Hero Image) 設為 true 以提升 LCP
/>
```

**GEO 問答渲染:**

```tsx
import { QAAccordion } from '@/components/QAAccordion'

{
  post.aiQA?.length > 0 && <QAAccordion items={post.aiQA} />
}
```

## 🧠 核心邏輯 (Core Logic)

- **洞察優先 (Insight-First)**：AI Prompt 經調教為「資深技術顧問」人設，提供具深度的回答。
- **語意結構 (Semantic Structure)**：使用 `FAQPage` Schema 為 AI 與 Google 提供結構化資料。
- **效能優先**：圖片元件內建防抖動 (CLS) 與次世代格式支援。
