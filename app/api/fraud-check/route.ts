import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { claimData } = await req.json()

    const {
      damageType,
      incidentDate,
      description,
      estimatedLoss,
      affectedArea,
      farmSize,
      previousClaims,
      policyStartDate,
    } = claimData

    let fraudScore = 10 // Start with low risk
    const flags: { type: string; severity: 'info' | 'warning' | 'critical'; description: string }[] = []

    // Check days since policy start
    const daysSincePolicyStart = Math.floor(
      (new Date(incidentDate).getTime() - new Date(policyStartDate).getTime()) /
      (1000 * 60 * 60 * 24)
    )

    if (daysSincePolicyStart < 30) {
      fraudScore += 25
      flags.push({
        type: 'early_claim',
        severity: 'warning',
        description: `Claim filed only ${daysSincePolicyStart} days after policy purchase`,
      })
    } else if (daysSincePolicyStart < 90) {
      fraudScore += 10
      flags.push({
        type: 'relatively_early_claim',
        severity: 'info',
        description: 'Claim filed within first 3 months of policy',
      })
    }

    // Check affected area ratio
    if (farmSize && affectedArea) {
      const ratio = affectedArea / farmSize
      if (ratio > 0.9) {
        fraudScore += 15
        flags.push({
          type: 'high_damage_ratio',
          severity: 'warning',
          description: `${Math.round(ratio * 100)}% of total farm area reported as damaged`,
        })
      }
    }

    // Check previous claims
    if (previousClaims > 3) {
      fraudScore += 20
      flags.push({
        type: 'frequent_claims',
        severity: 'warning',
        description: `${previousClaims} previous claims on record`,
      })
    } else if (previousClaims > 1) {
      fraudScore += 5
      flags.push({
        type: 'multiple_claims',
        severity: 'info',
        description: `${previousClaims} previous claims on record`,
      })
    }

    // Check claim amount
    if (estimatedLoss > 100000) {
      fraudScore += 10
      flags.push({
        type: 'high_value_claim',
        severity: 'info',
        description: `High value claim of ₹${estimatedLoss.toLocaleString()}`,
      })
    }

    // Check description quality
    if (description && description.length < 20) {
      fraudScore += 10
      flags.push({
        type: 'vague_description',
        severity: 'warning',
        description: 'Claim description is too brief for proper assessment',
      })
    }

    // Cap score
    fraudScore = Math.min(fraudScore, 95)

    // Determine risk level and recommendation
    let riskLevel: 'low' | 'medium' | 'high'
    let recommendation: 'auto_approve' | 'manual_review' | 'reject'
    let explanation: string

    if (fraudScore <= 25) {
      riskLevel = 'low'
      recommendation = 'auto_approve'
      explanation = 'Low risk profile. Claim appears legitimate based on automated checks.'
    } else if (fraudScore <= 60) {
      riskLevel = 'medium'
      recommendation = 'manual_review'
      explanation = 'Moderate risk indicators detected. Manual verification recommended before processing.'
    } else {
      riskLevel = 'high'
      recommendation = 'reject'
      explanation = 'Multiple high-risk indicators detected. Detailed investigation recommended.'
    }

    return NextResponse.json({
      analysis: {
        fraudScore,
        riskLevel,
        flags,
        recommendation,
        explanation,
      }
    })
  } catch (error) {
    console.error("Fraud check error:", error)
    return NextResponse.json({
      analysis: {
        fraudScore: 15,
        riskLevel: "low",
        flags: [],
        recommendation: "manual_review",
        explanation: "Automated analysis unavailable. Manual review recommended.",
      }
    })
  }
}
