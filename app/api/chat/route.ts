import { NextResponse } from 'next/server'

// Offline chatbot responses for agricultural insurance queries
const responses: Record<string, string> = {
  default: `Namaste! I'm KisanMitra, your agricultural insurance assistant. I can help you with:

🌾 **Insurance Plans** - We offer Basic, Premium, and Gold plans
💰 **Premium Quotes** - Get instant estimates for your farm
📝 **Claims Process** - File and track your claims
🤝 **Expert Advice** - Connect with our advisors

How can I help you today?`,
  plan: `We offer 6 insurance plans:

1. **Kisan Suraksha Basic** (₹1,500-5,000/year) - Coverage up to ₹50,000
   Best for: Small farmers growing Rice, Wheat, Pulses, Maize

2. **Kisan Suraksha Premium** (₹5,000-15,000/year) - Coverage up to ₹1,50,000
   Best for: Progressive farmers with multiple crops

3. **Kisan Suraksha Gold** (₹10,000-30,000/year) - Coverage up to ₹3,00,000
   Best for: Maximum protection with income guarantee

4. **Cotton Shield Plus** - Specialized for cotton farmers
5. **Horticulture Care** - For fruit & vegetable growers
6. **Sugarcane Secure** - For sugarcane cultivators

Visit our Plans page to compare them in detail!`,
  claim: `Here's how to file a claim:

1. **Report Promptly** - File within 15 days of the incident
2. **Go to Dashboard** → My Claims → File New Claim
3. **Select your policy** and claim type (crop damage, weather, pest, etc.)
4. **Describe the damage** in detail with estimated loss
5. **Upload evidence** - photos, weather reports, etc.

Claims are typically processed within 24-48 hours. You can track status in your dashboard.`,
  premium: `Premium is calculated based on:
- **Crop type** - Higher risk crops cost more
- **Land size** - Larger areas = higher premiums
- **Region** - Based on local risk factors
- **Irrigation** - Rainfed farms have 20% higher premiums
- **Claim history** - Previous claims may increase rates

Use our **Quote Calculator** to get an instant estimate!`,
  help: `I'm here to help! You can ask me about:
- 📋 Insurance plans and coverage
- 💰 Premium calculation
- 📝 How to file a claim
- 📊 Claim status and tracking
- 🌾 Crop-specific recommendations
- 📞 Contact our support team

For urgent assistance, call our 24/7 helpline or visit the Advisor page.`,
}

function getResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('plan') || lower.includes('coverage') || lower.includes('insurance')) {
    return responses.plan
  }
  if (lower.includes('claim') || lower.includes('file') || lower.includes('damage')) {
    return responses.claim
  }
  if (lower.includes('premium') || lower.includes('cost') || lower.includes('price') || lower.includes('quote')) {
    return responses.premium
  }
  if (lower.includes('help') || lower.includes('support') || lower.includes('contact')) {
    return responses.help
  }
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('namaste') || lower.includes('hey')) {
    return responses.default
  }
  return responses.default
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]
    const userContent = typeof lastMessage.content === 'string'
      ? lastMessage.content
      : lastMessage.content?.map((p: { text?: string }) => p.text || '').join(' ') || ''

    const reply = getResponse(userContent)

    // Return as a streaming-compatible response for the AI SDK useChat hook
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Format compatible with AI SDK's UIMessageStreamResponse
        const data = `0:${JSON.stringify(reply)}\n`
        controller.enqueue(encoder.encode(data))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Chat unavailable' },
      { status: 500 }
    )
  }
}
