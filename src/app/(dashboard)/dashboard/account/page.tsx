'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui'

export default function AccountPage() {
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '6025551234',
    address_street: '123 Main Street',
    address_city: 'Phoenix',
    address_state: 'AZ',
    address_zip: '85001',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

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

    // Demo mode: just show success
    setTimeout(() => {
      setSuccessMessage('Profile updated successfully!')
      setIsSaving(false)
    }, 500)
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
