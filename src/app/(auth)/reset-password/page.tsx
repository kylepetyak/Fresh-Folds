'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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

      // If there's a code, exchange it for a session first
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setGeneralError('Invalid or expired reset link. Please request a new one.')
          setIsLoading(false)
          return
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      })

      if (error) {
        setGeneralError(error.message)
        return
      }

      setIsSuccess(true)

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch {
      setGeneralError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Password Reset!</CardTitle>
          <CardDescription>
            Your password has been successfully updated.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 text-center text-sm mb-6">
            Redirecting you to login...
          </p>

          <div className="text-center">
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="elevated" className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>
          Enter your new password below
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
            label="New Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
