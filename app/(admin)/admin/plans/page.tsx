'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { 
  Plus,
  FileText,
  Pencil,
  Trash2
} from 'lucide-react'
import type { Plan } from '@/types'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const defaultPlanForm = {
  name: '',
  description: '',
  cropTypes: '',
  regions: '',
  premiumMin: '',
  premiumMax: '',
  coverageAmount: '',
  benefits: '',
  terms: '',
  duration: '12',
  isActive: true,
}

export default function AdminPlansPage() {
  const { data, isLoading, mutate } = useSWR<{ plans: Plan[] }>(
    '/api/plans?activeOnly=false',
    fetcher
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState(defaultPlanForm)

  const openCreateDialog = () => {
    setEditingPlan(null)
    setFormData(defaultPlanForm)
    setIsDialogOpen(true)
  }

  const openEditDialog = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      cropTypes: plan.cropTypes.join(', '),
      regions: plan.regions.join(', '),
      premiumMin: plan.premiumRange.min.toString(),
      premiumMax: plan.premiumRange.max.toString(),
      coverageAmount: plan.coverageAmount.toString(),
      benefits: plan.benefits.join('\n'),
      terms: plan.terms,
      duration: plan.duration.toString(),
      isActive: plan.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const planData = {
      name: formData.name,
      description: formData.description,
      cropTypes: formData.cropTypes.split(',').map((s) => s.trim()),
      regions: formData.regions.split(',').map((s) => s.trim()),
      premiumRange: {
        min: parseInt(formData.premiumMin),
        max: parseInt(formData.premiumMax),
      },
      coverageAmount: parseInt(formData.coverageAmount),
      benefits: formData.benefits.split('\n').filter((s) => s.trim()),
      terms: formData.terms,
      duration: parseInt(formData.duration),
      isActive: formData.isActive,
    }

    try {
      const url = editingPlan
        ? `/api/plans/${editingPlan._id}`
        : '/api/plans'
      const method = editingPlan ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      })

      if (!res.ok) throw new Error('Failed to save')

      await mutate()
      toast.success(editingPlan ? 'Plan updated successfully' : 'Plan created successfully')
      setIsDialogOpen(false)
    } catch {
      toast.error('Failed to save plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      const res = await fetch(`/api/plans/${planId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      await mutate()
      toast.success('Plan deleted successfully')
    } catch {
      toast.error('Failed to delete plan')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plans Management</h1>
          <p className="text-muted-foreground">
            Create and manage insurance plans
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </DialogTitle>
              <DialogDescription>
                {editingPlan
                  ? 'Update the insurance plan details'
                  : 'Add a new insurance plan to the platform'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cropTypes">Crop Types (comma-separated)</Label>
                  <Input
                    id="cropTypes"
                    placeholder="Rice, Wheat, Cotton"
                    value={formData.cropTypes}
                    onChange={(e) =>
                      setFormData({ ...formData, cropTypes: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regions">Regions (comma-separated)</Label>
                  <Input
                    id="regions"
                    placeholder="Maharashtra, Gujarat"
                    value={formData.regions}
                    onChange={(e) =>
                      setFormData({ ...formData, regions: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="premiumMin">Min Premium (Rs.)</Label>
                  <Input
                    id="premiumMin"
                    type="number"
                    value={formData.premiumMin}
                    onChange={(e) =>
                      setFormData({ ...formData, premiumMin: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premiumMax">Max Premium (Rs.)</Label>
                  <Input
                    id="premiumMax"
                    type="number"
                    value={formData.premiumMax}
                    onChange={(e) =>
                      setFormData({ ...formData, premiumMax: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverageAmount">Coverage (Rs.)</Label>
                  <Input
                    id="coverageAmount"
                    type="number"
                    value={formData.coverageAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, coverageAmount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea
                  id="benefits"
                  rows={4}
                  placeholder="Flood protection&#10;Drought coverage&#10;Pest damage coverage"
                  value={formData.benefits}
                  onChange={(e) =>
                    setFormData({ ...formData, benefits: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) =>
                    setFormData({ ...formData, terms: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex items-center gap-3 pt-8">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
                      Saving...
                    </>
                  ) : editingPlan ? (
                    'Update Plan'
                  ) : (
                    'Create Plan'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : data?.plans.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No plans created yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Crops</TableHead>
                  <TableHead>Premium Range</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.plans.map((plan) => (
                  <TableRow key={plan._id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {plan.cropTypes.slice(0, 2).map((crop) => (
                          <Badge key={crop} variant="secondary" className="text-xs">
                            {crop}
                          </Badge>
                        ))}
                        {plan.cropTypes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{plan.cropTypes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      Rs. {plan.premiumRange.min.toLocaleString()} - Rs.{' '}
                      {plan.premiumRange.max.toLocaleString()}
                    </TableCell>
                    <TableCell>Rs. {plan.coverageAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(plan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(plan._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
