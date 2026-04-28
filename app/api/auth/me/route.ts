import { NextResponse } from 'next/server'
import { db } from '@/lib/sample-data'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = db.users.findById(session.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        address: user.address,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
