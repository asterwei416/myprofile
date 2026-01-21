import React from 'react'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical'
import { SerializedUploadNode } from '@payloadcms/richtext-lexical'
import { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { CloudinaryImage } from '@/components/CloudinaryImage'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedUploadNode
  | SerializedBlockNode
  | SerializedInlineBlockNode

export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const uploadNode = node as SerializedUploadNode
    const doc = uploadNode.value

    // 檢查是否為有效的媒體檔案
    if (!doc || typeof doc === 'string' || !doc.url) {
      return null // 或者回傳預設的 empty state
    }

    // 只針對圖片進行優化，其他媒體類型 (如 PDF) 使用預設或 fallback
    const isImage = doc.mimeType?.startsWith('image/')

    if (isImage) {
      return (
        <div className="my-8 w-full">
          <CloudinaryImage
            src={doc.url}
            alt={doc.alt || ''}
            fill={false} // RichText 中的圖片通常是被容器限制寬度的，不一定是絕對定位 fill
            width={doc.width || 800} // 使用原始尺寸或預設
            height={doc.height || 600}
            priority={false} // 內文圖片通常不需要 priority (除非是第一張，但這裡很難判斷)
            sizes="(max-width: 768px) 100vw, 800px" // 假設文章寬度最大約 800px
            className="rounded-lg" // 可以加一點圓角
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          {/* 如果有 caption，可以顯示在這裡 (需檢查 fields) */}
          {(uploadNode.fields as any)?.caption && (
            <div className="mt-2 text-center text-sm text-gray-500">
              {(uploadNode.fields as any).caption}
            </div>
          )}
        </div>
      )
    }

    // 非圖片類型，回傳預設處理 (或不做處理)
    return defaultConverters.upload({ node })
  },
})
