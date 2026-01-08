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
    const { userId, email, name } = body

    if (!userId || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Create user profile in users table
    const { error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        name,
        role: 'customer',
      })

    if (error) {
      console.error('Profile creation error:', error)
      // If user already exists, that's okay
      if (error.code !== '23505') {
        return NextResponse.json(
          { error: 'Failed to create profile' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
