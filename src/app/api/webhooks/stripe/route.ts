import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin()
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const userId = session.metadata?.user_id
          if (!userId) {
            console.error('Missing user_id in session metadata')
            break
          }

          // Create subscription in database
          const { error: subscriptionError } = await supabaseAdmin
            .from('subscriptions')
            .insert({
              user_id: userId,
              plan_type: session.metadata?.plan_type || 'medium',
              frequency: session.metadata?.frequency || 'weekly',
              pickup_day_1: session.metadata?.pickup_day_1 || 'monday',
              pickup_day_2: session.metadata?.pickup_day_2 || null,
              pickup_window_start: session.metadata?.pickup_window_start || '08:00',
              pickup_window_end: session.metadata?.pickup_window_end || '10:00',
              bag_count: parseInt(session.metadata?.bag_count || '4'),
              status: 'active',
              stripe_subscription_id: subscription.id,
              stripe_customer_id: session.customer as string,
            })

          if (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError)
          }

          // Update user with Stripe customer ID
          await supabaseAdmin
            .from('users')
            .update({ stripe_customer_id: session.customer as string })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status === 'active' ? 'active' :
                   subscription.status === 'canceled' ? 'cancelled' : 'paused',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment failed for invoice:', invoice.id)
        // TODO: Send notification to customer about failed payment
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
