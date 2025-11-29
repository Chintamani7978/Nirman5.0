import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./CommentForm";
import type { Comment as CommentType } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth"; // Assuming you have a useAuth hook

interface CommentProps {
  comment: CommentType;
  onReply: (commentId: number, content: string) => Promise<void>;
  onUpdate: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  level?: number;
}

export const Comment = ({ comment, onReply, onUpdate, onDelete, level = 0 }: CommentProps) => {
  const { user, profile } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const canEdit = user?.id === comment.user_id && (new Date().getTime() - new Date(comment.created_at).getTime()) < 10 * 60 * 1000;
  const canDelete = user?.id === comment.user_id;
  const canReply = profile?.role === 'citizen' && level < 2; // Max depth of 3 levels (0, 1, 2)

  const handleReplySubmit = async (content: string) => {
    await onReply(comment.id, content);
    setIsReplying(false);
  };

  const handleUpdateSubmit = async (content: string) => {
    await onUpdate(comment.id, content);
    setIsEditing(false);
  };

  return (
    <div className={`flex flex-col space-y-4 ${level > 0 ? `ml-${level * 6}` : ''}`}>
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarFallback>{comment.profiles.full_name?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{comment.profiles.full_name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          {isEditing ? (
            <CommentForm
              initialContent={comment.content}
              onSubmit={handleUpdateSubmit}
              onCancel={() => setIsEditing(false)}
              submitLabel="Update"
            />
          ) : (
            <p className="text-sm">{comment.is_deleted ? <em>Comment deleted by user</em> : comment.content}</p>
          )}
          
          {!isEditing && !comment.is_deleted && (
            <div className="flex items-center space-x-2 mt-2">
              {canReply && <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>Reply</Button>}
              {canEdit && <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>}
              {canDelete && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(comment.id)}>Delete</Button>}
            </div>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="pl-12">
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            submitLabel="Post Reply"
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-12 space-y-4">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
