'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const zipCode = searchParams.get('zip') || ''

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!validate()) return

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      })

      if (authError) {
        setGeneralError(authError.message)
        return
      }

      if (authData.user) {
        // Create user profile via API route
        await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authData.user.id,
            email: formData.email,
            name: formData.name,
          }),
        })

        // Redirect to onboarding with zip code if provided
        const redirectUrl = zipCode
          ? `/onboarding?zip=${zipCode}`
          : '/onboarding'
        router.push(redirectUrl)
      }
    } catch {
      setGeneralError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="elevated" className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Your Account</CardTitle>
        <CardDescription>
          Start your laundry-free life today
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {generalError}
            </div>
          )}

          <Input
            label="Full Name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    }>
      <SignUpForm />
    </Suspense>
  )
}
