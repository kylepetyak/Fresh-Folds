'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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

      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setGeneralError('Invalid email or password')
        } else {
          setGeneralError(error.message)
        }
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setGeneralError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="elevated" className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Log in to manage your subscription
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Log In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    }>
      <LoginForm />
    </Suspense>
  )
}
