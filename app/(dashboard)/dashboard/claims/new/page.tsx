'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, ArrowLeft, Upload } from 'lucide-react'
import { CLAIM_TYPES } from '@/lib/constants'
import { toast } from 'sonner'
import type { Policy } from '@/types'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function NewClaimPage() {
  const router = useRouter()
  const { data: policiesData, isLoading: policiesLoading } = useSWR<{ policies: Policy[] }>(
    '/api/policies?status=active',
    fetcher
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    policyId: '',
    type: '',
    description: '',
    amount: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit claim')
      }

      toast.success('Claim submitted successfully!')
      router.push('/dashboard/claims')
    } catch {
      toast.error('Failed to submit claim. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const activePolicies = policiesData?.policies.filter((p) => p.status === 'active') || []

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="-ml-4 mb-4">
          <Link href="/dashboard/claims">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Claims
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">File a New Claim</h1>
        <p className="text-muted-foreground">
          Submit a claim for crop damage or loss
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Claim Details</CardTitle>
              <CardDescription>
                Provide information about the damage or loss
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="policy">Select Policy</Label>
                  {policiesLoading ? (
                    <div className="h-10 bg-muted rounded animate-pulse" />
                  ) : activePolicies.length === 0 ? (
                    <div className="p-4 rounded-lg border border-border bg-muted/50 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      No active policies found. You need an active policy to file a claim.
                    </div>
                  ) : (
                    <Select
                      value={formData.policyId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, policyId: value })
                      }
                      required
                    >
                      <SelectTrigger id="policy">
                        <SelectValue placeholder="Select a policy" />
                      </SelectTrigger>
                      <SelectContent>
                        {activePolicies.map((policy) => (
                          <SelectItem key={policy._id} value={policy._id}>
                            {policy.cropType} - {policy.location} ({policy.landSize} acres)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Claim Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                    required
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLAIM_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Claim Amount (Rs.)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1000"
                    placeholder="Enter estimated loss amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the estimated value of the damage or loss
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the damage or loss in detail..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Include when and how the damage occurred, extent of damage, affected area, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Supporting Documents (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Upload photos, weather reports, or other evidence
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      (Document upload functionality coming soon)
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || activePolicies.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Claim'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Claim Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">1. Report Promptly</p>
                <p>File claims within 15 days of the incident for faster processing.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">2. Document Everything</p>
                <p>Include photos, dates, and detailed descriptions of the damage.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">3. Accurate Estimation</p>
                <p>Provide honest estimates. Our team will verify the actual loss.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">4. Processing Time</p>
                <p>Claims are typically processed within 24-48 hours after verification.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-4">
                Our support team is here to help you through the claims process.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/advisor">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
