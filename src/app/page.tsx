'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button, Input } from '@/components/ui'

export default function LandingPage() {
  const router = useRouter()
  const [zipCode, setZipCode] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')

  const handleZipCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit zip code')
      return
    }

    setIsChecking(true)

    try {
      const res = await fetch('/api/check-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipCode }),
      })

      const data = await res.json()

      if (data.available) {
        router.push(`/signup?zip=${zipCode}`)
      } else {
        router.push(`/out-of-area?zip=${zipCode}`)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Laundry day,{' '}
              <span className="text-teal-600">handled.</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              We pick up, wash, fold, and deliver your laundry on a schedule that works for you.
              Reclaim your weekends and never worry about laundry again.
            </p>

            <div className="mt-10 max-w-md mx-auto">
              <form onSubmit={handleZipCheck} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter your zip code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    error={error}
                    className="text-center sm:text-left"
                  />
                </div>
                <Button type="submit" isLoading={isChecking} size="lg">
                  Get Started
                </Button>
              </form>
              <p className="mt-3 text-sm text-gray-500">
                Starting at $79/month · Currently serving Phoenix metro
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Fresh Folds in 4 simple steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Subscribe',
                description: 'Choose a plan based on your household size and pickup frequency.',
              },
              {
                step: '2',
                title: 'Fill Your Bags',
                description: 'We send you weather-resistant bags. Fill them and set them on your porch.',
              },
              {
                step: '3',
                title: 'We Do the Rest',
                description: 'Your provider picks up, washes, folds, and delivers within 48 hours.',
              },
              {
                step: '4',
                title: 'Enjoy Fresh Laundry',
                description: 'Find your perfectly folded laundry waiting at your door.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 font-bold text-xl flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Fresh Folds?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Save Time',
                description: 'Get back 4+ hours every week. Time better spent with family, friends, or yourself.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Gentle Care',
                description: 'We use fragrance-free, dermatologist-recommended detergent. No softeners or dryer sheets.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Local Providers',
                description: 'Support your community. Our providers are your neighbors, earning flexible income.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to reclaim your weekends?</h2>
          <p className="mt-4 text-xl text-teal-100">
            Join hundreds of Phoenix families who&apos;ve made laundry day a thing of the past.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button variant="secondary" size="lg">
                Start Your Subscription
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
