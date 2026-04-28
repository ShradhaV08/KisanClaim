import { NextResponse } from 'next/server'
import { db } from '@/lib/sample-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cropType, landSize, region, irrigationType, previousClaims = 0 } = body

    if (!cropType || !landSize || !region) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const plans = db.plans.findAll({
      isActive: true,
      cropTypes: { $in: [cropType] },
      regions: { $in: [region] },
    })

    let basePremium = landSize * 500

    if (irrigationType === 'rainfed') {
      basePremium *= 1.2
    }

    if (previousClaims > 0) {
      basePremium *= 1 + previousClaims * 0.1
    }

    const cropMultipliers: Record<string, number> = {
      Rice: 1.0,
      Wheat: 0.9,
      Cotton: 1.3,
      Sugarcane: 1.1,
      Vegetables: 1.4,
      Fruits: 1.5,
      Pulses: 0.8,
      Oilseeds: 1.0,
      Maize: 0.95,
      Spices: 1.6,
    }

    basePremium *= cropMultipliers[cropType] || 1.0

    const estimatedPremium = Math.round(basePremium)
    const coverageAmount = Math.round(estimatedPremium * 10)

    const recommendedPlans = plans.slice(0, 3).map((plan) => ({
      _id: plan._id,
      name: plan.name,
      description: plan.description,
      cropTypes: plan.cropTypes,
      regions: plan.regions,
      premiumRange: plan.premiumRange,
      coverageAmount: plan.coverageAmount,
      benefits: plan.benefits,
      duration: plan.duration,
    }))

    return NextResponse.json({
      estimatedPremium,
      coverageAmount,
      recommendedPlans,
    })
  } catch (error) {
    console.error('Quote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
