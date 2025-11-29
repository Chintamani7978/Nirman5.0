import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  initialContent?: string;
  onCancel?: () => void;
  submitLabel?: string;
}

export const CommentForm = ({
  onSubmit,
  initialContent = "",
  onCancel,
  submitLabel = "Post Comment",
}: CommentFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isSubmittable = content.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmittable || isLoading) return;

    setIsLoading(true);
    try {
      await onSubmit(content);
      setContent(""); // Clear form on successful submission
      if (onCancel) onCancel(); // Close form if it's for editing/replying
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not submit comment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="w-full"
        disabled={isLoading}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!isSubmittable || isLoading}>
          {isLoading ? "Submitting..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
