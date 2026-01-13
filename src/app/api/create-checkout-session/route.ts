import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, SUBSCRIPTION_PRICES, BAG_COUNTS } from '@/lib/stripe/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      planType,
      frequency,
      bagCount,
      pickupDay1,
      pickupDay2,
      pickupWindowStart,
      pickupWindowEnd,
    } = body

    // Validate inputs
    if (!planType || !frequency || !pickupDay1 || !pickupWindowStart || !pickupWindowEnd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Demo mode: Skip Stripe if not configured
    if (!process.env.STRIPE_SECRET_KEY) {
      // Return a demo session ID that will be handled by verify-checkout
      return NextResponse.json({
        sessionId: 'demo_session',
        demoMode: true,
        metadata: {
          user_id: user.id,
          plan_type: planType,
          frequency,
          bag_count: bagCount?.toString() || BAG_COUNTS[planType as keyof typeof BAG_COUNTS].toString(),
          pickup_day_1: pickupDay1,
          pickup_day_2: pickupDay2 || '',
          pickup_window_start: pickupWindowStart,
          pickup_window_end: pickupWindowEnd,
        }
      })
    }

    // Get or create Stripe customer
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    const userInfo = userData as unknown as { name: string | null; stripe_customer_id: string | null } | null

    let stripeCustomerId = userInfo?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: userInfo?.name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      stripeCustomerId = customer.id
    }

    // Get the price ID for this plan
    const priceId = SUBSCRIPTION_PRICES[planType as keyof typeof SUBSCRIPTION_PRICES]?.[
      frequency as keyof typeof SUBSCRIPTION_PRICES.small
    ]

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan configuration' }, { status: 400 })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
        frequency,
        bag_count: bagCount?.toString() || BAG_COUNTS[planType as keyof typeof BAG_COUNTS].toString(),
        pickup_day_1: pickupDay1,
        pickup_day_2: pickupDay2 || '',
        pickup_window_start: pickupWindowStart,
        pickup_window_end: pickupWindowEnd,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_type: planType,
          frequency,
          bag_count: bagCount?.toString() || BAG_COUNTS[planType as keyof typeof BAG_COUNTS].toString(),
          pickup_day_1: pickupDay1,
          pickup_day_2: pickupDay2 || '',
          pickup_window_start: pickupWindowStart,
          pickup_window_end: pickupWindowEnd,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
