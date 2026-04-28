import { Hero } from '@/components/home/hero'
import { Features } from '@/components/home/features'
import { Testimonials } from '@/components/home/testimonials'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <CtaSection />
    </>
  )
}
