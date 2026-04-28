import { NextResponse } from "next/server"
import { db } from "@/lib/sample-data"

export async function POST(req: Request) {
  try {
    const { farmData } = await req.json()
    
    const { location, cropType, farmSize, irrigationType, previousClaims, budget } = farmData

    // Find matching plans from in-memory data
    const allPlans = db.plans.findAll({ isActive: true })
    const matchingPlans = allPlans.filter(plan => 
      plan.cropTypes.includes(cropType) || plan.cropTypes.length > 4
    )

    // Calculate match scores based on farm profile
    const scoredPlans = matchingPlans.map(plan => {
      let score = 50 // base score

      // Crop match
      if (plan.cropTypes.includes(cropType)) score += 20

      // Region match
      if (plan.regions.includes(location) || plan.regions.includes('All India')) score += 15

      // Budget match
      const monthlyPremium = plan.premiumRange.min / 12
      if (budget && monthlyPremium <= budget) score += 10

      // Farm size appropriateness
      if (farmSize <= 5 && plan.premiumRange.max <= 10000) score += 5
      if (farmSize > 5 && plan.coverageAmount >= 100000) score += 5

      return { plan, score: Math.min(score, 98) }
    }).sort((a, b) => b.score - a.score)

    const topPlan = scoredPlans[0]
    const alternatives = scoredPlans.slice(1, 3)

    const reasons = [
      `Covers ${cropType} cultivation in your region`,
      `Coverage amount of ₹${topPlan.plan.coverageAmount.toLocaleString()} suits your ${farmSize}-acre farm`,
      irrigationType === 'rainfed' 
        ? 'Includes drought protection for rainfed farming' 
        : 'Comprehensive coverage for irrigated farmland',
      previousClaims > 0 
        ? 'Good claim support history for farmers with prior claims'
        : 'No claim history makes you eligible for better rates',
    ]

    const tips = [
      'Consider installing weather monitoring equipment for faster claim processing',
      'Maintain detailed crop logs to strengthen any future claims',
      'Review your coverage before each growing season',
      irrigationType === 'rainfed' 
        ? 'Consider rainwater harvesting to reduce risk premium over time'
        : 'Ensure your irrigation system is well-maintained to prevent losses',
    ]

    return NextResponse.json({
      recommendation: {
        recommendedPlan: topPlan.plan.name,
        matchScore: topPlan.score,
        reasons,
        alternatives: alternatives.map(alt => ({
          planName: alt.plan.name,
          matchScore: alt.score,
          reason: `${alt.plan.description.slice(0, 80)}...`,
        })),
        tips,
      }
    })
  } catch (error) {
    console.error("Recommendation error:", error)
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    )
  }
}
