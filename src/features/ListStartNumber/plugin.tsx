'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isListNode, ListNode } from '@lexical/list'
import { $getSelection, $isRangeSelection } from 'lexical'
import { $getNearestNodeOfType } from '@lexical/utils'

export function ListStartNumberPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext()
  const [showModal, setShowModal] = useState(false)
  const [startNumber, setStartNumber] = useState(1)

  const updateListStart = useCallback(
    (number: number) => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode()
          const listNode = $getNearestNodeOfType(anchorNode, ListNode)

          if (listNode && $isListNode(listNode) && listNode.getListType() === 'number') {
            listNode.setStart(number)
          }
        }
      })
      setShowModal(false)
    },
    [editor],
  )

  // 監聽右鍵選單或快捷鍵來開啟設定
  useEffect(() => {
    const handleContextMenu = (_event: MouseEvent) => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode()
          const listNode = $getNearestNodeOfType(anchorNode, ListNode)

          if (listNode && $isListNode(listNode) && listNode.getListType() === 'number') {
            // 在 ordered list 中右鍵時，阻止預設選單
            // 這裡可以添加自訂選單邏輯
          }
        }
      })
    }

    const rootElement = editor.getRootElement()
    if (rootElement) {
      rootElement.addEventListener('contextmenu', handleContextMenu)
    }

    return () => {
      if (rootElement) {
        rootElement.removeEventListener('contextmenu', handleContextMenu)
      }
    }
  }, [editor])

  // 這個 Plugin 主要是確保 ListNode 的 start 屬性可以被正確序列化和反序列化
  // Lexical 的 ListNode 已經支援 start 屬性，我們只需要確保它被正確處理

  if (!showModal) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: 10000,
      }}
    >
      <h3 style={{ margin: '0 0 15px 0' }}>設定列表起始編號</h3>
      <input
        type="number"
        min="1"
        value={startNumber}
        onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '15px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowModal(false)}
          style={{
            padding: '8px 16px',
            background: '#eee',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          取消
        </button>
        <button
          onClick={() => updateListStart(startNumber)}
          style={{
            padding: '8px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          確定
        </button>
      </div>
    </div>
  )
}
