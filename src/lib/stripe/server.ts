import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }
  return stripeInstance
}

// For backwards compatibility
export const stripe = {
  get webhooks() {
    return getStripe().webhooks
  },
  get subscriptions() {
    return getStripe().subscriptions
  },
  get checkout() {
    return getStripe().checkout
  },
  get customers() {
    return getStripe().customers
  },
  get billingPortal() {
    return getStripe().billingPortal
  },
}

// Subscription pricing configuration
export const SUBSCRIPTION_PRICES = {
  small: {
    biweekly: 'price_small_biweekly',
    weekly: 'price_small_weekly',
    twice_weekly: 'price_small_twice_weekly',
  },
  medium: {
    biweekly: 'price_medium_biweekly',
    weekly: 'price_medium_weekly',
    twice_weekly: 'price_medium_twice_weekly',
  },
  large: {
    biweekly: 'price_large_biweekly',
    weekly: 'price_large_weekly',
    twice_weekly: 'price_large_twice_weekly',
  },
} as const

// Bag counts by plan type
export const BAG_COUNTS = {
  small: 2,
  medium: 4,
  large: 6,
} as const

// Human readable plan names
export const PLAN_NAMES = {
  small: '1-2 People',
  medium: '3-4 People',
  large: '5+ People',
} as const

// Frequency display names
export const FREQUENCY_NAMES = {
  biweekly: 'Every Other Week',
  weekly: 'Weekly',
  twice_weekly: 'Twice a Week',
} as const
