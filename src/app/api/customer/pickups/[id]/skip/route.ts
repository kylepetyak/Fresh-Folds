import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface PickupWithSubscription {
  id: string
  status: string
  scheduled_date: string
  subscriptions: {
    user_id: string
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Fetch the pickup and verify it belongs to the user
    const { data: pickupData, error: fetchError } = await supabaseAdmin
      .from('pickups')
      .select(`
        *,
        subscriptions!inner(user_id)
      `)
      .eq('id', id)
      .single()

    if (fetchError || !pickupData) {
      return NextResponse.json({ error: 'Pickup not found' }, { status: 404 })
    }

    const pickup = pickupData as unknown as PickupWithSubscription

    if (pickup.subscriptions.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if pickup can be skipped (status must be 'scheduled')
    if (pickup.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'This pickup cannot be skipped' },
        { status: 400 }
      )
    }

    // Check if there's at least 24 hours until pickup
    const pickupDate = new Date(pickup.scheduled_date)
    const now = new Date()
    const hoursUntilPickup = (pickupDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilPickup < 24) {
      return NextResponse.json(
        { error: 'Pickups can only be skipped with at least 24 hours notice' },
        { status: 400 }
      )
    }

    // Update pickup status to skipped
    const { error: updateError } = await supabaseAdmin
      .from('pickups')
      .update({ status: 'skipped', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to skip pickup' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Skip pickup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
