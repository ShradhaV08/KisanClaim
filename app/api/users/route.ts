import { NextResponse } from 'next/server'
import { db } from '@/lib/sample-data'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const query: { role?: string } = {}
    
    if (role) {
      query.role = role
    }

    const users = db.users.findAll(query)

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
