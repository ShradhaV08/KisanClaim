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

    const claims = db.claims.findAll(query)

    return NextResponse.json({ claims })
  } catch (error) {
    console.error('Get claims error:', error)
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
    const claim = db.claims.create({
      ...body,
      userId: session.userId,
      status: 'pending',
      documents: body.documents || [],
    })

    return NextResponse.json({ claim }, { status: 201 })
  } catch (error) {
    console.error('Create claim error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
