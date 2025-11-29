import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, feedback?: string) => Promise<void> | void;
  initialRating?: number | null;
  initialFeedback?: string | null;
};

const RatingDialog: React.FC<Props> = ({ open, onOpenChange, onSubmit, initialRating = null, initialFeedback = null }) => {
  const [rating, setRating] = useState<number | null>(initialRating ?? null);
  const [hover, setHover] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>(initialFeedback ?? '');
  const [submitting, setSubmitting] = useState(false);

  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = async () => {
    if (rating == null) return;
    setSubmitting(true);
    try {
      await onSubmit(rating, feedback || undefined);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Rate the resolution</DialogTitle>
          <DialogDescription>Please rate how well the problem was resolved (1–5 stars).</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-2">
            {stars.map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setRating(s)}
                className={`p-2 rounded-md transition ${((hover ?? rating) || 0) >= s ? 'text-amber-400' : 'text-muted-foreground'}`}
                aria-label={`${s} star`}
              >
                <Star className="h-6 w-6" />
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Optional feedback</label>
            <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-2" placeholder="Share details to help the ministry improve..." />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="mr-2">Cancel</Button>
          <Button onClick={handleSubmit} disabled={rating == null || submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
