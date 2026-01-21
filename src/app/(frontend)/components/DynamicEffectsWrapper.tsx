'use client'

import dynamic from 'next/dynamic'

const MouseEffects = dynamic(() => import('./MouseEffects'), { ssr: false })
const BackgroundEffects = dynamic(() => import('./BackgroundEffects'), { ssr: false })

export default function DynamicEffectsWrapper() {
  return (
    <>
      <BackgroundEffects />
      <MouseEffects />
    </>
  )
}
