import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const adSettings = await payload.findGlobal({
      slug: 'ad-settings',
    })

    return NextResponse.json({
      success: true,
      data: {
        homepageFooterAd: adSettings.homepageFooterAd,
        postFooterAd: adSettings.postFooterAd,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
