import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Comment as CommentType } from "@/lib/types";

interface CommentThreadProps {
  topicId: string; // Can be problem_id or solution_id
  topicType: "problem" | "solution";
}

// Helper to fetch comments and their replies recursively
const fetchComments = async (topicType: "problem" | "solution", topicId: string): Promise<CommentType[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (full_name, role)
    `)
    .eq(topicType === 'problem' ? 'problem_id' : 'solution_id', topicId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  // Simple nesting for now. A recursive CTE in Postgres would be more efficient for deep nesting.
  const comments = data as any as CommentType[];
  const commentMap = new Map<number, CommentType>();
  const rootComments: CommentType[] = [];

  comments.forEach(comment => {
    comment.replies = [];
    commentMap.set(comment.id, comment);
  });

  comments.forEach(comment => {
    if (comment.parent_id && commentMap.has(comment.parent_id)) {
      commentMap.get(comment.parent_id)!.replies!.push(comment);
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
};

export const CommentThread = ({ topicId, topicType }: CommentThreadProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const queryKey = ["comments", topicType, topicId];

  const { data: comments, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetchComments(topicType, topicId),
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`comments:${topicType}:${topicId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload) => {
          console.log("Realtime update received:", payload);
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey, topicId, topicType]);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  };

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: number }) => {
      const { error } = await supabase.from("comments").insert({
        user_id: user!.id,
        [topicType === 'problem' ? 'problem_id' : 'solution_id']: topicId,
        content,
        parent_id: parentId,
      });
      if (error) throw error;
    },
    ...mutationOptions,
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      const { error } = await supabase.from("comments").update({ content }).eq("id", commentId);
      if (error) throw error;
    },
    ...mutationOptions,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const { error } = await supabase.from("comments").update({ is_deleted: true, content: "This comment has been deleted." }).eq("id", commentId);
      if (error) throw error;
    },
    ...mutationOptions,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Error loading comments: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold">Community Discussion</h3>
      {profile?.role === 'citizen' && (
        <div>
          <h4 className="font-medium mb-2">Leave a Comment</h4>
          <CommentForm
            onSubmit={(content) => addCommentMutation.mutateAsync({ content })}
            submitLabel="Post Comment"
          />
        </div>
      )}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={(parentId, content) => addCommentMutation.mutateAsync({ content, parentId })}
              onUpdate={(commentId, content) => updateCommentMutation.mutateAsync({ commentId, content })}
              onDelete={(commentId) => deleteCommentMutation.mutateAsync(commentId)}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No comments yet. Be the first to start the discussion!</p>
        )}
      </div>
    </div>
  );
};
