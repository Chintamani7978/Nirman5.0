import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Notification } from "@/lib/types";

interface NotificationListProps {
  notifications: Notification[];
}

export const NotificationList = ({ notifications }: NotificationListProps) => {
  if (notifications.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No new notifications.</p>;
  }

  return (
    <ScrollArea className="h-96">
      <div className="flex flex-col">
        {notifications.map((notification) => (
          <Link
            key={notification.id}
            to={`/problem/${notification.problem_id}`}
            className={`
              block p-3 border-b transition-colors
              ${notification.is_read ? 'hover:bg-muted/50' : 'bg-primary/10 hover:bg-primary/20'}
            `}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium">{notification.message}</p>
              {!notification.is_read && (
                <Badge variant="destructive" className="h-2 w-2 p-0"></Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </p>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};
