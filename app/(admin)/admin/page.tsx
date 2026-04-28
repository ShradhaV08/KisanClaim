'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Users, 
  FileText, 
  AlertCircle, 
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import { CLAIM_STATUS_COLORS } from '@/lib/constants'
import type { User, Plan, Claim } from '@/types'
import { format } from 'date-fns'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminPage() {
  const { data: usersData, isLoading: usersLoading } = useSWR<{ users: User[] }>(
    '/api/users',
    fetcher
  )
  const { data: plansData, isLoading: plansLoading } = useSWR<{ plans: Plan[] }>(
    '/api/plans?activeOnly=false',
    fetcher
  )
  const { data: claimsData, isLoading: claimsLoading } = useSWR<{ claims: Claim[] }>(
    '/api/claims?all=true',
    fetcher
  )

  const pendingClaims = claimsData?.claims.filter(
    (c) => c.status === 'pending' || c.status === 'under_review'
  ) || []

  const stats = [
    {
      title: 'Total Users',
      value: usersData?.users.length || 0,
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Plans',
      value: plansData?.plans.filter((p) => p.isActive).length || 0,
      icon: FileText,
      href: '/admin/plans',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Claims',
      value: pendingClaims.length,
      icon: AlertCircle,
      href: '/admin/claims',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Total Claims',
      value: claimsData?.claims.length || 0,
      icon: TrendingUp,
      href: '/admin/claims',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground">
          Manage users, plans, and claims
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    {usersLoading || plansLoading || claimsLoading ? (
                      <Skeleton className="h-7 w-20" />
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Newly registered users</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {usersData?.users.slice(0, 5).map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Claims</CardTitle>
              <CardDescription>Claims requiring review</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/claims">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {claimsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : pendingClaims.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending claims</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingClaims.slice(0, 5).map((claim) => (
                  <div
                    key={claim._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {claim.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rs. {claim.amount.toLocaleString()} - {format(new Date(claim.submittedAt), 'MMM d')}
                      </p>
                    </div>
                    <Badge className={CLAIM_STATUS_COLORS[claim.status]}>
                      {claim.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
