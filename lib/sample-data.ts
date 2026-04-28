import type { Plan, User, Policy, Claim, Transaction, ClaimType, ClaimStatus } from '@/types'

// ────────────────────────────── Sample Plans ──────────────────────────────
export const samplePlans: (Plan & { _id: string })[] = [
  {
    _id: 'plan-1',
    name: 'Kisan Suraksha Basic',
    description: 'Comprehensive basic coverage for small and medium farmers. Protects against natural calamities, pest attacks, and crop diseases with affordable premiums.',
    cropTypes: ['Rice', 'Wheat', 'Pulses', 'Maize'],
    regions: ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Punjab', 'Haryana'],
    premiumRange: { min: 1500, max: 5000 },
    coverageAmount: 50000,
    benefits: [
      'Natural calamity protection',
      'Pest and disease coverage',
      'Hailstorm damage',
      'Free soil testing',
      '24/7 helpline support',
    ],
    duration: 12,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: 'plan-2',
    name: 'Kisan Suraksha Premium',
    description: 'Enhanced coverage with additional benefits including market price protection and equipment insurance. Ideal for progressive farmers.',
    cropTypes: ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits'],
    regions: ['Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana'],
    premiumRange: { min: 5000, max: 15000 },
    coverageAmount: 150000,
    benefits: [
      'Natural calamity protection',
      'Pest and disease coverage',
      'Hailstorm damage',
      'Flood protection',
      'Drought coverage',
      'Market price protection',
      'Equipment breakdown cover',
      'Free agronomist consultation',
      'Priority claim settlement',
    ],
    duration: 12,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    _id: 'plan-3',
    name: 'Kisan Suraksha Gold',
    description: 'Our most comprehensive plan with maximum coverage and exclusive benefits. Includes income protection and post-harvest coverage.',
    cropTypes: ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Spices', 'Oilseeds'],
    regions: ['All India'],
    premiumRange: { min: 10000, max: 30000 },
    coverageAmount: 300000,
    benefits: [
      'Natural calamity protection',
      'Pest and disease coverage',
      'Hailstorm damage',
      'Flood protection',
      'Drought coverage',
      'Market price protection',
      'Equipment breakdown cover',
      'Post-harvest loss coverage',
      'Income protection guarantee',
      'Free agronomist consultation',
      'Priority claim settlement',
      'Personal accident cover',
      'Family floater health benefit',
    ],
    duration: 12,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    _id: 'plan-4',
    name: 'Cotton Shield Plus',
    description: 'Specialized coverage designed specifically for cotton farmers with protection against bollworm infestation and market fluctuations.',
    cropTypes: ['Cotton'],
    regions: ['Maharashtra', 'Gujarat', 'Madhya Pradesh', 'Telangana', 'Andhra Pradesh'],
    premiumRange: { min: 3000, max: 8000 },
    coverageAmount: 100000,
    benefits: [
      'Bollworm infestation coverage',
      'Natural calamity protection',
      'Quality degradation cover',
      'Market price guarantee',
      'Free pest management advisory',
      'Premium seed discount',
    ],
    duration: 8,
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: 'plan-5',
    name: 'Horticulture Care',
    description: 'Tailored insurance solution for fruit and vegetable growers with coverage for perishable produce and cold chain losses.',
    cropTypes: ['Vegetables', 'Fruits'],
    regions: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Himachal Pradesh', 'Uttarakhand'],
    premiumRange: { min: 4000, max: 12000 },
    coverageAmount: 120000,
    benefits: [
      'Perishable produce protection',
      'Cold chain failure coverage',
      'Transit damage cover',
      'Natural calamity protection',
      'Quality certification assistance',
      'Market linkage support',
      'Free packaging material',
    ],
    duration: 6,
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    _id: 'plan-6',
    name: 'Sugarcane Secure',
    description: 'Dedicated protection for sugarcane cultivators with extended coverage period and mill payment guarantee.',
    cropTypes: ['Sugarcane'],
    regions: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Bihar'],
    premiumRange: { min: 3500, max: 10000 },
    coverageAmount: 80000,
    benefits: [
      'Natural calamity protection',
      'Mill payment guarantee',
      'Pest and disease coverage',
      'Ratoon crop protection',
      'Free irrigation advisory',
      'Yield improvement support',
    ],
    duration: 18,
    isActive: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
]

// ────────────────────────────── Sample Users ──────────────────────────────
// Passwords: demo123 → pre-hashed, admin123 → pre-hashed, agent123 → same
// For in-memory auth, we compare plain text directly (no bcrypt overhead)
export const sampleUsers: (User & { _id: string; password: string })[] = [
  {
    _id: 'user-1',
    email: 'demo@kisanclaim.com',
    password: 'demo123',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    role: 'user',
    address: {
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: 'user-2',
    email: 'agent@kisanclaim.com',
    password: 'agent123',
    name: 'Suresh Verma',
    phone: '9876543211',
    role: 'agent',
    address: {
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: 'user-3',
    email: 'admin@kisanclaim.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '9876543212',
    role: 'admin',
    address: {
      district: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: 'user-4',
    email: 'lakshmi@example.com',
    password: 'password123',
    name: 'Lakshmi Devi',
    phone: '9876543213',
    role: 'user',
    address: {
      district: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
]

// ────────────────────────────── Sample Policies ──────────────────────────────
export const samplePolicies: (Policy & { _id: string })[] = [
  {
    _id: 'policy-1',
    userId: 'user-1',
    planId: 'plan-1',
    status: 'active',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2025-05-31'),
    premium: 3500,
    cropType: 'Rice',
    landSize: 5,
    location: 'Lucknow, Uttar Pradesh',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    _id: 'policy-2',
    userId: 'user-1',
    planId: 'plan-2',
    status: 'active',
    startDate: new Date('2024-07-15'),
    endDate: new Date('2025-07-14'),
    premium: 8000,
    cropType: 'Wheat',
    landSize: 3,
    location: 'Lucknow, Uttar Pradesh',
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    _id: 'policy-3',
    userId: 'user-1',
    planId: 'plan-3',
    status: 'expired',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    premium: 5000,
    cropType: 'Rice',
    landSize: 5,
    location: 'Lucknow, Uttar Pradesh',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: 'policy-4',
    userId: 'user-4',
    planId: 'plan-4',
    status: 'active',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2025-04-01'),
    premium: 6000,
    cropType: 'Cotton',
    landSize: 8,
    location: 'Ahmedabad, Gujarat',
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-08-01'),
  },
]

// ────────────────────────────── Sample Claims ──────────────────────────────
export const sampleClaims: (Claim & { _id: string })[] = [
  {
    _id: 'claim-1',
    policyId: 'policy-1',
    userId: 'user-1',
    type: 'weather' as ClaimType,
    description: 'Heavy flooding damaged 2 acres of rice crop during monsoon season. Water level rose to 3 feet in the fields.',
    status: 'pending' as ClaimStatus,
    amount: 25000,
    documents: [],
    submittedAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-15'),
  },
  {
    _id: 'claim-2',
    policyId: 'policy-2',
    userId: 'user-1',
    type: 'pest' as ClaimType,
    description: 'Locust swarm attack destroyed approximately 1.5 acres of wheat crop. Significant damage to standing crop.',
    status: 'under_review' as ClaimStatus,
    amount: 18000,
    documents: [],
    submittedAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-25'),
  },
  {
    _id: 'claim-3',
    policyId: 'policy-1',
    userId: 'user-1',
    type: 'crop_damage' as ClaimType,
    description: 'Severe hailstorm caused extensive damage to rice paddy. Estimated 60% crop loss.',
    status: 'approved' as ClaimStatus,
    amount: 30000,
    fraudScore: 12,
    documents: [],
    submittedAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-18'),
  },
  {
    _id: 'claim-4',
    policyId: 'policy-4',
    userId: 'user-4',
    type: 'pest' as ClaimType,
    description: 'Bollworm infestation in cotton field affecting 4 acres. Crop yield significantly reduced.',
    status: 'pending' as ClaimStatus,
    amount: 35000,
    documents: [],
    submittedAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-05'),
  },
]

// ────────────────────────────── Sample Transactions ──────────────────────────────
export const sampleTransactions: (Transaction & { _id: string })[] = [
  {
    _id: 'txn-1',
    userId: 'user-1',
    policyId: 'policy-1',
    type: 'premium',
    amount: 3500,
    status: 'completed',
    createdAt: new Date('2024-06-01'),
  },
  {
    _id: 'txn-2',
    userId: 'user-1',
    policyId: 'policy-2',
    type: 'premium',
    amount: 8000,
    status: 'completed',
    createdAt: new Date('2024-07-15'),
  },
  {
    _id: 'txn-3',
    userId: 'user-1',
    policyId: 'policy-3',
    type: 'premium',
    amount: 5000,
    status: 'completed',
    createdAt: new Date('2023-01-01'),
  },
  {
    _id: 'txn-4',
    userId: 'user-1',
    policyId: 'policy-1',
    type: 'claim_payout',
    amount: 30000,
    status: 'completed',
    createdAt: new Date('2024-07-20'),
  },
  {
    _id: 'txn-5',
    userId: 'user-4',
    policyId: 'policy-4',
    type: 'premium',
    amount: 6000,
    status: 'completed',
    createdAt: new Date('2024-08-01'),
  },
]

// ────────────────────────────── In-Memory Store ──────────────────────────────
let plans = [...samplePlans]
let users = [...sampleUsers]
let policies = [...samplePolicies]
let claims = [...sampleClaims]
let transactions = [...sampleTransactions]

export const db = {
  plans: {
    findAll: (query?: Record<string, unknown>) => {
      let result = [...plans]
      if (query?.isActive !== undefined) {
        result = result.filter((p) => p.isActive === query.isActive)
      }
      if (query?.cropTypes) {
        const cropTypesQuery = query.cropTypes as { $in?: string[] }
        if (cropTypesQuery.$in) {
          result = result.filter((p) =>
            p.cropTypes.some((ct) => cropTypesQuery.$in!.includes(ct))
          )
        }
      }
      if (query?.regions) {
        const regionsQuery = query.regions as { $in?: string[] }
        if (regionsQuery.$in) {
          result = result.filter((p) =>
            p.regions.some((r) => regionsQuery.$in!.includes(r) || r === 'All India')
          )
        }
      }
      return result
    },
    findById: (id: string) => plans.find((p) => p._id === id) || null,
    create: (data: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>) => {
      const newPlan = {
        ...data,
        _id: `plan-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Plan & { _id: string }
      plans.push(newPlan)
      return newPlan
    },
    update: (id: string, data: Partial<Plan>) => {
      const index = plans.findIndex((p) => p._id === id)
      if (index === -1) return null
      plans[index] = { ...plans[index], ...data, updatedAt: new Date() }
      return plans[index]
    },
    delete: (id: string) => {
      const index = plans.findIndex((p) => p._id === id)
      if (index === -1) return false
      plans.splice(index, 1)
      return true
    },
  },
  users: {
    findAll: (query?: { role?: string }) => {
      let result = [...users]
      if (query?.role) {
        result = result.filter((u) => u.role === query.role)
      }
      return result.map(({ password: _, ...user }) => user)
    },
    findById: (id: string) => {
      const user = users.find((u) => u._id === id)
      if (!user) return null
      const { password: _, ...rest } = user
      return rest
    },
    findByEmail: (email: string) => users.find((u) => u.email === email.toLowerCase()) || null,
    findByEmailWithPassword: (email: string) => users.find((u) => u.email === email.toLowerCase()) || null,
    create: (data: { email: string; password: string; name: string; phone?: string; role?: 'user' | 'agent' | 'admin'; address?: { district: string; state: string; pincode: string } }) => {
      const newUser = {
        _id: `user-${Date.now()}`,
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
        phone: data.phone || '',
        role: data.role || 'user' as const,
        address: data.address || { district: '', state: '', pincode: '' },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      users.push(newUser)
      const { password: _, ...rest } = newUser
      return rest
    },
    update: (id: string, data: Partial<User>) => {
      const index = users.findIndex((u) => u._id === id)
      if (index === -1) return null
      users[index] = { ...users[index], ...data, updatedAt: new Date() } as typeof users[number]
      const { password: _, ...rest } = users[index]
      return rest
    },
    delete: (id: string) => {
      const index = users.findIndex((u) => u._id === id)
      if (index === -1) return false
      users.splice(index, 1)
      return true
    },
  },
  policies: {
    findAll: (query?: { userId?: string; status?: string }) => {
      let result = [...policies]
      if (query?.userId) {
        result = result.filter((p) => p.userId === query.userId)
      }
      if (query?.status) {
        result = result.filter((p) => p.status === query.status)
      }
      return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    },
    findById: (id: string) => policies.find((p) => p._id === id) || null,
    create: (data: Omit<Policy, '_id' | 'createdAt' | 'updatedAt'>) => {
      const newPolicy = {
        ...data,
        _id: `policy-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Policy & { _id: string }
      policies.push(newPolicy)
      return newPolicy
    },
  },
  claims: {
    findAll: (query?: { userId?: string; status?: string }) => {
      let result = [...claims]
      if (query?.userId) {
        result = result.filter((c) => c.userId === query.userId)
      }
      if (query?.status) {
        result = result.filter((c) => c.status === query.status)
      }
      return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    },
    findById: (id: string) => claims.find((c) => c._id === id) || null,
    create: (data: Omit<Claim, '_id' | 'submittedAt' | 'updatedAt'>) => {
      const newClaim = {
        ...data,
        _id: `claim-${Date.now()}`,
        submittedAt: new Date(),
        updatedAt: new Date(),
      } as Claim & { _id: string }
      claims.push(newClaim)
      return newClaim
    },
    update: (id: string, data: Partial<Claim>) => {
      const index = claims.findIndex((c) => c._id === id)
      if (index === -1) return null
      claims[index] = { ...claims[index], ...data, updatedAt: new Date() }
      return claims[index]
    },
  },
  transactions: {
    findAll: (query?: { userId?: string; type?: string }) => {
      let result = [...transactions]
      if (query?.userId) {
        result = result.filter((t) => t.userId === query.userId)
      }
      if (query?.type) {
        result = result.filter((t) => t.type === query.type)
      }
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    create: (data: Omit<Transaction, '_id' | 'createdAt'>) => {
      const newTransaction = {
        ...data,
        _id: `txn-${Date.now()}`,
        createdAt: new Date(),
      } as Transaction & { _id: string }
      transactions.push(newTransaction)
      return newTransaction
    },
  },
  // Reset to initial state (for testing)
  reset: () => {
    plans = [...samplePlans]
    users = [...sampleUsers]
    policies = [...samplePolicies]
    claims = [...sampleClaims]
    transactions = [...sampleTransactions]
  },
}
