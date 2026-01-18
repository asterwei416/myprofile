'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { ClearFormattingPlugin } from './plugin.js'
import { ClearFormattingToolbarButton } from './toolbarButton.js'

export const ClearFormattingClientFeature = createClientFeature({
  plugins: [
    {
      Component: ClearFormattingPlugin,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: [
      {
        key: 'clearFormatting',
        type: 'buttons',
        items: [
          {
            key: 'clearFormatting',
            Component: ClearFormattingToolbarButton,
          },
        ],
      },
    ],
  },
  toolbarInline: {
    groups: [
      {
        key: 'clearFormatting',
        type: 'buttons',
        items: [
          {
            key: 'clearFormatting',
            Component: ClearFormattingToolbarButton,
          },
        ],
      },
    ],
  },
})
