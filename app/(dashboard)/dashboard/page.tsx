'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  FileText, 
  AlertCircle, 
  CreditCard, 
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { CLAIM_STATUS_COLORS, POLICY_STATUS_COLORS } from '@/lib/constants'
import type { Policy, Claim, Transaction } from '@/types'
import { format } from 'date-fns'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: policiesData, isLoading: policiesLoading } = useSWR<{ policies: Policy[] }>(
    '/api/policies',
    fetcher
  )
  const { data: claimsData, isLoading: claimsLoading } = useSWR<{ claims: Claim[] }>(
    '/api/claims',
    fetcher
  )
  const { data: transactionsData, isLoading: transactionsLoading } = useSWR<{ transactions: Transaction[] }>(
    '/api/transactions',
    fetcher
  )

  const activePolicies = policiesData?.policies.filter((p) => p.status === 'active') || []
  const pendingClaims = claimsData?.claims.filter((c) => c.status === 'pending' || c.status === 'under_review') || []
  const totalPremiumPaid = transactionsData?.transactions
    .filter((t) => t.type === 'premium' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  const stats = [
    {
      title: 'Active Policies',
      value: activePolicies.length,
      icon: FileText,
      href: '/dashboard/policies',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Claims',
      value: pendingClaims.length,
      icon: AlertCircle,
      href: '/dashboard/claims',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Total Premium Paid',
      value: `Rs. ${totalPremiumPaid.toLocaleString()}`,
      icon: CreditCard,
      href: '/dashboard/payments',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Coverage Amount',
      value: `Rs. ${(activePolicies.length * 100000).toLocaleString()}`,
      icon: TrendingUp,
      href: '/dashboard/policies',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your insurance portfolio
          </p>
        </div>
        <Button asChild>
          <Link href="/plans">
            <Plus className="mr-2 h-4 w-4" />
            Buy New Policy
          </Link>
        </Button>
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
                    {policiesLoading || claimsLoading || transactionsLoading ? (
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
              <CardTitle>Recent Policies</CardTitle>
              <CardDescription>Your active insurance policies</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/policies">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {policiesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : policiesData?.policies.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No policies yet</p>
                <Button asChild className="mt-4">
                  <Link href="/plans">Browse Plans</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {policiesData?.policies.slice(0, 3).map((policy) => (
                  <div
                    key={policy._id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div>
                      <p className="font-medium">{policy.cropType} Insurance</p>
                      <p className="text-sm text-muted-foreground">
                        {policy.landSize} acres - {policy.location}
                      </p>
                    </div>
                    <Badge className={POLICY_STATUS_COLORS[policy.status]}>
                      {policy.status}
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
              <CardTitle>Recent Claims</CardTitle>
              <CardDescription>Track your claim status</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/claims">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {claimsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : claimsData?.claims.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No claims filed</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/dashboard/claims/new">File a Claim</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {claimsData?.claims.slice(0, 3).map((claim) => (
                  <div
                    key={claim._id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div>
                      <p className="font-medium capitalize">
                        {claim.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rs. {claim.amount.toLocaleString()} - {format(new Date(claim.submittedAt), 'MMM d, yyyy')}
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your payment history</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/payments">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : transactionsData?.transactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactionsData?.transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'premium' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <CreditCard className={`h-4 w-4 ${
                        transaction.type === 'premium' ? 'text-red-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {transaction.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className={`font-medium ${
                    transaction.type === 'premium' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'premium' ? '-' : '+'}Rs. {transaction.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
