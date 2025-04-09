import { Button } from "@/components/ui/button";
import { X, Bell, Check } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import NotificationItem from "./NotificationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { notifications, unreadCount, markAllAsRead, clearAllNotifications } = useNotifications();
  const notificationsContainerRef = useRef<HTMLDivElement>(null);

  // Animation effect when panel opens
  useEffect(() => {
    if (isOpen && notifications.length > 0 && notificationsContainerRef.current) {
      const cards = notificationsContainerRef.current.querySelectorAll('.notification-card');
      
      gsap.set(cards, { 
        opacity: 0,
      });
      
      gsap.to(cards, {
        autoAlpha: 1,
        duration: 0.3,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.2, 
        clearProps: "all",
        delay: 0.3,
      });
    }
  }, [isOpen, notifications.length]);

  return (
    <>
      <div className={`fixed top-0 right-0 h-screen w-200 bg-black border-l border-white/10 shadow-lg z-101 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 h-14">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-white" />
              <span className="text-white text-lg font-semibold">Powiadomienia</span>
              {unreadCount > 0 && (
                <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-white/10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-white/70 hover:text-white flex items-center gap-1 text-xs"
            >
              <Check className="h-3.5 w-3.5" />
              Oznacz jako przeczytane
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="text-white/70 hover:text-white text-xs"
            >
              Wyczyść wszystkie
            </Button>
          </div>

          {/* Notifications list */}
          <ScrollArea className="flex-1 p-4">
            <div ref={notificationsContainerRef}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/60">
                  <Bell className="h-12 w-12 mb-2 opacity-20" />
                  <h3 className="text-lg font-medium">Brak powiadomień</h3>
                  <p>Pojawią się tutaj, gdy coś się wydarzy.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />}
    </>
  );
};

export default NotificationPanel;
