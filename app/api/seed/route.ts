import { NextResponse } from 'next/server'
import { db } from '@/lib/sample-data'

export async function POST() {
  try {
    // In-memory data is already seeded on app start
    const plans = db.plans.findAll()
    const users = db.users.findAll()

    return NextResponse.json({
      message: 'In-memory database is ready (auto-seeded)',
      plansCount: plans.length,
      usersCount: users.length,
      credentials: [
        'demo@kisanclaim.com / demo123 (user)',
        'admin@kisanclaim.com / admin123 (admin)',
        'agent@kisanclaim.com / agent123 (agent)',
      ],
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Seed check failed' },
      { status: 500 }
    )
  }
}
