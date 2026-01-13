'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Select, Card, CardContent } from '@/components/ui'
import { HOUSEHOLD_SIZES, FREQUENCIES, DAYS_OF_WEEK, PICKUP_WINDOWS } from '@/lib/constants'

type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7

interface OnboardingData {
  planType: 'small' | 'medium' | 'large'
  frequency: 'biweekly' | 'weekly' | 'twice_weekly'
  bagCount: number
  pickupDay1: string
  pickupDay2: string
  pickupWindowStart: string
  pickupWindowEnd: string
  addressStreet: string
  addressCity: string
  addressState: string
  addressZip: string
  phone: string
}

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialZip = searchParams.get('zip') || ''

  const [step, setStep] = useState<OnboardingStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [data, setData] = useState<OnboardingData>({
    planType: 'medium',
    frequency: 'weekly',
    bagCount: 4,
    pickupDay1: 'monday',
    pickupDay2: '',
    pickupWindowStart: '08:00',
    pickupWindowEnd: '10:00',
    addressStreet: '',
    addressCity: '',
    addressState: 'AZ',
    addressZip: initialZip,
    phone: '',
  })

  // Update bag count when plan type changes
  useEffect(() => {
    const size = HOUSEHOLD_SIZES.find((s) => s.value === data.planType)
    if (size) {
      setData((prev) => ({ ...prev, bagCount: size.bagCount }))
    }
  }, [data.planType])

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
    setErrors({})
  }

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 7) as OnboardingStep)
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1) as OnboardingStep)
  }

  const handleCheckout = async () => {
    // Validate checkout fields
    const newErrors: Record<string, string> = {}
    if (!data.addressStreet) newErrors.addressStreet = 'Address is required'
    if (!data.addressCity) newErrors.addressCity = 'City is required'
    if (!data.addressZip || !/^\d{5}$/.test(data.addressZip)) newErrors.addressZip = 'Valid zip code is required'
    if (!data.phone || data.phone.length < 10) newErrors.phone = 'Valid phone number is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // Demo mode: redirect directly to success page
    const params = new URLSearchParams({
      session_id: 'demo_session',
      pickup_day: data.pickupDay1,
      window_start: data.pickupWindowStart,
      window_end: data.pickupWindowEnd,
    })
    router.push(`/onboarding/success?${params.toString()}`)
  }

  const getPlanPrice = () => {
    // Placeholder prices
    const prices = {
      small: { biweekly: 49, weekly: 79, twice_weekly: 139 },
      medium: { biweekly: 69, weekly: 109, twice_weekly: 189 },
      large: { biweekly: 89, weekly: 149, twice_weekly: 259 },
    }
    return prices[data.planType][data.frequency]
  }

  const renderProgressBar = () => {
    const steps = [
      'Household',
      'Frequency',
      'Plan',
      'Schedule',
      'Checkout',
    ]
    const currentStepIndex = Math.min(step - 1, steps.length - 1)

    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`text-xs font-medium ${
                i <= currentStepIndex ? 'text-teal-600' : 'text-gray-400'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-teal-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">How many people are in your household?</h2>
              <p className="mt-2 text-gray-600">This helps us recommend the right plan for you.</p>
            </div>

            <div className="grid gap-4">
              {HOUSEHOLD_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => updateData({ planType: size.value as OnboardingData['planType'] })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    data.planType === size.value
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{size.label}</p>
                      <p className="text-sm text-gray-600">{size.bagCount} bags included</p>
                    </div>
                    {data.planType === size.value && (
                      <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Button onClick={handleNext} className="w-full" size="lg">
              Continue
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">How often do you want pickup?</h2>
              <p className="mt-2 text-gray-600">Choose the frequency that works best for your family.</p>
            </div>

            <div className="grid gap-4">
              {FREQUENCIES.map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => updateData({ frequency: freq.value as OnboardingData['frequency'] })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    data.frequency === freq.value
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{freq.label}</p>
                      <p className="text-sm text-gray-600">{freq.description}</p>
                    </div>
                    {data.frequency === freq.value && (
                      <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1" size="lg">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1" size="lg">
                Continue
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Here&apos;s what we recommend</h2>
              <p className="mt-2 text-gray-600">Based on your selections</p>
            </div>

            <Card variant="elevated" className="text-center">
              <CardContent className="pt-6">
                <p className="text-5xl font-bold text-teal-600">${getPlanPrice()}</p>
                <p className="text-gray-600">/month</p>

                <div className="mt-6 space-y-2 text-left">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Household Size</span>
                    <span className="font-medium">{HOUSEHOLD_SIZES.find((s) => s.value === data.planType)?.label}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Frequency</span>
                    <span className="font-medium">{FREQUENCIES.find((f) => f.value === data.frequency)?.label}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Bags Included</span>
                    <span className="font-medium">{data.bagCount} bags</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1" size="lg">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1" size="lg">
                This Works
              </Button>
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full text-center text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              Customize my plan
            </button>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Select your pickup schedule</h2>
              <p className="mt-2 text-gray-600">
                {data.frequency === 'twice_weekly'
                  ? 'Select two pickup days'
                  : 'Choose your preferred pickup day and time'}
              </p>
            </div>

            <div className="space-y-4">
              <Select
                label="Pickup Day"
                value={data.pickupDay1}
                onChange={(e) => updateData({ pickupDay1: e.target.value })}
                options={DAYS_OF_WEEK.map((d) => ({ value: d.value, label: d.label }))}
              />

              {data.frequency === 'twice_weekly' && (
                <Select
                  label="Second Pickup Day"
                  value={data.pickupDay2}
                  onChange={(e) => updateData({ pickupDay2: e.target.value })}
                  options={DAYS_OF_WEEK.filter((d) => d.value !== data.pickupDay1).map((d) => ({
                    value: d.value,
                    label: d.label,
                  }))}
                  placeholder="Select a day"
                />
              )}

              <Select
                label="Pickup Window"
                value={`${data.pickupWindowStart}-${data.pickupWindowEnd}`}
                onChange={(e) => {
                  const [start, end] = e.target.value.split('-')
                  updateData({ pickupWindowStart: start, pickupWindowEnd: end })
                }}
                options={PICKUP_WINDOWS.map((w) => ({
                  value: `${w.start}-${w.end}`,
                  label: w.label,
                }))}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1" size="lg">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1" size="lg">
                Continue
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Where should we pick up?</h2>
              <p className="mt-2 text-gray-600">Enter your address and contact details</p>
            </div>

            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Street Address"
                placeholder="123 Main St"
                value={data.addressStreet}
                onChange={(e) => updateData({ addressStreet: e.target.value })}
                error={errors.addressStreet}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="Phoenix"
                  value={data.addressCity}
                  onChange={(e) => updateData({ addressCity: e.target.value })}
                  error={errors.addressCity}
                />
                <Input
                  label="State"
                  value={data.addressState}
                  disabled
                />
              </div>

              <Input
                label="Zip Code"
                placeholder="85281"
                value={data.addressZip}
                onChange={(e) => updateData({ addressZip: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                error={errors.addressZip}
              />

              <Input
                label="Phone Number"
                placeholder="(555) 123-4567"
                value={data.phone}
                onChange={(e) => updateData({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                error={errors.phone}
                hint="We'll text you pickup reminders"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You&apos;ll be charged whether bags are out or not. You can skip anytime with 24-hour notice.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1" size="lg">
                Back
              </Button>
              <Button onClick={handleCheckout} className="flex-1" size="lg" isLoading={isLoading}>
                Continue to Payment
              </Button>
            </div>
          </div>
        )

      case 6:
      case 7:
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Preparing checkout...</p>
          </div>
        )

      default:
        return null
    }
  }

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
        {step <= 5 && renderProgressBar()}
        {renderStep()}
      </main>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}
