import { NextResponse } from 'next/server'
import { db } from '@/lib/sample-data'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const all = searchParams.get('all') === 'true'

    const query: { userId?: string; status?: string } = {}
    
    if (!all && session.role === 'user') {
      query.userId = session.userId
    }
    
    if (status) {
      query.status = status
    }

    const policies = db.policies.findAll(query)

    return NextResponse.json({ policies })
  } catch (error) {
    console.error('Get policies error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planId, premium, cropType, landSize, location, duration = 12 } = body

    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + duration)

    const policy = db.policies.create({
      userId: session.userId,
      planId,
      premium,
      cropType,
      landSize,
      location,
      startDate,
      endDate,
      status: 'active',
    })

    db.transactions.create({
      userId: session.userId,
      policyId: policy._id,
      type: 'premium',
      amount: premium,
      status: 'completed',
    })

    return NextResponse.json({ policy }, { status: 201 })
  } catch (error) {
    console.error('Create policy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
