'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { CLEAR_FORMATTING_COMMAND } from './plugin'

export function ClearFormattingToolbarButton() {
  const [editor] = useLexicalComposerContext()

  const handleClick = () => {
    editor.dispatchCommand(CLEAR_FORMATTING_COMMAND, undefined)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="toolbar-item"
      title="清除格式"
      aria-label="清除格式"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
      }}
    >
      <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>Tx</span>
    </button>
  )
}
