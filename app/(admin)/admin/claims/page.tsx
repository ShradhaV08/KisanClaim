"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, CheckCircle, XCircle, AlertTriangle, FileText, Calendar } from "lucide-react"
import type { Claim } from "@/types"

const fetcher = (url: string) => fetch(url).then(res => res.json())

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  paid: "bg-emerald-100 text-emerald-800",
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid",
}

export default function AdminClaimsPage() {
  const { data, isLoading } = useSWR<{ claims: Claim[] }>("/api/claims?all=true", fetcher)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve")
  const [reviewNotes, setReviewNotes] = useState("")
  const [approvedAmount, setApprovedAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const claims = data?.claims || []

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim._id?.toLowerCase().includes(search.toLowerCase()) ||
      claim.damageType.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleReview = async () => {
    if (!selectedClaim) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/claims/${selectedClaim._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: reviewAction === "approve" ? "approved" : "rejected",
          adminNotes: reviewNotes,
          approvedAmount: reviewAction === "approve" ? Number(approvedAmount) : 0,
        }),
      })

      if (response.ok) {
        mutate("/api/claims?all=true")
        setReviewDialogOpen(false)
        setSelectedClaim(null)
        setReviewNotes("")
        setApprovedAmount("")
      }
    } catch (error) {
      console.error("Failed to update claim:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openReviewDialog = (claim: Claim, action: "approve" | "reject") => {
    setSelectedClaim(claim)
    setReviewAction(action)
    setApprovedAmount(action === "approve" ? claim.estimatedLoss.toString() : "")
    setReviewDialogOpen(true)
  }

  const pendingCount = claims.filter(c => c.status === "pending" || c.status === "under_review").length
  const approvedCount = claims.filter(c => c.status === "approved" || c.status === "paid").length
  const rejectedCount = claims.filter(c => c.status === "rejected").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Claims Management</h1>
        <p className="text-muted-foreground mt-1">Review and process insurance claims</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claims.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Claims</CardTitle>
          <CardDescription>Review and manage submitted insurance claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search claims..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading claims...</div>
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No claims found</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Damage Type</TableHead>
                    <TableHead>Est. Loss</TableHead>
                    <TableHead>Fraud Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim._id}>
                      <TableCell className="font-mono text-sm">
                        {claim._id?.slice(-8)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(claim.incidentDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{claim.damageType.replace("_", " ")}</TableCell>
                      <TableCell>Rs. {claim.estimatedLoss.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            claim.fraudScore && claim.fraudScore > 70 
                              ? "border-red-500 text-red-700" 
                              : claim.fraudScore && claim.fraudScore > 40 
                              ? "border-yellow-500 text-yellow-700"
                              : "border-green-500 text-green-700"
                          }
                        >
                          {claim.fraudScore || 0}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[claim.status]}>
                          {statusLabels[claim.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedClaim(claim)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(claim.status === "pending" || claim.status === "under_review") && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => openReviewDialog(claim, "approve")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => openReviewDialog(claim, "reject")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claim Detail Dialog */}
      <Dialog open={!!selectedClaim && !reviewDialogOpen} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
            <DialogDescription>
              Claim ID: {selectedClaim?._id?.slice(-8)}
            </DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Damage Type</Label>
                  <p className="font-medium capitalize">{selectedClaim.damageType.replace("_", " ")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Incident Date</Label>
                  <p className="font-medium">{new Date(selectedClaim.incidentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estimated Loss</Label>
                  <p className="font-medium">Rs. {selectedClaim.estimatedLoss.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Affected Area</Label>
                  <p className="font-medium">{selectedClaim.affectedArea} acres</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={statusColors[selectedClaim.status]}>
                    {statusLabels[selectedClaim.status]}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fraud Score</Label>
                  <Badge 
                    variant="outline"
                    className={
                      selectedClaim.fraudScore && selectedClaim.fraudScore > 70 
                        ? "border-red-500 text-red-700" 
                        : selectedClaim.fraudScore && selectedClaim.fraudScore > 40 
                        ? "border-yellow-500 text-yellow-700"
                        : "border-green-500 text-green-700"
                    }
                  >
                    {selectedClaim.fraudScore || 0}% Risk
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1 p-3 bg-muted rounded-lg">{selectedClaim.description}</p>
              </div>
              {selectedClaim.adminNotes && (
                <div>
                  <Label className="text-muted-foreground">Admin Notes</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedClaim.adminNotes}</p>
                </div>
              )}
              {selectedClaim.approvedAmount !== undefined && selectedClaim.approvedAmount > 0 && (
                <div>
                  <Label className="text-muted-foreground">Approved Amount</Label>
                  <p className="font-medium text-green-600">Rs. {selectedClaim.approvedAmount.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? "Approve Claim" : "Reject Claim"}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approve" 
                ? "Enter the approved amount and any notes for this claim."
                : "Please provide a reason for rejecting this claim."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {reviewAction === "approve" && (
              <div className="space-y-2">
                <Label htmlFor="amount">Approved Amount (Rs.)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                  placeholder="Enter approved amount"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={reviewAction === "approve" 
                  ? "Add any notes for the claimant..."
                  : "Explain the reason for rejection..."}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReview}
              disabled={isSubmitting || (reviewAction === "reject" && !reviewNotes)}
              className={reviewAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isSubmitting ? "Processing..." : reviewAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
