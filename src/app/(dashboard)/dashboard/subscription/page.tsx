import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from '@/components/ui'
import { HOUSEHOLD_SIZES, FREQUENCIES, DAYS_OF_WEEK } from '@/lib/constants'

// Demo subscription data
const demoSubscription = {
  id: 'demo-sub-1',
  status: 'active',
  plan_type: 'medium',
  frequency: 'weekly',
  bag_count: 4,
  pickup_day_1: 'monday',
  pickup_day_2: null as string | null,
  pickup_window_start: '08:00',
  pickup_window_end: '10:00',
}

export default function SubscriptionPage() {
  const subscription = demoSubscription

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
                <Button variant="outline" className="w-full justify-between">
                  <span>Pause Subscription</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
                <Button variant="ghost" className="w-full justify-between text-red-600 hover:bg-red-50">
                  <span>Cancel Subscription</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </>
            )}
            {subscription.status === 'paused' && (
              <Button className="w-full">
                Resume Subscription
              </Button>
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
            <Button variant="outline">
              Manage Billing
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
