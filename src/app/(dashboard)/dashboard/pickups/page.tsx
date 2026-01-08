import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, Button } from '@/components/ui'
import { PICKUP_STATUS_LABELS } from '@/lib/constants'

interface Subscription {
  id: string
}

interface Pickup {
  id: string
  scheduled_date: string
  scheduled_window_start: string
  scheduled_window_end: string
  status: string
}

export default async function PickupsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch subscription
  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()
  const subscription = subscriptionData as unknown as Subscription | null

  if (!subscription) {
    redirect('/onboarding')
  }

  // Fetch all pickups (upcoming and past)
  const { data: pickupsData } = await supabase
    .from('pickups')
    .select('*')
    .eq('subscription_id', subscription.id)
    .order('scheduled_date', { ascending: false })
    .limit(20)
  const pickups = (pickupsData || []) as unknown as Pickup[]

  const today = new Date().toISOString().split('T')[0]
  const upcomingPickups = pickups.filter(p => p.scheduled_date >= today && p.status !== 'delivered')
  const pastPickups = pickups.filter(p => p.scheduled_date < today || p.status === 'delivered')

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700'
      case 'skipped': return 'bg-gray-100 text-gray-700'
      case 'picked_up': return 'bg-yellow-100 text-yellow-700'
      case 'washing': return 'bg-purple-100 text-purple-700'
      case 'ready': return 'bg-indigo-100 text-indigo-700'
      case 'out_for_delivery': return 'bg-teal-100 text-teal-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'no_bags': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const canSkip = (pickup: { scheduled_date: string; status: string }) => {
    if (pickup.status !== 'scheduled') return false
    const pickupDate = new Date(pickup.scheduled_date)
    const now = new Date()
    const hoursUntilPickup = (pickupDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilPickup >= 24
  }

  return (
    <DashboardLayout title="Pickups">
      <div className="space-y-8">
        {/* Upcoming Pickups */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Pickups</h2>
          {upcomingPickups.length > 0 ? (
            <div className="space-y-4">
              {upcomingPickups.map((pickup) => (
                <Card key={pickup.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatDate(pickup.scheduled_date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatTime(pickup.scheduled_window_start)} - {formatTime(pickup.scheduled_window_end)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                          {PICKUP_STATUS_LABELS[pickup.status as keyof typeof PICKUP_STATUS_LABELS]}
                        </span>
                        {canSkip(pickup) && (
                          <Link href={`/dashboard/pickups/${pickup.id}/skip`}>
                            <Button variant="ghost" size="sm">
                              Skip
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-600">
                No upcoming pickups scheduled.
              </CardContent>
            </Card>
          )}
        </section>

        {/* Past Pickups */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order History</h2>
          {pastPickups.length > 0 ? (
            <div className="space-y-4">
              {pastPickups.map((pickup) => (
                <Card key={pickup.id} className="opacity-75">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(pickup.scheduled_date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatTime(pickup.scheduled_window_start)} - {formatTime(pickup.scheduled_window_end)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                        {PICKUP_STATUS_LABELS[pickup.status as keyof typeof PICKUP_STATUS_LABELS]}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-600">
                No past pickups yet.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}
