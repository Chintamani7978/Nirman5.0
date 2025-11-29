import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type SubmitPayload = {
  problemId: string;
  rating: number;
  feedback?: string;
};

export const useSubmitRating = () => {
  const qc = useQueryClient();

  return useMutation(async ({ problemId, rating, feedback }: SubmitPayload) => {
    // Determine new status based on rating
    const newStatus = rating < 3 ? 'Re-Opened' : 'Solved';

    const updates: any = { rating, feedback, status: newStatus };

    const { error } = await supabase.from('problems').update(updates).eq('id', problemId);
    if (error) throw error;

    // Invalidate problem queries
    qc.invalidateQueries(['problem', problemId]);
    qc.invalidateQueries(['nearbyProblemsMap']);
    qc.invalidateQueries(['problems']);

    return { problemId, newStatus };
  });
};

export default useSubmitRating;
