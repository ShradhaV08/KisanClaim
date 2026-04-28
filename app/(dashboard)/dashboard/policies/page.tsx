'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  FileText, 
  Plus,
  Calendar,
  MapPin,
  Leaf
} from 'lucide-react'
import { POLICY_STATUS_COLORS } from '@/lib/constants'
import type { Policy } from '@/types'
import { format } from 'date-fns'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PoliciesPage() {
  const { data, isLoading } = useSWR<{ policies: Policy[] }>(
    '/api/policies',
    fetcher
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Policies</h1>
          <p className="text-muted-foreground">
            Manage your insurance policies
          </p>
        </div>
        <Button asChild>
          <Link href="/plans">
            <Plus className="mr-2 h-4 w-4" />
            Buy New Policy
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : data?.policies.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No policies yet</h3>
              <p className="text-muted-foreground mb-4">
                Protect your crops with our comprehensive insurance plans
              </p>
              <Button asChild>
                <Link href="/plans">Browse Plans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.policies.map((policy) => (
            <Card key={policy._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">
                    {policy.cropType} Insurance
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Policy ID: {policy._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <Badge className={POLICY_STATUS_COLORS[policy.status]}>
                  {policy.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Leaf className="h-4 w-4" />
                    <span>{policy.landSize} acres</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{policy.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(policy.startDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(policy.endDate), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Premium Paid</p>
                    <p className="font-semibold">Rs. {policy.premium.toLocaleString()}</p>
                  </div>
                  {policy.status === 'active' && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/claims/new">File Claim</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
