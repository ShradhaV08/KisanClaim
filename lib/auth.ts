import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { AuthPayload, UserRole } from '@/types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function createToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AuthPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<AuthPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) return null

  return verifyToken(token)
}

export async function requireAuth(): Promise<AuthPayload> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthPayload> {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.role)) {
    throw new Error('Forbidden')
  }
  return session
}

export function setAuthCookie(token: string) {
  return {
    'Set-Cookie': `auth-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
  }
}

export function clearAuthCookie() {
  return {
    'Set-Cookie': 'auth-token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
  }
}
