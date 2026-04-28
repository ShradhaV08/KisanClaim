import { NextResponse } from 'next/server'
import { db } from '@/lib/sample-data'
import { createToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, phone, role = 'user', address } = body

    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = db.users.findByEmail(email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const user = db.users.create({
      email: email.toLowerCase(),
      password,
      name,
      phone,
      role: role === 'admin' ? 'user' : role,
      address: address || { district: '', state: '', pincode: '' },
    })

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
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
