import { NextResponse } from 'next/server'
import { db } from '@/lib/sample-data'
import { getSession } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const claim = db.claims.findById(id)

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    if (session.role === 'user' && claim.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({ claim })
  } catch (error) {
    console.error('Get claim error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const claim = db.claims.findById(id)

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    if (session.role === 'user') {
      if (claim.userId !== session.userId) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
      if (claim.status !== 'pending') {
        return NextResponse.json(
          { error: 'Cannot modify claim after review has started' },
          { status: 400 }
        )
      }
    }

    const updatedClaim = db.claims.update(id, body)

    return NextResponse.json({ claim: updatedClaim })
  } catch (error) {
    console.error('Update claim error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
