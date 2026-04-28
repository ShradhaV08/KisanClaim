'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, X, ArrowRight, Scale } from 'lucide-react'
import Link from 'next/link'
import type { Plan } from '@/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ComparePage() {
  const [selectedPlans, setSelectedPlans] = useState<string[]>(['', '', ''])
  const { data, isLoading } = useSWR<{ plans: Plan[] }>('/api/plans', fetcher)

  const handlePlanSelect = (index: number, planId: string) => {
    const newSelected = [...selectedPlans]
    newSelected[index] = planId
    setSelectedPlans(newSelected)
  }

  const getSelectedPlanData = (index: number) => {
    if (!selectedPlans[index] || !data?.plans) return null
    return data.plans.find((p) => p._id === selectedPlans[index])
  }

  const allBenefits = data?.plans
    ? Array.from(new Set(data.plans.flatMap((p) => p.benefits)))
    : []

  const comparisonPlans = selectedPlans
    .map((_, i) => getSelectedPlanData(i))
    .filter(Boolean) as Plan[]

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Compare Plans</h1>
              <p className="text-muted-foreground">
                Side-by-side comparison of insurance plans
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              {[0, 1, 2].map((index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                      Plan {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={selectedPlans[index]}
                      onValueChange={(value) => handlePlanSelect(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.plans.map((plan) => (
                          <SelectItem
                            key={plan._id}
                            value={plan._id}
                            disabled={selectedPlans.includes(plan._id) && selectedPlans[index] !== plan._id}
                          >
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {getSelectedPlanData(index) && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="font-medium">{getSelectedPlanData(index)?.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {getSelectedPlanData(index)?.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Premium Range</p>
                          <p className="text-lg font-semibold text-primary">
                            Rs. {getSelectedPlanData(index)?.premiumRange.min.toLocaleString()} - Rs.{' '}
                            {getSelectedPlanData(index)?.premiumRange.max.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Coverage</p>
                          <p className="font-semibold">
                            Rs. {getSelectedPlanData(index)?.coverageAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Crops</p>
                          <div className="flex flex-wrap gap-1">
                            {getSelectedPlanData(index)?.cropTypes.slice(0, 3).map((crop) => (
                              <Badge key={crop} variant="secondary" className="text-xs">
                                {crop}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <Link href={`/plans/${getSelectedPlanData(index)?._id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {comparisonPlans.length >= 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 pr-4 font-medium text-muted-foreground">
                            Benefit
                          </th>
                          {comparisonPlans.map((plan) => (
                            <th
                              key={plan._id}
                              className="text-center py-3 px-4 font-medium"
                            >
                              {plan.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allBenefits.map((benefit) => (
                          <tr key={benefit} className="border-b border-border">
                            <td className="py-3 pr-4 text-sm">{benefit}</td>
                            {comparisonPlans.map((plan) => (
                              <td key={plan._id} className="text-center py-3 px-4">
                                {plan.benefits.includes(benefit) ? (
                                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                        <tr className="border-b border-border">
                          <td className="py-3 pr-4 text-sm font-medium">Duration</td>
                          {comparisonPlans.map((plan) => (
                            <td key={plan._id} className="text-center py-3 px-4">
                              {plan.duration} months
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 text-sm font-medium">Regions</td>
                          {comparisonPlans.map((plan) => (
                            <td key={plan._id} className="text-center py-3 px-4">
                              {plan.regions.length} states
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {comparisonPlans.length < 2 && (
              <Card className="bg-muted/30">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select at least 2 plans to compare their features
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
