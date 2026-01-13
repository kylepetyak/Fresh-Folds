import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from '@/components/ui'
import { HOUSEHOLD_SIZES, FREQUENCIES, DAYS_OF_WEEK } from '@/lib/constants'

interface Subscription {
  id: string
  status: string
  plan_type: string
  frequency: string
  bag_count: number
  pickup_day_1: string
  pickup_day_2: string | null
  pickup_window_start: string
  pickup_window_end: string
}

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  const subscription = subscriptionData as unknown as Subscription | null

  if (!subscription) {
    redirect('/onboarding')
  }

  const planName = HOUSEHOLD_SIZES.find(s => s.value === subscription.plan_type)?.label || subscription.plan_type
  const frequencyName = FREQUENCIES.find(f => f.value === subscription.frequency)?.label || subscription.frequency
  const dayName = DAYS_OF_WEEK.find(d => d.value === subscription.pickup_day_1)?.label || subscription.pickup_day_1

  const formatTime = (time: string) => {
    const [hours] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${ampm}`
  }

  return (
    <DashboardLayout title="Subscription">
      <div className="space-y-6 max-w-2xl">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subscription.status === 'active' ? 'bg-green-100 text-green-700' :
                  subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Plan Size</span>
                <span className="font-medium">{planName} ({subscription.bag_count} bags)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Frequency</span>
                <span className="font-medium">{frequencyName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Pickup Day</span>
                <span className="font-medium capitalize">
                  {dayName}
                  {subscription.pickup_day_2 && ` & ${DAYS_OF_WEEK.find(d => d.value === subscription.pickup_day_2)?.label}`}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Pickup Window</span>
                <span className="font-medium">
                  {formatTime(subscription.pickup_window_start)} - {formatTime(subscription.pickup_window_end)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              To change your plan, pickup day, or frequency, please contact support.
            </p>
          </CardFooter>
        </Card>

        {/* Subscription Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription.status === 'active' && (
              <>
                <Link href="/dashboard/subscription/pause">
                  <Button variant="outline" className="w-full justify-between">
                    <span>Pause Subscription</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/dashboard/subscription/cancel">
                  <Button variant="ghost" className="w-full justify-between text-red-600 hover:bg-red-50">
                    <span>Cancel Subscription</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </>
            )}
            {subscription.status === 'paused' && (
              <Link href="/dashboard/subscription/resume">
                <Button className="w-full">
                  Resume Subscription
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Manage your payment method and view billing history through our secure payment portal.
            </p>
            <Link href="/api/create-portal-session" target="_blank">
              <Button variant="outline">
                Manage Billing
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
