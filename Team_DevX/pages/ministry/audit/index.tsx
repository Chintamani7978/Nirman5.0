import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Spinner } from "@/components/ui/spinner";

const fetchAuditLogs = async () => {
  // WORKAROUND: Casting to `any` because `gen types` is failing due to permissions.
  // This avoids TypeScript errors but sacrifices type safety for this query.
  const { data, error } = await (supabase.from("audit_logs") as any)
    .select(`
      id,
      created_at,
      action,
      details,
      target_id,
      target_type,
      profiles ( full_name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const MinistryAuditPage = () => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: fetchAuditLogs,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading audit logs: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
      <DataTable columns={columns} data={logs || []} />
    </div>
  );
};

export default MinistryAuditPage;
