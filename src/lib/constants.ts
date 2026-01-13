// Service area zip codes (Phoenix metro area)
export const SERVICE_ZIP_CODES = [
  // Tempe
  '85281', '85282', '85283', '85284', '85285', '85287',
  // Scottsdale
  '85250', '85251', '85252', '85253', '85254', '85255', '85256', '85257', '85258', '85259', '85260', '85261', '85262', '85266', '85267', '85271',
  // Gilbert
  '85233', '85234', '85295', '85296', '85297', '85298', '85299',
  // Mesa
  '85201', '85202', '85203', '85204', '85205', '85206', '85207', '85208', '85209', '85210', '85211', '85212', '85213', '85214', '85215', '85216',
  // Chandler
  '85224', '85225', '85226', '85244', '85246', '85248', '85249',
]

// Pickup time windows
export const PICKUP_WINDOWS = [
  { start: '08:00', end: '10:00', label: '8:00 AM - 10:00 AM' },
  { start: '10:00', end: '12:00', label: '10:00 AM - 12:00 PM' },
  { start: '12:00', end: '14:00', label: '12:00 PM - 2:00 PM' },
  { start: '14:00', end: '16:00', label: '2:00 PM - 4:00 PM' },
  { start: '16:00', end: '18:00', label: '4:00 PM - 6:00 PM' },
  { start: '18:00', end: '20:00', label: '6:00 PM - 8:00 PM' },
]

// Days of the week
export const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
] as const

// Household sizes
export const HOUSEHOLD_SIZES = [
  { value: 'small', label: '1-2 People', bagCount: 2 },
  { value: 'medium', label: '3-4 People', bagCount: 4 },
  { value: 'large', label: '5+ People', bagCount: 6 },
] as const

// Frequencies
export const FREQUENCIES = [
  { value: 'biweekly', label: 'Every Other Week', description: 'Great for smaller households' },
  { value: 'weekly', label: 'Weekly', description: 'Most popular for families' },
  { value: 'twice_weekly', label: 'Twice a Week', description: 'For high-volume households' },
] as const

// Status display mappings
export const PICKUP_STATUS_LABELS = {
  scheduled: 'Scheduled',
  skipped: 'Skipped',
  picked_up: 'Picked Up',
  washing: 'Being Cleaned',
  ready: 'Ready for Delivery',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  no_bags: 'No Bags',
} as const
