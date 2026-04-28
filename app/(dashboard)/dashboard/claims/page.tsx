'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  AlertCircle, 
  Plus,
  FileText
} from 'lucide-react'
import { CLAIM_STATUS_COLORS } from '@/lib/constants'
import type { Claim } from '@/types'
import { format } from 'date-fns'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ClaimsPage() {
  const { data, isLoading } = useSWR<{ claims: Claim[] }>(
    '/api/claims',
    fetcher
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Claims</h1>
          <p className="text-muted-foreground">
            Track and manage your insurance claims
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/claims/new">
            <Plus className="mr-2 h-4 w-4" />
            File New Claim
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : data?.claims.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No claims filed</h3>
              <p className="text-muted-foreground mb-4">
                If you have experienced crop damage, you can file a claim here
              </p>
              <Button asChild>
                <Link href="/dashboard/claims/new">File a Claim</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Claims
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data?.claims.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">
                  {data?.claims.filter((c) => c.status === 'pending').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {data?.claims.filter((c) => c.status === 'approved').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  Rs. {data?.claims.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.claims.map((claim) => (
                    <TableRow key={claim._id}>
                      <TableCell className="font-medium">
                        #{claim._id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {claim.type.replace('_', ' ')}
                      </TableCell>
                      <TableCell>Rs. {claim.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {format(new Date(claim.submittedAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge className={CLAIM_STATUS_COLORS[claim.status]}>
                          {claim.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
