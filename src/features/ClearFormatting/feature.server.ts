import { createServerFeature } from '@payloadcms/richtext-lexical'

export const ClearFormattingFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/ClearFormatting/feature.client#ClearFormattingClientFeature',
    clientFeatureProps: null,
  },
  key: 'clearFormatting',
})
