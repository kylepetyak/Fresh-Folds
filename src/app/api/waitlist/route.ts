import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, zipCode } = body

    if (!email || !zipCode) {
      return NextResponse.json(
        { error: 'Email and zip code are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate zip code format
    if (!/^\d{5}$/.test(zipCode)) {
      return NextResponse.json(
        { error: 'Invalid zip code format' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Check if already on waitlist
    const { data: existing } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .eq('zip_code', zipCode)
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You\'re already on the waitlist!'
      })
    }

    // Add to waitlist
    const { error } = await supabaseAdmin
      .from('waitlist')
      .insert({ email, zip_code: zipCode })

    if (error) {
      console.error('Waitlist insert error:', error)
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'You\'ve been added to the waitlist!'
    })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
