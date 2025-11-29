import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type VoteVars = {
  problemId: string;
  voteType: 'upvote' | 'downvote';
  currentUserId?: string | null;
  currentVote?: 'upvote' | 'downvote' | null;
};

async function voteProblem({ problemId, voteType }: VoteVars) {
  const { data, error } = await supabase.rpc('vote_problem', {
    p_problem_id: problemId,
    p_vote_type: voteType,
  });

  if (error) {
    throw new Error(error.message);
  }

  return typeof data === 'number' ? data : 0;
}

export const useVote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<number, Error, VoteVars>({
    mutationFn: voteProblem,
    onError: (err: unknown) => {
      const message = (err as any)?.message || 'An unknown error occurred.';
      toast({ title: 'Vote error', description: message, variant: 'destructive' });
    },
    onSuccess: (updatedCount, variables) => {
      const { problemId, currentUserId, voteType, currentVote } = variables;
      toast({ title: 'Vote recorded', description: 'Your vote has been recorded.' });

      const syncList = (list: any[] | undefined) =>
        list?.map((problem) =>
          problem.id === problemId ? { ...problem, votes_count: updatedCount } : problem
        );

      queryClient.setQueryData(['problems'], syncList);

      queryClient
        .getQueryCache()
        .getAll()
        .forEach((query) => {
          const key = query.queryKey as any[];
          if (Array.isArray(key) && key[0] === 'nearbyProblems') {
            queryClient.setQueryData(key, syncList);
          }
        });

      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'nearbyProblems' });
      queryClient.invalidateQueries({ predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'votesForMap' });
      queryClient.setQueryData<Record<string, number> | undefined>(
        ['problemVoteTotals'],
        (prev = {}) => ({ ...prev, [problemId]: updatedCount })
      );
      queryClient.invalidateQueries({ queryKey: ['problemVoteTotals'] });

      if (currentUserId) {
        const nextVote = currentVote === voteType ? null : voteType;
        queryClient.setQueryData<Record<string, 'upvote' | 'downvote'> | undefined>(
          ['userVotes', currentUserId],
          (prev = {}) => {
            const updated = { ...prev };
            if (nextVote) {
              updated[problemId] = nextVote;
            } else {
              delete updated[problemId];
            }
            return updated;
          }
        );

        queryClient.invalidateQueries({ queryKey: ['userVotes', currentUserId] });
      }
    },
  });
};

export default useVote;
