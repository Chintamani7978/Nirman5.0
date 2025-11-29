import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { columns, Problem } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ChangeStatusModal from "@/components/ministry/ChangeStatusModal";

const MinistryProblemsPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const [filter, setFilter] = useState<'all' | 'flagged' | 'hidden' | 'removed'>('all');
  const fetchProblems = async () => {
    setLoading(true);
    let query = supabase
      .from("problems")
      .select("id, title, status, category, created_at, is_flagged, quality_score, moderation_reason, moderated_at, is_deleted");
    if (filter === 'flagged') {
      query = query.eq('is_flagged', true);
    } else if (filter === 'hidden') {
      query = query.eq('is_deleted', true);
    } else if (filter === 'removed') {
      query = query.eq('status', 'removed');
    }
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching problems:", error);
    } else {
      setProblems(data as Problem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, [filter]);

  const handleOpenStatusModal = (problem: Problem) => {
    setSelectedProblem(problem);
  };

  const handleCloseModal = () => {
    setSelectedProblem(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchProblems();
  };

  if (loading) {
    return <div>Loading problems...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Problem Management</h1>
      <div className="mb-4 flex gap-2 items-center">
        <label htmlFor="filter" className="font-medium">Filter:</label>
        <select
          id="filter"
          value={filter}
          onChange={e => setFilter(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="flagged">Flagged</option>
          <option value="hidden">Hidden</option>
          <option value="removed">Removed</option>
        </select>
      </div>
      <DataTable
        columns={columns}
        data={problems}
        meta={{
          openStatusModal: handleOpenStatusModal,
        }}
      />
      {selectedProblem && (
        <ChangeStatusModal
          problem={selectedProblem}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default MinistryProblemsPage;
