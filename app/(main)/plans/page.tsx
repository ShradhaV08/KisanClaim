'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { PlanCard } from '@/components/plans/plan-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Filter } from 'lucide-react'
import { CROP_TYPES, INDIAN_STATES } from '@/lib/constants'
import type { Plan } from '@/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PlansPage() {
  const [cropFilter, setCropFilter] = useState<string>('')
  const [regionFilter, setRegionFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const queryParams = new URLSearchParams()
  if (cropFilter) queryParams.set('cropType', cropFilter)
  if (regionFilter) queryParams.set('region', regionFilter)

  const { data, isLoading, error } = useSWR<{ plans: Plan[] }>(
    `/api/plans?${queryParams.toString()}`,
    fetcher
  )

  const filteredPlans = data?.plans.filter((plan) => {
    if (!searchQuery) return true
    return (
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const clearFilters = () => {
    setCropFilter('')
    setRegionFilter('')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Insurance Plans
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Find the perfect coverage for your crops and farm
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search plans..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={cropFilter} onValueChange={setCropFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Crop Type" />
              </SelectTrigger>
              <SelectContent>
                {CROP_TYPES.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(cropFilter || regionFilter || searchQuery) && (
              <Button variant="ghost" onClick={clearFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border border-border p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load plans. Please try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : filteredPlans?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No plans found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans?.map((plan) => (
              <PlanCard key={plan._id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
