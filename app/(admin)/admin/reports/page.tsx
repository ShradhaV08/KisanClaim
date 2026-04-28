"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, TrendingUp, Users, FileText, IndianRupee } from "lucide-react"
import { useState } from "react"
import useSWR from "swr"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts"

const fetcher = (url: string) => fetch(url).then(res => res.json())

const COLORS = ["#166534", "#22c55e", "#84cc16", "#eab308", "#f97316"]

const monthlyData = [
  { month: "Jan", claims: 45, premiums: 125000, payouts: 85000 },
  { month: "Feb", claims: 52, premiums: 132000, payouts: 92000 },
  { month: "Mar", claims: 38, premiums: 118000, payouts: 68000 },
  { month: "Apr", claims: 65, premiums: 145000, payouts: 120000 },
  { month: "May", claims: 78, premiums: 158000, payouts: 145000 },
  { month: "Jun", claims: 42, premiums: 128000, payouts: 78000 },
]

const damageTypeData = [
  { name: "Drought", value: 35 },
  { name: "Flood", value: 25 },
  { name: "Pest Attack", value: 20 },
  { name: "Disease", value: 12 },
  { name: "Other", value: 8 },
]

const regionData = [
  { region: "Punjab", policies: 450, claims: 89 },
  { region: "Maharashtra", policies: 380, claims: 72 },
  { region: "UP", policies: 520, claims: 98 },
  { region: "MP", policies: 290, claims: 56 },
  { region: "Rajasthan", policies: 340, claims: 78 },
]

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("6months")
  const { data: usersData } = useSWR("/api/users", fetcher)
  const { data: claimsData } = useSWR("/api/claims?all=true", fetcher)
  const { data: plansData } = useSWR("/api/plans", fetcher)

  const totalUsers = usersData?.users?.length || 0
  const totalClaims = claimsData?.claims?.length || 0
  const totalPlans = plansData?.plans?.length || 0
  const approvedClaims = claimsData?.claims?.filter((c: { status: string }) => c.status === "approved" || c.status === "paid").length || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights into insurance operations</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 8,06,000</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered farmers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClaims}</div>
            <p className="text-xs text-muted-foreground mt-1">{approvedClaims} approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claim Ratio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalClaims > 0 ? Math.round((approvedClaims / totalClaims) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Approval rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Claims & Revenue Trend</CardTitle>
            <CardDescription>Monthly claims count and premium collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="claims" 
                    stroke="#166534" 
                    strokeWidth={2}
                    name="Claims"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="premiums" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Premiums (Rs.)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claims by Damage Type</CardTitle>
            <CardDescription>Distribution of claims across damage categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={damageTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {damageTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Policies and claims distribution by state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="region" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="policies" fill="#166534" name="Active Policies" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="claims" fill="#22c55e" name="Total Claims" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats Summary</CardTitle>
          <CardDescription>Key performance indicators for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Average Claim Value</p>
              <p className="text-2xl font-bold mt-1">Rs. 45,200</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Average Processing Time</p>
              <p className="text-2xl font-bold mt-1">4.2 Days</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
              <p className="text-2xl font-bold mt-1">94%</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Active Plans</p>
              <p className="text-2xl font-bold mt-1">{totalPlans}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
