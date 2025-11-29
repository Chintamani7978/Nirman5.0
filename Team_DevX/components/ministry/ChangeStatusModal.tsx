import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Problem } from "@/pages/ministry/problems/columns";

interface ChangeStatusModalProps {
  problem: Problem;
  onClose: () => void;
  onSuccess: () => void;
}

const problemStatuses = ["reported", "under_review", "approved", "in_progress", "completed", "rejected"];

const ChangeStatusModal = ({ problem, onClose, onSuccess }: ChangeStatusModalProps) => {
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState(problem.status);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // 1. Update problem status
      const { error: updateError } = await supabase
        .from("problems")
        .update({ status: newStatus })
        .eq("id", problem.id);
      if (updateError) throw updateError;

      // 2. Add to audit log
      const { error: auditError } = await supabase.from("audit_logs").insert({
        actor_id: session.user.id,
        action_type: "status_change",
        target_id: problem.id,
        details: `Status changed from ${problem.status} to ${newStatus}. Comment: ${comment}`,
      });
      if (auditError) console.error("Failed to create audit log:", auditError.message); // Non-critical

      // 3. Create notification for the user who reported the problem
      // First, get the user_id from the problems table
      const { data: problemData } = await supabase.from("problems").select("user_id").eq("id", problem.id).single();
      if (problemData?.user_id) {
        const { error: notificationError } = await supabase.from("notifications").insert({
          user_id: problemData.user_id,
          message: `The status of your reported problem "${problem.title}" has been updated to ${newStatus}.`,
          type: "status_update",
        });
        if (notificationError) console.error("Failed to create notification:", notificationError.message); // Non-critical
      }

      toast({
        title: "Status Updated",
        description: `Problem status has been changed to ${newStatus}.`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Problem Status</DialogTitle>
          <DialogDescription>Update the status for: "{problem.title}"</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {problemStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Add a comment for the status change..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleStatusChange} disabled={loading}>
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeStatusModal;
