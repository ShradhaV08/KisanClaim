'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch')
  }
  return res.json()
}

export function useAuth() {
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR<{ user: User }>(
    '/api/auth/me',
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Login failed')
    }

    const userData = await res.json()
    await mutate(userData)
    return userData
  }

  const signup = async (userData: {
    email: string
    password: string
    name: string
    phone: string
    role?: string
    address?: {
      district: string
      state: string
      pincode: string
    }
  }) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Signup failed')
    }

    const data = await res.json()
    await mutate(data)
    return data
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    await mutate(undefined, { revalidate: false })
    router.push('/login')
  }

  return {
    user: data?.user,
    isLoading,
    isAuthenticated: !!data?.user,
    error,
    login,
    signup,
    logout,
    mutate,
  }
}
