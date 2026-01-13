import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { PICKUP_STATUS_LABELS } from '@/lib/constants'

interface UserProfile {
  name: string | null
}

interface Subscription {
  id: string
  plan_type: string
  frequency: string
  bag_count: number
  pickup_day_1: string
  pickup_day_2: string | null
}

interface Pickup {
  id: string
  scheduled_date: string
  scheduled_window_start: string
  scheduled_window_end: string
  status: string
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profileData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  const profile = profileData as unknown as UserProfile | null

  // Fetch subscription
  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()
  const subscription = subscriptionData as unknown as Subscription | null

  // If no active subscription, redirect to onboarding
  if (!subscription) {
    redirect('/onboarding')
  }

  // Fetch next upcoming pickup
  const { data: nextPickupData } = await supabase
    .from('pickups')
    .select('*')
    .eq('subscription_id', subscription.id)
    .gte('scheduled_date', new Date().toISOString().split('T')[0])
    .neq('status', 'skipped')
    .order('scheduled_date', { ascending: true })
    .limit(1)
    .single()
  const nextPickup = nextPickupData as unknown as Pickup | null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hours] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${ampm}`
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome message */}
        <Card variant="elevated">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back, {profile?.name?.split(' ')[0] || 'there'}!
            </h2>
            <p className="text-gray-600 mt-1">
              Here&apos;s what&apos;s happening with your laundry.
            </p>
          </CardContent>
        </Card>

        {/* Next pickup card */}
        <Card>
          <CardHeader>
            <CardTitle>Next Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            {nextPickup ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(nextPickup.scheduled_date)}
                    </p>
                    <p className="text-gray-600">
                      {formatTime(nextPickup.scheduled_window_start)} - {formatTime(nextPickup.scheduled_window_end)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    nextPickup.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    nextPickup.status === 'picked_up' ? 'bg-yellow-100 text-yellow-700' :
                    nextPickup.status === 'washing' ? 'bg-purple-100 text-purple-700' :
                    nextPickup.status === 'out_for_delivery' ? 'bg-teal-100 text-teal-700' :
                    nextPickup.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {PICKUP_STATUS_LABELS[nextPickup.status as keyof typeof PICKUP_STATUS_LABELS]}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Link href={`/dashboard/pickups/${nextPickup.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  {nextPickup.status === 'scheduled' && (
                    <Link href={`/dashboard/pickups/${nextPickup.id}/skip`} className="flex-1">
                      <Button variant="ghost" className="w-full text-gray-600">
                        Skip Pickup
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No upcoming pickups scheduled.</p>
            )}
          </CardContent>
        </Card>

        {/* Subscription summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium capitalize">{subscription.plan_type} ({subscription.bag_count} bags)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Frequency</span>
                <span className="font-medium capitalize">{subscription.frequency.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Pickup Day</span>
                <span className="font-medium capitalize">
                  {subscription.pickup_day_1}
                  {subscription.pickup_day_2 && ` & ${subscription.pickup_day_2}`}
                </span>
              </div>
            </div>

            <Link href="/dashboard/subscription" className="block mt-4">
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/dashboard/pickups">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <svg className="w-8 h-8 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 font-medium text-gray-900">View All Pickups</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/support">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <svg className="w-8 h-8 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 font-medium text-gray-900">Get Help</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
