'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  LexicalCommand,
} from 'lexical'
import { useEffect } from 'react'

export const CLEAR_FORMATTING_COMMAND: LexicalCommand<void> = createCommand(
  'CLEAR_FORMATTING_COMMAND',
)

export function ClearFormattingPlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      CLEAR_FORMATTING_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes()
            nodes.forEach((node) => {
              if ($isTextNode(node)) {
                // 清除所有文字格式 (bold, italic, underline, strikethrough, code, subscript, superscript)
                node.setFormat(0)
                // 清除內聯樣式
                node.setStyle('')
              }
            })
          }
        })
        return true
      },
      COMMAND_PRIORITY_NORMAL,
    )
  }, [editor])

  return null
}
