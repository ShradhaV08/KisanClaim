import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, TrendingUp, Clock } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Trusted by 50,000+ farmers across India
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Protect Your Harvest with
              <span className="text-primary"> Smart Insurance</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              AI-powered crop insurance designed for Indian farmers. Get instant quotes, 
              easy claims, and comprehensive coverage for your agricultural investments.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base">
                <Link href="/quote">
                  Get Free Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/plans">View Plans</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="h-5 w-5" />
                  <span className="text-2xl font-bold">100%</span>
                </div>
                <span className="text-sm text-muted-foreground">Claim Success</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-2xl font-bold">50K+</span>
                </div>
                <span className="text-sm text-muted-foreground">Active Policies</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="h-5 w-5" />
                  <span className="text-2xl font-bold">24hr</span>
                </div>
                <span className="text-sm text-muted-foreground">Claim Processing</span>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-6">
                    <svg className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Nationwide Coverage</h3>
                  <p className="text-muted-foreground">Protecting crops across all Indian states</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-card p-4 shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Claim Approved</p>
                  <p className="text-xs text-muted-foreground">Rs. 45,000 credited</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
