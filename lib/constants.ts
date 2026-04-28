export const CROP_TYPES = [
  'Rice',
  'Wheat',
  'Cotton',
  'Sugarcane',
  'Maize',
  'Pulses',
  'Vegetables',
  'Fruits',
  'Oilseeds',
  'Spices',
] as const

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Bihar',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
] as const

export const CLAIM_TYPES = [
  { value: 'crop_damage', label: 'Crop Damage' },
  { value: 'weather', label: 'Weather Related' },
  { value: 'pest', label: 'Pest/Disease Infestation' },
  { value: 'other', label: 'Other' },
] as const

export const CLAIM_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export const POLICY_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  expired: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

export const IRRIGATION_TYPES = [
  { value: 'irrigated', label: 'Irrigated' },
  { value: 'rainfed', label: 'Rainfed' },
] as const
