'use client'

import { use } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ArrowLeft, 
  Check, 
  Shield, 
  Clock, 
  MapPin,
  Leaf,
  FileText
} from 'lucide-react'
import type { Plan } from '@/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading, error } = useSWR<{ plan: Plan }>(
    `/api/plans/${id}`,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-8" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data?.plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load plan details.</p>
          <Button asChild>
            <Link href="/plans">Back to Plans</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { plan } = data

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href="/plans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plans
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {plan.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground text-pretty">
            {plan.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Coverage Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Premium Range</p>
                <p className="text-2xl font-bold text-primary">
                  Rs. {plan.premiumRange.min.toLocaleString()} - Rs. {plan.premiumRange.max.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">per season</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maximum Coverage</p>
                <p className="text-xl font-semibold">
                  Rs. {plan.coverageAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Policy Duration</p>
                <p className="text-xl font-semibold">
                  {plan.duration} months
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link href={`/quote?plan=${plan._id}`}>Get Personalized Quote</Link>
              </Button>
              <Button variant="outline" asChild className="w-full" size="lg">
                <Link href="/compare">Compare with Other Plans</Link>
              </Button>
              <Button variant="outline" asChild className="w-full" size="lg">
                <Link href="/advisor">Talk to an Advisor</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Crops Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plan.cropTypes.map((crop) => (
                  <Badge key={crop} variant="secondary">
                    {crop}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Available Regions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plan.regions.map((region) => (
                  <Badge key={region} variant="outline">
                    {region}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              {plan.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {plan.terms && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {plan.terms}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
