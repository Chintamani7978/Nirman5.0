import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CategoryChart from "@/components/ministry/charts/CategoryChart";
import StatusChart from "@/components/ministry/charts/StatusChart";

interface AnalyticsData {
  problems_by_status: { status: string; count: number }[];
  problems_by_category: { category: string; count: number }[];
}

const MinistryAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data, error } = await supabase.rpc('get_ministry_dashboard_stats');
      
      if (error) {
        console.error("Error fetching analytics:", error);
      } else {
        setAnalytics(data);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics & Insights</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analytics?.problems_by_category && <CategoryChart data={analytics.problems_by_category} />}
        {analytics?.problems_by_status && <StatusChart data={analytics.problems_by_status} />}
      </div>
    </div>
  );
};

export default MinistryAnalyticsPage;
