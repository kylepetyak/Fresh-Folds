import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subject, message } = body

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      )
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Create support ticket using admin client
    const { error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        user_id: user.id,
        type: 'customer',
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
      })

    if (error) {
      console.error('Support ticket error:', error)
      return NextResponse.json(
        { error: 'Failed to submit support ticket' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
