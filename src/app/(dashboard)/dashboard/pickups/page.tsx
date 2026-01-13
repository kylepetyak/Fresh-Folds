import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, Button } from '@/components/ui'
import { PICKUP_STATUS_LABELS } from '@/lib/constants'

// Demo data
const getNextMonday = (weeksAhead: number = 0) => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 7 : 8 - dayOfWeek
  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + daysUntilMonday + (weeksAhead * 7))
  return nextMonday.toISOString().split('T')[0]
}

const getPastMonday = (weeksBack: number) => {
  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - (weeksBack * 7))
  return pastDate.toISOString().split('T')[0]
}

const demoPickups = [
  {
    id: 'demo-1',
    scheduled_date: getNextMonday(0),
    scheduled_window_start: '08:00',
    scheduled_window_end: '10:00',
    status: 'scheduled'
  },
  {
    id: 'demo-2',
    scheduled_date: getNextMonday(1),
    scheduled_window_start: '08:00',
    scheduled_window_end: '10:00',
    status: 'scheduled'
  },
  {
    id: 'demo-3',
    scheduled_date: getPastMonday(1),
    scheduled_window_start: '08:00',
    scheduled_window_end: '10:00',
    status: 'delivered'
  },
  {
    id: 'demo-4',
    scheduled_date: getPastMonday(2),
    scheduled_window_start: '08:00',
    scheduled_window_end: '10:00',
    status: 'delivered'
  },
  {
    id: 'demo-5',
    scheduled_date: getPastMonday(3),
    scheduled_window_start: '08:00',
    scheduled_window_end: '10:00',
    status: 'skipped'
  },
]

export default function PickupsPage() {
  const pickups = demoPickups

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
                        {pickup.status === 'scheduled' && (
                          <Button variant="ghost" size="sm">
                            Skip
                          </Button>
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
