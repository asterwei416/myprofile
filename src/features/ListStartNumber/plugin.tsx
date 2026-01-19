'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isListNode, ListNode } from '@lexical/list'
import { $getSelection, $isRangeSelection } from 'lexical'
import { $getNearestNodeOfType } from '@lexical/utils'

export function ListStartNumberPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext()
  const [showModal, setShowModal] = useState(false)
  const [startNumber, setStartNumber] = useState(1)
  const [activeListNode, setActiveListNode] = useState<ListNode | null>(null)
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  // 避免 SSR 問題
  useEffect(() => {
    setMounted(true)
  }, [])

  // 偵測是否在有序列表中
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const listNode = $getNearestNodeOfType(anchorNode, ListNode)

      if (listNode && $isListNode(listNode) && listNode.getListType() === 'number') {
        setActiveListNode(listNode)
        setStartNumber(listNode.getStart())

        // 計算按鈕位置
        const domElement = editor.getElementByKey(listNode.getKey())
        if (domElement) {
          const rect = domElement.getBoundingClientRect()
          setButtonPosition({
            // 使用 fixed positioning，直接用 rect (viewport coordinates)
            top: rect.top,
            left: rect.left - 40,
          })
        }
        return
      }
    }
    // 如果 Modal 正在顯示，不要隱藏 activeListNode，否則無法更新
    if (!showModal) {
      setActiveListNode(null)
      setButtonPosition(null)
    }
  }, [editor, showModal])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar()
      })
    })
  }, [editor, $updateToolbar])

  const updateListStart = () => {
    if (activeListNode) {
      editor.update(() => {
        // 重新獲取最新的 node 以確保安全
        const node = editor.getElementByKey(activeListNode.getKey()) ? activeListNode : null
        if (node) {
          node.setStart(startNumber)
        }
      })
    }
    setShowModal(false)
    setActiveListNode(null)
    setButtonPosition(null)
  }

  // 設定按鈕樣式
  const buttonStyle: React.CSSProperties = {
    position: 'fixed', // Fixed viewport positioning
    top: buttonPosition?.top || 0,
    left: buttonPosition?.left || 0,
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)', // 加重陰影
    zIndex: 99999, // 確保最高層級
    fontSize: '14px',
    border: '2px solid white', // 增加白邊避免背景干擾
    transition: 'top 0.1s, left 0.1s', // 稍微快一點
  }

  // Modal 樣式
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100000,
  }

  const modalContentStyle: React.CSSProperties = {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '320px',
    maxWidth: '90%',
  }

  if (!mounted) return null
  if (!editor) return null

  // 使用 Portal 渲染到 body，確保不被裁切
  return createPortal(
    <>
      {activeListNode && buttonPosition && !showModal && (
        <button
          type="button"
          style={buttonStyle}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation() // 避免失去焦點
            setShowModal(true)
          }}
          title="設定列表起始編號"
        >
          🔢
        </button>
      )}

      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600, color: '#1a202c' }}>
              設定起始編號
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#4a5568',
                }}
              >
                列表將從此號碼開始：
              </label>
              <input
                type="number"
                min="1"
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '6px',
                  outline: 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') updateListStart()
                  if (e.key === 'Escape') setShowModal(false)
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px',
                  background: '#f7fafc',
                  border: '1px solid #cbd5e0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#4a5568',
                }}
              >
                取消
              </button>
              <button
                onClick={updateListStart}
                style={{
                  padding: '8px 16px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                確認修改
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body,
  )
}
