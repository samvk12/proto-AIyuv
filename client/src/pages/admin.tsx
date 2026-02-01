import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Camera, 
  TrendingUp,
  BarChart3,
  Wind,
  Flame,
  Droplets
} from "lucide-react";
import type { AdminStats } from "@shared/schema";

// ========================
// SECTION 12: ADMIN / FOUNDER DASHBOARD
// Reference: Spec Section 12
// ========================

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <h1 className="text-2xl font-serif font-bold mb-8">Admin Dashboard</h1>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const totalDoshaPatterns = stats.doshaPatterns.vata + stats.doshaPatterns.pitta + stats.doshaPatterns.kapha || 1;

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform metrics and health insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card data-testid="card-user-count">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.userCount}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-advanced-triggers">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Advanced Input Triggers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.advancedInputTriggers}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-safety-flags">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Safety Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500">{stats.safetyFlags}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-completion-rate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.userCount > 0
                ? Math.round(((stats.userCount - stats.dropOffPoints.reduce((sum, d) => sum + d.count, 0)) / stats.userCount) * 100)
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dosha Patterns */}
        <Card data-testid="card-dosha-patterns">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Dosha Patterns
            </CardTitle>
            <CardDescription>Distribution of primary doshas detected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-500" />
                  <span>Vata</span>
                </div>
                <span className="font-medium">
                  {Math.round((stats.doshaPatterns.vata / totalDoshaPatterns) * 100)}%
                </span>
              </div>
              <Progress
                value={(stats.doshaPatterns.vata / totalDoshaPatterns) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>Pitta</span>
                </div>
                <span className="font-medium">
                  {Math.round((stats.doshaPatterns.pitta / totalDoshaPatterns) * 100)}%
                </span>
              </div>
              <Progress
                value={(stats.doshaPatterns.pitta / totalDoshaPatterns) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-green-500" />
                  <span>Kapha</span>
                </div>
                <span className="font-medium">
                  {Math.round((stats.doshaPatterns.kapha / totalDoshaPatterns) * 100)}%
                </span>
              </div>
              <Progress
                value={(stats.doshaPatterns.kapha / totalDoshaPatterns) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Common Symptoms */}
        <Card data-testid="card-common-symptoms">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Common Symptoms
            </CardTitle>
            <CardDescription>Top reported symptoms</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.commonSymptoms.length > 0 ? (
              <div className="space-y-3">
                {stats.commonSymptoms.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{item.symptom}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No symptom data available yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Drop-off Points */}
        <Card className="md:col-span-2" data-testid="card-drop-offs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Drop-off Analysis
            </CardTitle>
            <CardDescription>Where users exit the flow</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.dropOffPoints.length > 0 ? (
              <div className="space-y-3">
                {stats.dropOffPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-sm w-32 shrink-0">{point.stage}</span>
                    <Progress value={point.percentage} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {point.count} ({point.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No drop-off data available yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
