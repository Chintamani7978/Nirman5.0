import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CheckCircle, Clock, List } from "lucide-react";
import ModerationQueue from "@/components/ModerationQueue";
import AIInsights from "@/components/ministry/AIInsights";
import CivicGraphExplorer from "@/components/CivicGraphExplorer";

interface DashboardStats {
  total_problems: number;
  problems_by_status: { status: string; count: number }[];
  top_category: string;
}

const MinistryDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.rpc("get_ministry_dashboard_stats");

      if (error) {
        console.error("Error fetching dashboard stats:", error);
      } else {
        try {
          // If data is a stringified JSON, parse it
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          setStats(parsed as DashboardStats);
        } catch (e) {
          console.error("Failed to parse dashboard stats:", e);
        }
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const getStatusCount = (status: string) => {
    return stats?.problems_by_status?.find((s) => s.status === status)?.count || 0;
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Ministry Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ministry Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_problems || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("reported")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("completed")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.top_category || "N/A"}</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <AIInsights />
      </div>
      {/* Moderation Queue for ministries */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">🧹 Moderation Queue</h2>
        {/* Show flagged/hidden/removed content, scores, reasons, with approve/remove actions */}
        {/* You can add tabs or keep as a section below the dashboard cards */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Flagged Problems</CardTitle>
          </CardHeader>
          <CardContent>
            <ModerationQueue />
          </CardContent>
        </Card>
        <h2 className="text-xl font-bold mb-4">Civic Knowledge Graph</h2>
        <CivicGraphExplorer />
      </div>
    </div>
  );
};

export default MinistryDashboard;
