'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { DAYS_OF_WEEK } from '@/lib/constants'

function SuccessContent() {
  const searchParams = useSearchParams()
  const pickupDay = searchParams.get('pickup_day') || 'monday'
  const windowStart = searchParams.get('window_start') || '08:00'
  const windowEnd = searchParams.get('window_end') || '10:00'

  const formatTime = (time: string) => {
    const [hours] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${ampm}`
  }

  const getNextPickupDate = () => {
    const dayIndex = DAYS_OF_WEEK.findIndex(d => d.value === pickupDay)
    const today = new Date()
    const currentDay = today.getDay()
    const targetDay = dayIndex === -1 ? 1 : dayIndex + 1 // +1 because Sunday is 0

    let daysUntil = targetDay - currentDay
    if (daysUntil <= 0) daysUntil += 7

    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + daysUntil)

    return nextDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const dayLabel = DAYS_OF_WEEK.find(d => d.value === pickupDay)?.label || pickupDay

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <Link href="/" className="text-2xl font-bold text-teal-600">
            Fresh Folds
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <Card variant="elevated" className="text-center">
          <CardHeader>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl">You&apos;re All Set!</CardTitle>
            <CardDescription className="text-lg">
              Welcome to Fresh Folds
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-teal-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-teal-900 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-teal-800">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Your Fresh Folds kit (weather-resistant bags) will arrive within 3-5 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>We&apos;ll send you a reminder 48 hours before your first pickup</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Fill your bags and set them on your porch on pickup day</span>
                </li>
              </ul>
            </div>

            <div className="text-left space-y-2 py-4 border-t border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Day</span>
                <span className="font-medium capitalize">{dayLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Window</span>
                <span className="font-medium">{formatTime(windowStart)} - {formatTime(windowEnd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">First Pickup</span>
                <span className="font-medium">{getNextPickupDate()}</span>
              </div>
            </div>

            <Link href="/dashboard">
              <Button className="w-full" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
