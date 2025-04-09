import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { INotification, NotificationType } from "@/types/notification";
import { v4 as uuidv4 } from "uuid";

interface NotificationContextType {
    notifications: INotification[];
    unreadCount: number;
    addNotification: (title: string, message: string, type: NotificationType, actionUrl?: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotification: (id: string) => void;
    clearAllNotifications: () => void;
}

const mockNotifications: INotification[] = [
    {
        id: "1",
        title: "New Message",
        message: "You have a new message from John Doe.",
        type: "info",
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: "/messages",
    },
    {
        id: "2",
        title: "System Alert",
        message: "Your password will expire in 3 days.",
        type: "warning",
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: "/settings",
    },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<INotification[]>(() => {
        const savedNotifications = mockNotifications;
        return savedNotifications ? savedNotifications : [];
    });

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    const saveNotifications = useCallback((updatedNotifications: INotification[]) => {
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        setNotifications(updatedNotifications);
    }, []);

    const addNotification = useCallback(
        (title: string, message: string, type: NotificationType, actionUrl?: string) => {
            const newNotification: INotification = {
                id: uuidv4(),
                title,
                message,
                type,
                read: false,
                createdAt: new Date().toISOString(),
                actionUrl,
            };

            const updatedNotifications = [newNotification, ...notifications];
            saveNotifications(updatedNotifications);
        },
        [notifications, saveNotifications]
    );

    const markAsRead = useCallback(
        (id: string) => {
            const updatedNotifications = notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification));
            saveNotifications(updatedNotifications);
        },
        [notifications, saveNotifications]
    );

    const markAllAsRead = useCallback(() => {
        const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }));
        saveNotifications(updatedNotifications);
    }, [notifications, saveNotifications]);

    const clearNotification = useCallback(
        (id: string) => {
            const updatedNotifications = notifications.filter((notification) => notification.id !== id);
            saveNotifications(updatedNotifications);
        },
        [notifications, saveNotifications]
    );

    const clearAllNotifications = useCallback(() => {
        saveNotifications([]);
    }, [saveNotifications]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotification,
                clearAllNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
