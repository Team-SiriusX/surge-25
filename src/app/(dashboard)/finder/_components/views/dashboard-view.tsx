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
import { Eye, Users, TrendingUp, Zap } from "lucide-react";
import { useGetDashboardStats } from "../../_api";
import { useMemo } from "react";
import { useSession } from "@/lib/auth-client";

const CATEGORY_COLORS: Record<string, string> = {
  ACADEMIC_PROJECT: "#0ea5e9",
  PART_TIME_JOB: "#10b981",
  STARTUP_COLLABORATION: "#8b5cf6",
  COMPETITION_HACKATHON: "#f59e0b",
  INTERNSHIP: "#ec4899",
  FREELANCE: "#06b6d4",
};

export function DashboardView() {
  const { data, isLoading } = useGetDashboardStats();
  const { data: session } = useSession();

  const dashboardData = data?.data;

  // Format category distribution for pie chart
  const categoryData = useMemo(() => {
    if (!dashboardData?.categoryDistribution) return [];

    return Object.entries(dashboardData.categoryDistribution)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({
        name: name
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")
          .trim(),
        value: count,
        color: CATEGORY_COLORS[name] || "#6b7280",
      }));
  }, [dashboardData?.categoryDistribution]);

  const dashboardStats = useMemo(() => {
    if (!dashboardData) return [];

    const { stats, changes } = dashboardData;

    return [
      {
        label: "Total Posts",
        value: stats.totalPosts.toString(),
        change: `+${changes.postsThisMonth} this month`,
        icon: Zap,
        color: "#064789",
      },
      {
        label: "Applications",
        value: stats.totalApplications.toString(),
        change: `+${changes.applicationsThisWeek} this week`,
        icon: Users,
        color: "#427aa1",
      },
      {
        label: "Total Views",
        value:
          stats.totalViews > 1000
            ? `${(stats.totalViews / 1000).toFixed(1)}k`
            : stats.totalViews.toString(),
        change: `+${changes.viewsToday} today`,
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
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          <div className="h-8 sm:h-10 bg-muted rounded w-2/3 sm:w-1/3" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 sm:h-32 bg-muted rounded" />
            ))}
          </div>
          <div className="h-64 sm:h-80 lg:h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Welcome back, {session?.user?.name || "User"}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Here&apos;s your recruitment overview
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: stat.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{stat.value}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Views & Applications Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Views & Applications Trend</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={dashboardData?.viewsAndApplicationsTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: `1px solid var(--border)`,
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="views" fill="var(--chart-1)" />
                <Bar dataKey="applications" fill="var(--chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Posts by Category</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Distribution of active posts</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200} className="sm:h-[250px] lg:h-[300px]">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
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
                      className="flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className="font-semibold">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[200px] sm:h-[250px] lg:h-[300px] text-muted-foreground text-sm">
                No posts yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
