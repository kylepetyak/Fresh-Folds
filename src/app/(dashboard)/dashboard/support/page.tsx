'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Select } from '@/components/ui'

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.subject.trim()) {
      setError('Please select a topic')
      return
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setError('Please provide more details (at least 10 characters)')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/customer/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit ticket')
        return
      }

      setIsSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <DashboardLayout title="Support">
        <div className="max-w-md mx-auto">
          <Card variant="elevated" className="text-center">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Message Sent!</h2>
              <p className="text-gray-600 mt-2">
                We&apos;ll get back to you within 24 hours.
              </p>
              <Button
                className="mt-6"
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({ subject: '', message: '' })
                }}
              >
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Support">
      <div className="max-w-2xl">
        {/* FAQ Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <details className="group">
              <summary className="cursor-pointer font-medium text-gray-900 hover:text-teal-600">
                How do I skip a pickup?
              </summary>
              <p className="mt-2 text-gray-600 pl-4">
                You can skip any upcoming pickup with at least 24 hours notice. Go to your Pickups page and click &quot;Skip&quot; on the pickup you want to skip.
              </p>
            </details>
            <details className="group">
              <summary className="cursor-pointer font-medium text-gray-900 hover:text-teal-600">
                What if I forget to put my bags out?
              </summary>
              <p className="mt-2 text-gray-600 pl-4">
                If you forget to put your bags out, you&apos;ll still be charged for that pickup cycle (similar to a gym membership). Set a reminder the day before!
              </p>
            </details>
            <details className="group">
              <summary className="cursor-pointer font-medium text-gray-900 hover:text-teal-600">
                What detergent do you use?
              </summary>
              <p className="mt-2 text-gray-600 pl-4">
                We use a fragrance-free, dermatologist-recommended detergent. We don&apos;t use fabric softener or dryer sheets to protect sensitive skin and your clothes.
              </p>
            </details>
            <details className="group">
              <summary className="cursor-pointer font-medium text-gray-900 hover:text-teal-600">
                How do I pause or cancel my subscription?
              </summary>
              <p className="mt-2 text-gray-600 pl-4">
                You can pause or cancel your subscription anytime from the Subscription page in your dashboard. Pausing keeps your spot and lets you resume anytime.
              </p>
            </details>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Select
                label="Topic"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Select a topic"
                options={[
                  { value: 'Pickup Issue', label: 'Pickup Issue' },
                  { value: 'Delivery Issue', label: 'Delivery Issue' },
                  { value: 'Billing Question', label: 'Billing Question' },
                  { value: 'Change Subscription', label: 'Change My Subscription' },
                  { value: 'Damaged Item', label: 'Damaged Item' },
                  { value: 'Missing Item', label: 'Missing Item' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" isLoading={isSubmitting}>
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
