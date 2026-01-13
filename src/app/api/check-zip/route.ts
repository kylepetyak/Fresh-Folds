import { NextRequest, NextResponse } from 'next/server'
import { SERVICE_ZIP_CODES } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zipCode } = body

    if (!zipCode || !/^\d{5}$/.test(zipCode)) {
      return NextResponse.json(
        { error: 'Invalid zip code' },
        { status: 400 }
      )
    }

    const available = SERVICE_ZIP_CODES.includes(zipCode)

    return NextResponse.json({ available, zipCode })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
