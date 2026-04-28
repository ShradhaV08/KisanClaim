import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    quote: "KisanClaim helped me recover from the devastating floods last monsoon. The claim process was smooth and I received my payout within 48 hours.",
    author: "Rajesh Kumar",
    role: "Rice Farmer, Punjab",
    initials: "RK",
  },
  {
    quote: "The AI recommendations helped me choose the right plan for my cotton farm. Now I have peace of mind knowing my crops are protected.",
    author: "Lakshmi Devi",
    role: "Cotton Farmer, Gujarat",
    initials: "LD",
  },
  {
    quote: "I was skeptical about online insurance but the advisor explained everything clearly. Best decision I made for my orchard.",
    author: "Mohammad Ali",
    role: "Fruit Farmer, Maharashtra",
    initials: "MA",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Trusted by Farmers Across India
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from farmers who have benefited from our insurance solutions.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="inline-block h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 text-pretty">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
