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
    const type = searchParams.get('type')
    const all = searchParams.get('all') === 'true'

    const query: { userId?: string; type?: string } = {}
    
    if (!all && session.role === 'user') {
      query.userId = session.userId
    }
    
    if (type) {
      query.type = type
    }

    const transactions = db.transactions.findAll(query)

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
