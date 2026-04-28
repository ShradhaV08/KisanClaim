'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { Calculator, ArrowRight, Check } from 'lucide-react'
import { CROP_TYPES, INDIAN_STATES, IRRIGATION_TYPES } from '@/lib/constants'
import type { Plan } from '@/types'

interface QuoteResult {
  estimatedPremium: number
  coverageAmount: number
  recommendedPlans: Plan[]
}

export default function QuotePage() {
  const [preselectedPlan, setPreselectedPlan] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    cropType: '',
    landSize: '',
    region: '',
    irrigationType: 'irrigated' as 'irrigated' | 'rainfed',
    previousClaims: '0',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<QuoteResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setPreselectedPlan(params.get('plan'))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          landSize: parseFloat(formData.landSize),
          previousClaims: parseInt(formData.previousClaims),
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to get quote')
      }

      const data = await res.json()
      setResult(data)
    } catch {
      setError('Failed to generate quote. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Get Your Quote</h1>
              <p className="text-muted-foreground">
                Personalized insurance estimate in under 2 minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Farm Details</CardTitle>
              <CardDescription>
                Tell us about your farm to get an accurate quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cropType">Primary Crop</Label>
                  <select
                    id="cropType"
                    value={formData.cropType}
                    onChange={(e) =>
                      setFormData({ ...formData, cropType: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select crop type</option>
                    {CROP_TYPES.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landSize">Land Size (in acres)</Label>
                  <Input
                    id="landSize"
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="e.g., 5"
                    value={formData.landSize}
                    onChange={(e) =>
                      setFormData({ ...formData, landSize: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">State/Region</Label>
                  <select
                    id="region"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Irrigation Type</Label>
                  <RadioGroup
                    value={formData.irrigationType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        irrigationType: value as 'irrigated' | 'rainfed',
                      })
                    }
                    className="flex gap-4"
                  >
                    {IRRIGATION_TYPES.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value} className="font-normal">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousClaims">Previous Claims (last 3 years)</Label>
                  <select
                    id="previousClaims"
                    value={formData.previousClaims}
                    onChange={(e) =>
                      setFormData({ ...formData, previousClaims: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="0">None</option>
                    <option value="1">1 claim</option>
                    <option value="2">2 claims</option>
                    <option value="3">3 or more</option>
                  </select>
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      Calculate Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {result ? (
              <>
                <Card className="border-primary">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-primary">Your Estimated Quote</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Premium</p>
                        <p className="text-4xl font-bold text-primary">
                          Rs. {result.estimatedPremium.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">per season</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Coverage Amount</p>
                        <p className="text-2xl font-semibold">
                          Rs. {result.coverageAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            Comprehensive coverage
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            24-hour claim processing
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            Free advisory services
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {result.recommendedPlans.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Plans</CardTitle>
                      <CardDescription>
                        Based on your requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.recommendedPlans.map((plan) => (
                        <div
                          key={plan._id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <div className="flex gap-1 mt-1">
                              {plan.cropTypes.slice(0, 2).map((crop) => (
                                <Badge key={crop} variant="secondary" className="text-xs">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/plans/${plan._id}`}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button asChild className="flex-1">
                    <Link href="/signup">Buy Now</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/advisor">Talk to Advisor</Link>
                  </Button>
                </div>
              </>
            ) : (
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Fill in your farm details to get an instant quote
                    </p>
                    {preselectedPlan && (
                      <p className="text-sm text-primary mt-2">
                        Quote will include your selected plan
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
