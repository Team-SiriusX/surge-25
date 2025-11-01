"use client"

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Users, TrendingUp, Zap } from "lucide-react"

const dashboardData = {
  stats: [
    { label: "Total Posts", value: "12", change: "+2 this month", icon: Zap, color: "#064789" },
    { label: "Applications", value: "48", change: "+12 this week", icon: Users, color: "#427aa1" },
    { label: "Total Views", value: "2.4k", change: "+380 today", icon: Eye, color: "#2b91f6" },
    { label: "Shortlisted", value: "18", change: "37.5% conversion", icon: TrendingUp, color: "#10b981" },
  ],
  viewsChart: [
    { name: "Mon", views: 120, applications: 24 },
    { name: "Tue", views: 150, applications: 32 },
    { name: "Wed", views: 200, applications: 45 },
    { name: "Thu", views: 180, applications: 38 },
    { name: "Fri", views: 250, applications: 52 },
    { name: "Sat", views: 180, applications: 35 },
    { name: "Sun", views: 140, applications: 28 },
  ],
  categoryData: [
    { name: "Projects", value: 35, color: "#0ea5e9" },
    { name: "Jobs", value: 28, color: "#10b981" },
    { name: "Startups", value: 20, color: "#8b5cf6" },
    { name: "Competitions", value: 12, color: "#f59e0b" },
    { name: "Teams", value: 5, color: "#ec4899" },
  ],
}

export function DashboardView({ onCreatePost }: { onCreatePost: () => void }) {
  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Welcome back, John!</h1>
          <p className="text-muted-foreground mt-2">Here's your recruitment overview</p>
        </div>
        <Button onClick={onCreatePost} size="lg" className="gap-2">
          <Zap className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views & Applications Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Views & Applications Trend</CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.viewsChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Legend />
                <Bar dataKey="views" fill="var(--chart-1)" />
                <Bar dataKey="applications" fill="var(--chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Posts by Category</CardTitle>
            <CardDescription>Distribution of active posts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dashboardData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {dashboardData.categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-semibold">{cat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
