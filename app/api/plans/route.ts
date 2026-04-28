import { NextResponse } from 'next/server'
import { db } from '@/lib/sample-data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cropType = searchParams.get('cropType')
    const region = searchParams.get('region')
    const activeOnly = searchParams.get('activeOnly') !== 'false'

    const query: Record<string, unknown> = {}
    
    if (activeOnly) {
      query.isActive = true
    }
    
    if (cropType) {
      query.cropTypes = { $in: [cropType] }
    }
    
    if (region) {
      query.regions = { $in: [region] }
    }

    const plans = db.plans.findAll(query)

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Get plans error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const plan = db.plans.create(body)

    return NextResponse.json({ plan }, { status: 201 })
  } catch (error) {
    console.error('Create plan error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
