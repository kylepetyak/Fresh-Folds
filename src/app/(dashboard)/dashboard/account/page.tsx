'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  name: string
  email: string
  phone: string
  address_street: string
  address_city: string
  address_state: string
  address_zip: string
}

export default function AccountPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        const userData = data as unknown as {
          name: string | null
          email: string
          phone: string | null
          address_street: string | null
          address_city: string | null
          address_state: string | null
          address_zip: string | null
        }
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address_street: userData.address_street || '',
          address_city: userData.address_city || '',
          address_state: userData.address_state || '',
          address_zip: userData.address_zip || '',
        })
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
    setErrors({})
    setSuccessMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const response = await fetch('/api/customer/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || 'Failed to update profile' })
        return
      }

      setSuccessMessage('Profile updated successfully!')
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Account">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Account">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {errors.general && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {errors.general}
                </div>
              )}
              {successMessage && (
                <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                  {successMessage}
                </div>
              )}

              <Input
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                error={errors.name}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                disabled
                hint="Contact support to change your email"
              />

              <Input
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pickup Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Street Address"
                name="address_street"
                value={profile.address_street}
                onChange={handleChange}
                error={errors.address_street}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="address_city"
                  value={profile.address_city}
                  onChange={handleChange}
                  error={errors.address_city}
                />
                <Input
                  label="State"
                  name="address_state"
                  value={profile.address_state}
                  disabled
                />
              </div>

              <Input
                label="Zip Code"
                name="address_zip"
                value={profile.address_zip}
                onChange={(e) => handleChange({
                  ...e,
                  target: { ...e.target, value: e.target.value.replace(/\D/g, '').slice(0, 5) }
                })}
                error={errors.address_zip}
              />
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
