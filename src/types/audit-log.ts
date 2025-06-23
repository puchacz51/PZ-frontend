export type AuditAction = 
    | "USER_CREATED" 
    | "USER_UPDATED" 
    | "USER_DELETED"
    | "PROJECT_CREATED"
    | "PROJECT_UPDATED"
    | "PROJECT_DELETED"
    | "TASK_CREATED"
    | "TASK_UPDATED"
    | "TASK_DELETED"
    | "USER_LOGGED_IN"
    | "USER_LOGGED_OUT";

export interface IAuditLog {
    id: number;
    action: AuditAction;
    entity: string;
    entityId?: number;
    userId?: number;
    timestamp: string;
    details?: string;
}

export const mockAuditLogs: IAuditLog[] = [
    {
        id: 1,
        action: "USER_CREATED",
        entity: "User",
        entityId: 3,
        userId: 1,
        timestamp: "2025-04-01T10:00:00",
        details: "Created user robert_johnson"
    },
    {
        id: 2,
        action: "PROJECT_CREATED",
        entity: "Project",
        entityId: 1,
        userId: 1,
        timestamp: "2025-04-01T11:15:00",
        details: "Created project Project A"
    },
    {
        id: 3,
        action: "TASK_CREATED",
        entity: "Task",
        entityId: 1,
        userId: 2,
        timestamp: "2025-04-02T09:30:00",
        details: "Created task Design UI Mockups"
    },
    {
        id: 4,
        action: "USER_LOGGED_IN",
        entity: "User",
        entityId: 1,
        userId: 1,
        timestamp: "2025-04-01T09:00:00",
        details: "User john_doe logged in"
    },
    {
        id: 5,
        action: "TASK_UPDATED",
        entity: "Task",
        entityId: 1,
        userId: 2,
        timestamp: "2025-04-02T16:00:00",
        details: "Updated task status to Completed"
    }
];
