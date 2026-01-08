'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

export default function SkipPickupPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [pickup, setPickup] = useState<{ id: string; scheduled_date: string; scheduled_window_start: string; scheduled_window_end: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSkipping, setIsSkipping] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPickup = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('pickups')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (data) {
        setPickup(data)
      }
      setIsLoading(false)
    }

    fetchPickup()
  }, [resolvedParams.id])

  const handleSkip = async () => {
    setIsSkipping(true)
    setError('')

    try {
      const response = await fetch(`/api/customer/pickups/${resolvedParams.id}/skip`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to skip pickup')
        return
      }

      router.push('/dashboard/pickups')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSkipping(false)
    }
  }

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

  if (isLoading) {
    return (
      <DashboardLayout title="Skip Pickup">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!pickup) {
    return (
      <DashboardLayout title="Skip Pickup">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600">Pickup not found.</p>
            <Link href="/dashboard/pickups" className="mt-4 inline-block">
              <Button variant="outline">Back to Pickups</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Skip Pickup">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <CardTitle>Skip This Pickup?</CardTitle>
            <CardDescription>
              Are you sure you want to skip your pickup on {formatDate(pickup.scheduled_date)}?
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-center">
                <p className="font-semibold text-gray-900">{formatDate(pickup.scheduled_date)}</p>
                <p className="text-sm text-gray-600">
                  {formatTime(pickup.scheduled_window_start)} - {formatTime(pickup.scheduled_window_end)}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You&apos;ll still be charged for this billing cycle. Skipping a pickup does not pause your subscription.
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-3">
            <Link href="/dashboard/pickups" className="flex-1">
              <Button variant="outline" className="w-full">
                Keep Pickup
              </Button>
            </Link>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleSkip}
              isLoading={isSkipping}
            >
              Skip Pickup
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
