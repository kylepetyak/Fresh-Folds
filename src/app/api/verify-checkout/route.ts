import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    if (session.metadata?.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Format pickup day and window for display
    const pickupDay = session.metadata?.pickup_day_1 || 'monday'
    const windowStart = session.metadata?.pickup_window_start || '08:00'
    const windowEnd = session.metadata?.pickup_window_end || '10:00'

    // Format window for display
    const formatTime = (time: string) => {
      const [hours] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${displayHour}:00 ${ampm}`
    }

    // Calculate first pickup date (next occurrence of pickup day)
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = new Date()
    const targetDay = daysOfWeek.indexOf(pickupDay)
    const currentDay = today.getDay()
    let daysUntilPickup = targetDay - currentDay
    if (daysUntilPickup <= 0) {
      daysUntilPickup += 7
    }
    const firstPickup = new Date(today)
    firstPickup.setDate(today.getDate() + daysUntilPickup)

    return NextResponse.json({
      success: true,
      subscription: {
        pickupDay: pickupDay,
        pickupWindow: `${formatTime(windowStart)} - ${formatTime(windowEnd)}`,
        firstPickupDate: firstPickup.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
      },
    })
  } catch (error) {
    console.error('Verify checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to verify checkout' },
      { status: 500 }
    )
  }
}
