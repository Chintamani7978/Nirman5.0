import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

const MinistryReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setLoading(true);
    try {
      const { data: problems, error } = await supabase
        .from("problems")
        .select(`
          id,
          created_at,
          title,
          description,
          category,
          status,
          latitude,
          longitude,
          votes_count,
          user_id
        `);

      if (error) throw error;

      if (!problems || problems.length === 0) {
        toast({
          title: "No Data",
          description: "There are no problems to export.",
          variant: "destructive",
        });
        return;
      }

      const csv = Papa.unparse(problems);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `voiceup_problems_export_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${problems.length} records have been exported.`,
      });

    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Data Export & Reporting</h1>
      <Card>
        <CardHeader>
          <CardTitle>Export Problem Data</CardTitle>
          <CardDescription>
            Download a CSV file containing all reported problems. This can be used for offline analysis, reporting, or integration with other systems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Exporting..." : "Export All Problems to CSV"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinistryReportsPage;
