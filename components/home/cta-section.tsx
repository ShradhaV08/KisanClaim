import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Phone } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
              Ready to Protect Your Farm?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 text-pretty">
              Get your personalized quote in under 2 minutes. No commitments, no hidden fees.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" asChild className="text-base">
                <Link href="/quote">
                  Get Free Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                <Link href="/advisor">
                  <Phone className="mr-2 h-4 w-4" />
                  Talk to Expert
                </Link>
              </Button>
            </div>
          </div>

          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 opacity-20"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#fff" />
                <stop offset={1} stopColor="#fff" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}
