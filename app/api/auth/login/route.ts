import { NextResponse } from 'next/server'
import { db } from '@/lib/sample-data'
import { createToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = db.users.findByEmailWithPassword(email.toLowerCase())
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Plain text comparison for in-memory demo
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = await createToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        address: user.address,
      },
    })

    const cookieHeader = setAuthCookie(token)
    response.headers.set('Set-Cookie', cookieHeader['Set-Cookie'])

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
