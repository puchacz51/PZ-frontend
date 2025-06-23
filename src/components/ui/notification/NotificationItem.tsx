import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { INotification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Check, Info, AlertCircle, AlertTriangle, X, ArrowRight } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { forwardRef } from "react";

interface NotificationItemProps {
  notification: INotification;
}

const NotificationItem = forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ notification }, ref) => {
    const { markAsRead, clearNotification } = useNotifications();
    
    const getIcon = () => {
      switch (notification.type) {
        case "success":
          return <Check className="text-green-500" />;
        case "warning":
          return <AlertTriangle className="text-yellow-500" />;
        case "error":
          return <AlertCircle className="text-red-500" />;
        default:
          return <Info className="text-blue-500" />;
      }
    };

    const handleMarkAsRead = () => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      clearNotification(notification.id);
    };

    return (
      <Card 
        className={`notification-card mb-2 transition-all ${
          notification.read ? 'bg-black/80' : 'bg-black/95 border-l-4'
        } ${
          !notification.read && notification.type === 'info' && 'border-l-blue-500'
        } ${
          !notification.read && notification.type === 'success' && 'border-l-green-500'
        } ${
          !notification.read && notification.type === 'warning' && 'border-l-yellow-500'
        } ${
          !notification.read && notification.type === 'error' && 'border-l-red-500'
        }`}
        onClick={handleMarkAsRead}
        ref={ref}
      >
        <CardContent className="p-4 flex items-start gap-3">
          <div className="mt-1">{getIcon()}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h4 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                {notification.title}
              </h4>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
            <span className="text-xs text-gray-500 mt-2 block">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: pl })}
            </span>
          </div>
        </CardContent>
        
        {notification.actionUrl && (
          <CardFooter className="px-4 py-2 border-t border-white/5">
            <Link 
              to={notification.actionUrl} 
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center ml-auto"
            >
              Przejdź <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        )}
      </Card>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

export default NotificationItem;
