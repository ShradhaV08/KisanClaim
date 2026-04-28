'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Phone, Mail, Clock, CheckCircle, Users, MessageSquare } from 'lucide-react'
import { INDIAN_STATES } from '@/lib/constants'
import { toast } from 'sonner'

const advisors = [
  {
    name: 'Priya Sharma',
    specialization: 'Rice & Wheat Insurance',
    experience: '8 years',
    languages: ['Hindi', 'English', 'Punjabi'],
    rating: 4.9,
  },
  {
    name: 'Suresh Patel',
    specialization: 'Cotton & Cash Crops',
    experience: '12 years',
    languages: ['Hindi', 'Gujarati', 'English'],
    rating: 4.8,
  },
  {
    name: 'Anita Reddy',
    specialization: 'Fruits & Vegetables',
    experience: '6 years',
    languages: ['Telugu', 'Kannada', 'English'],
    rating: 4.9,
  },
]

export default function AdvisorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    preferredTime: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
    toast.success('Callback request submitted! An advisor will contact you soon.')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Talk to an Expert</h1>
              <p className="text-muted-foreground">
                Get personalized guidance from our insurance advisors
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Expert Advisors</CardTitle>
                <CardDescription>
                  Specialists in agricultural insurance with regional expertise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {advisors.map((advisor) => (
                  <div
                    key={advisor.name}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-semibold text-primary">
                        {advisor.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{advisor.name}</p>
                        <div className="flex items-center gap-1 text-sm">
                          <svg
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{advisor.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {advisor.specialization}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{advisor.experience} experience</span>
                        <span>{advisor.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Phone className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-muted-foreground">1800-XXX-XXXX (Toll Free)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Mail className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@kisanclaim.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Working Hours</p>
                    <p className="text-sm text-muted-foreground">Mon-Sat, 9 AM - 7 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">AI Chatbot</p>
                    <p className="text-sm text-muted-foreground">Available 24/7 in your dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Request a Callback</CardTitle>
              <CardDescription>
                Fill in your details and our advisor will call you back
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Request Submitted!</h3>
                  <p className="text-muted-foreground mb-4">
                    One of our advisors will contact you within 24 hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        setFormData({ ...formData, state: value })
                      }
                      required
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Call Time</Label>
                    <Select
                      value={formData.preferredTime}
                      onValueChange={(value) =>
                        setFormData({ ...formData, preferredTime: value })
                      }
                      required
                    >
                      <SelectTrigger id="preferredTime">
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                        <SelectItem value="evening">Evening (4 PM - 7 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Any specific questions or requirements?"
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Spinner className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Request Callback'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
