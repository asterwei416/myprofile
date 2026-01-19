'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { ListStartNumberPlugin } from './plugin.js'

export const ListStartNumberClientFeature = createClientFeature({
  plugins: [
    {
      Component: ListStartNumberPlugin,
      position: 'normal',
    },
  ],
})
