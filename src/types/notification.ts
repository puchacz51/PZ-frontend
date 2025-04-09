export type NotificationType = "info" | "success" | "warning" | "error";

export interface INotification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
    actionUrl?: string;
    relatedEntityId?: number;
    relatedEntityType?: string;
}

export const mockNotifications: INotification[] = [
    {
        id: "1",
        title: "New Task Assigned",
        message: "You have been assigned to the task 'Implement Authentication'",
        type: "info",
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: "/tasks/2",
        relatedEntityId: 2,
        relatedEntityType: "Task"
    },
    {
        id: "2",
        title: "Task Completed",
        message: "Jane Smith has completed the task 'Design UI Mockups'",
        type: "success",
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        actionUrl: "/tasks/1",
        relatedEntityId: 1,
        relatedEntityType: "Task"
    },
    {
        id: "3",
        title: "Deadline Approaching",
        message: "The project 'Project A' deadline is in 5 days",
        type: "warning",
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        actionUrl: "/projects/1",
        relatedEntityId: 1,
        relatedEntityType: "Project"
    },
    {
        id: "4",
        title: "Project Update",
        message: "Project 'Project B' has been updated",
        type: "info",
        read: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        actionUrl: "/projects/2",
        relatedEntityId: 2,
        relatedEntityType: "Project"
    },
    {
        id: "5",
        title: "System Alert",
        message: "Your password will expire in 3 days",
        type: "warning",
        read: true,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        actionUrl: "/settings"
    }
];
