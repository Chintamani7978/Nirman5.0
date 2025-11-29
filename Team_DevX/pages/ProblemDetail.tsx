import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import RatingDialog from '@/components/review/RatingDialog';
import useSubmitRating from '@/hooks/useSubmitRating';
import { supabase } from "@/integrations/supabase/client";
import { CommentThread } from "@/components/comments/CommentThread";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar } from "lucide-react";

const fetchProblem = async (problemId: string) => {
  const { data, error } = await supabase
    .from("problems")
    .select("*, profiles(full_name)")
    .eq("id", problemId)
    .single();

  if (error) throw error;
  return data;
};

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: problem, isLoading, error } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => fetchProblem(id!),
    enabled: !!id,
  });

  const [ratingOpen, setRatingOpen] = useState(false);
  const submitRating = useSubmitRating();
  const { user } = useAuth();

  useEffect(() => {
    if (!isLoading && problem && user) {
      // Only prompt the original reporter to submit a rating
      const isReporter = String((problem as any).user_id) === String(user.id);
      if (isReporter && String(problem.status) === 'Resolved' && (((problem as any).rating === null) || ((problem as any).rating === undefined))) {
        setRatingOpen(true);
      }
    }
  }, [isLoading, problem]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-6" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center p-4">Error: {error.message}</div>;
  }

  if (!problem) {
    return <div className="text-center p-4">Problem not found.</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{problem.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
            <Badge variant="secondary">{problem.category}</Badge>
            <Badge variant="outline">{problem.status.replace("_", " ")}</Badge>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(problem.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{problem.latitude.toFixed(4)}, {problem.longitude.toFixed(4)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base">{problem.description}</p>
          {problem.media_url && (
            <div className="mt-4">
              <img src={problem.media_url} alt="Problem attachment" className="rounded-lg max-w-full h-auto" />
            </div>
          )}

          {/* Rating display for already-reviewed problems */}
          {((problem as any).rating != null) && (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-5 w-5 ${i < ((problem as any).rating ?? 0) ? 'text-amber-400' : 'text-muted-foreground'}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.172L12 18.896l-7.336 3.87 1.402-8.172L.132 9.21l8.2-1.192z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">{(problem as any).feedback ?? 'No feedback provided.'}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <RatingDialog
        open={ratingOpen}
        onOpenChange={(v) => setRatingOpen(v)}
        onSubmit={async (rating, feedback) => {
          if (!problem) return;
          try {
            await (submitRating as any).mutateAsync({ problemId: problem.id, rating, feedback });
          } catch (err) {
            console.error('Failed to submit rating', err);
          }
        }}
        initialRating={(problem as any).rating ?? null}
        initialFeedback={(problem as any).feedback ?? null}
      />

      <CommentThread topicId={problem.id} topicType="problem" />
      </div>
    </div>
  );
};

export default ProblemDetail;
