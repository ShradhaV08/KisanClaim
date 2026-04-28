import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, ArrowRight } from 'lucide-react'
import type { Plan } from '@/types'

interface PlanCardProps {
  plan: Plan
  showDetails?: boolean
}

export function PlanCard({ plan, showDetails = true }: PlanCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription className="mt-2 text-pretty">
              {plan.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Premium Range</p>
          <p className="text-2xl font-bold text-primary">
            Rs. {plan.premiumRange.min.toLocaleString()} - Rs. {plan.premiumRange.max.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">per season</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Coverage Amount</p>
          <p className="text-lg font-semibold">
            Up to Rs. {plan.coverageAmount.toLocaleString()}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Crops Covered</p>
          <div className="flex flex-wrap gap-1">
            {plan.cropTypes.slice(0, 3).map((crop) => (
              <Badge key={crop} variant="secondary" className="text-xs">
                {crop}
              </Badge>
            ))}
            {plan.cropTypes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{plan.cropTypes.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Key Benefits</p>
            <ul className="space-y-1">
              {plan.benefits.slice(0, 4).map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/plans/${plan._id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/quote?plan=${plan._id}`}>Get Quote</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
