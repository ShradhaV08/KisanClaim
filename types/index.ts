export type UserRole = 'user' | 'agent' | 'admin'

export interface User {
  _id: string
  email: string
  name: string
  phone: string
  role: UserRole
  address?: {
    district: string
    state: string
    pincode: string
  }
  createdAt: Date
  updatedAt?: Date
}

export interface Plan {
  _id: string
  name: string
  description: string
  cropTypes: string[]
  regions: string[]
  premiumRange: {
    min: number
    max: number
  }
  coverageAmount: number
  benefits: string[]
  terms?: string
  duration: number
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type PolicyStatus = 'active' | 'expired' | 'cancelled'

export interface Policy {
  _id: string
  userId: string
  planId: string
  plan?: Plan
  status: PolicyStatus
  premium: number
  startDate: Date
  endDate: Date
  cropType: string
  landSize: number
  location: string
  createdAt?: Date
  updatedAt?: Date
}

export type ClaimStatus = 'pending' | 'under_review' | 'approved' | 'rejected'
export type ClaimType = 'crop_damage' | 'weather' | 'pest' | 'other'

export interface Claim {
  _id: string
  policyId: string
  policy?: Policy
  userId: string
  type: ClaimType
  description: string
  amount: number
  status: ClaimStatus
  documents: string[]
  fraudScore?: number
  submittedAt: Date
  updatedAt: Date
}

export type TransactionType = 'premium' | 'claim_payout'
export type TransactionStatus = 'pending' | 'completed' | 'failed'

export interface Transaction {
  _id: string
  userId: string
  policyId: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  createdAt: Date
}

export interface AuthPayload {
  userId: string
  email: string
  role: UserRole
}

export interface QuoteInput {
  cropType: string
  landSize: number
  region: string
  irrigationType: 'irrigated' | 'rainfed'
  previousClaims: number
}

export interface QuoteResult {
  estimatedPremium: number
  coverageAmount: number
  recommendedPlans: Plan[]
}
