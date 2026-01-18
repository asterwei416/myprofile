import { createServerFeature } from '@payloadcms/richtext-lexical'

export const ListStartNumberFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/ListStartNumber/feature.client#ListStartNumberClientFeature',
    clientFeatureProps: null,
  },
  key: 'listStartNumber',
})
