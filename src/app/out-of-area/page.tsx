'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'

function OutOfAreaContent() {
  const searchParams = useSearchParams()
  const zipCode = searchParams.get('zip') || ''

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, zipCode }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsSubmitted(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-20">
        <div className="max-w-md mx-auto px-4">
          <Card variant="elevated">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <CardTitle className="text-2xl">We&apos;re Not in Your Area Yet</CardTitle>
              <CardDescription>
                Fresh Folds isn&apos;t available in {zipCode || 'your area'} yet, but we&apos;re expanding!
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">You&apos;re on the list!</h3>
                  <p className="text-gray-600 mt-2">
                    We&apos;ll notify you as soon as Fresh Folds arrives in your area.
                  </p>
                  <Link href="/" className="mt-6 inline-block">
                    <Button variant="outline">Back to Home</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-gray-600 text-center">
                    Join our waitlist and be the first to know when we launch in your neighborhood.
                  </p>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                  />
                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Notify Me
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-gray-500 text-sm mt-6">
            Currently serving Tempe, Scottsdale, Gilbert, Mesa, and Chandler.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function OutOfAreaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    }>
      <OutOfAreaContent />
    </Suspense>
  )
}
