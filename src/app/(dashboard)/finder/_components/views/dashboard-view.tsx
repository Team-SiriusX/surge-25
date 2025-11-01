"use client";

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
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Users, TrendingUp, Zap } from "lucide-react";
import { useGetJobs, useGetApplications } from "../../_api";
import { useMemo } from "react";

export function DashboardView() {
  const { data: jobsData, isLoading: jobsLoading } = useGetJobs();
  const { data: applicationsData, isLoading: applicationsLoading } =
    useGetApplications();

  const jobs = jobsData?.data || [];
  const applications = applicationsData?.data || [];

  // Calculate stats
  const stats = useMemo(() => {
    const totalPosts = jobs.length;
    const totalApplications = applications.length;
    const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
    const shortlisted = applications.filter(
      (app) => app.status === "SHORTLISTED"
    ).length;
    const conversionRate =
      totalApplications > 0
        ? ((shortlisted / totalApplications) * 100).toFixed(1)
        : 0;

    return {
      totalPosts,
      totalApplications,
      totalViews,
      shortlisted,
      conversionRate,
    };
  }, [jobs, applications]);

  // Calculate category distribution
  const categoryData = useMemo(() => {
    const categories: Record<string, { count: number; color: string }> = {
      ACADEMIC_PROJECT: { count: 0, color: "#0ea5e9" },
      PART_TIME_JOB: { count: 0, color: "#10b981" },
      STARTUP_COLLABORATION: { count: 0, color: "#8b5cf6" },
      COMPETITION_HACKATHON: { count: 0, color: "#f59e0b" },
      TEAM_SEARCH: { count: 0, color: "#ec4899" },
    };

    jobs.forEach((job) => {
      if (categories[job.type]) {
        categories[job.type].count++;
      }
    });

    return Object.entries(categories)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name: name
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")
          .trim(),
        value: data.count,
        color: data.color,
      }));
  }, [jobs]);

  // Mock chart data - In a real app, you'd calculate this from historical data
  const viewsChart = [
    { name: "Mon", views: 120, applications: 24 },
    { name: "Tue", views: 150, applications: 32 },
    { name: "Wed", views: 200, applications: 45 },
    { name: "Thu", views: 180, applications: 38 },
    { name: "Fri", views: 250, applications: 52 },
    { name: "Sat", views: 180, applications: 35 },
    { name: "Sun", views: 140, applications: 28 },
  ];

  const dashboardStats = [
    {
      label: "Total Posts",
      value: stats.totalPosts.toString(),
      change: "+2 this month",
      icon: Zap,
      color: "#064789",
    },
    {
      label: "Applications",
      value: stats.totalApplications.toString(),
      change: "+12 this week",
      icon: Users,
      color: "#427aa1",
    },
    {
      label: "Total Views",
      value:
        stats.totalViews > 1000
          ? `${(stats.totalViews / 1000).toFixed(1)}k`
          : stats.totalViews.toString(),
      change: "+380 today",
      icon: Eye,
      color: "#2b91f6",
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted.toString(),
      change: `${stats.conversionRate}% conversion`,
      icon: TrendingUp,
      color: "#10b981",
    },
  ];

  if (jobsLoading || applicationsLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }
  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, John!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's your recruitment overview
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
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
              <BarChart data={viewsChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: `1px solid var(--border)`,
                  }}
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
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-semibold">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No posts yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
