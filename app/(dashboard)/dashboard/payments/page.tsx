'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  CreditCard, 
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react'
import type { Transaction } from '@/types'
import { format } from 'date-fns'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PaymentsPage() {
  const { data, isLoading } = useSWR<{ transactions: Transaction[] }>(
    '/api/transactions',
    fetcher
  )

  const premiumPaid = data?.transactions
    .filter((t) => t.type === 'premium' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  const claimReceived = data?.transactions
    .filter((t) => t.type === 'claim_payout' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
        <p className="text-muted-foreground">
          Track your premiums and claim payouts
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Premium Paid
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-red-600">
                Rs. {premiumPaid.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Claims Received
            </CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-green-600">
                Rs. {claimReceived.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Position
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className={`text-2xl font-bold ${
                claimReceived - premiumPaid >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Rs. {(claimReceived - premiumPaid).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : data?.transactions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-muted-foreground">
                Your payment history will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell className="font-medium">
                      #{transaction._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.type === 'premium' ? (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-green-500" />
                        )}
                        <span className="capitalize">
                          {transaction.type.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === 'completed'
                            ? 'default'
                            : transaction.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${
                      transaction.type === 'premium' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'premium' ? '-' : '+'}Rs. {transaction.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
