import { 
  Shield, 
  Zap, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  FileCheck 
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Shield,
    title: 'Comprehensive Coverage',
    description: 'Protection against floods, droughts, pests, and diseases. All major crops covered across India.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Recommendations',
    description: 'Our smart system analyzes your farm data to suggest the perfect insurance plan for your needs.',
  },
  {
    icon: MessageSquare,
    title: 'Instant Support',
    description: 'AI chatbot available to answer your questions and dedicated agents for complex queries.',
  },
  {
    icon: TrendingUp,
    title: 'Quick Claims',
    description: 'File claims online and get payouts within 24-48 hours. No lengthy paperwork required.',
  },
  {
    icon: Users,
    title: 'Expert Advisors',
    description: 'Connect with agricultural insurance experts who understand your local conditions.',
  },
  {
    icon: FileCheck,
    title: 'Transparent Process',
    description: 'Track your policy and claims in real-time. No hidden terms or surprise deductions.',
  },
]

export function Features() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Why Farmers Choose KisanClaim
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            We combine traditional insurance expertise with modern technology to give you the best protection for your crops.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
