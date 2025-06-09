export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "BLOCKED";

// Frontend display format
export type TaskStatusDisplay = "To Do" | "In Progress" | "Review" | "Completed" | "Blocked";

export interface IUserSummary {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface ITaskCreateRequest {
    name: string;
    description: string;
    status: TaskStatus;
    projectId: number;
    assignedTo?: string; // email
    dueDate?: string;
}

export interface ITaskUpdateRequest {
    name: string;
    description: string;
    status: TaskStatus;
    assignedTo?: string; // email
    dueDate?: string;
}

// Backend response format
export interface IBackendTask {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
    projectId: number;
    assignedTo?: IUserSummary;
    dueDate?: string;
    createdAt: string;
}

// Frontend format (transformed)
export interface ITask {
    id: number;
    name: string;
    description: string;
    status: TaskStatusDisplay;
    projectId?: number;
    assignedTo: string; // display name or email
    assignedToUser?: IUserSummary;
    dueDate?: string;
    createdAt: string;
}

// 🔄 Status transformation helpers
export const transformTaskStatusFromBackend = (backendStatus: TaskStatus): TaskStatusDisplay => {
    switch (backendStatus) {
        case "TO_DO": return "To Do";
        case "IN_PROGRESS": return "In Progress";
        case "REVIEW": return "Review";
        case "COMPLETED": return "Completed";
        case "BLOCKED": return "Blocked";
        default: return "To Do";
    }
};

export const transformTaskStatusToBackend = (frontendStatus: TaskStatusDisplay): TaskStatus => {
    switch (frontendStatus) {
        case "To Do": return "TO_DO";
        case "In Progress": return "IN_PROGRESS";
        case "Review": return "REVIEW";
        case "Completed": return "COMPLETED";
        case "Blocked": return "BLOCKED";
        default: return "TO_DO";
    }
};

// 🔄 Task transformation helper
export const transformTaskFromBackend = (backendTask: IBackendTask): ITask => {
    return {
        id: backendTask.id,
        name: backendTask.name,
        description: backendTask.description,
        status: transformTaskStatusFromBackend(backendTask.status),
        projectId: backendTask.projectId,
        assignedTo: backendTask.assignedTo 
            ? `${backendTask.assignedTo.firstName} ${backendTask.assignedTo.lastName}`
            : 'Nieprzypisane',
        assignedToUser: backendTask.assignedTo,
        dueDate: backendTask.dueDate,
        createdAt: backendTask.createdAt
    };
};

// ...existing mock data for fallback...
export const mockTasks: ITask[] = [
    {
        id: 1,
        name: "Design UI Mockups",
        description: "Create UI mockups for the landing page and dashboard",
        status: "Completed",
        projectId: 1,
        assignedTo: "jane_smith",
        createdAt: "2025-04-02"
    },
    {
        id: 2,
        name: "Implement Authentication",
        description: "Implement user authentication system with JWT",
        status: "In Progress",
        projectId: 1,
        assignedTo: "john_doe",
        createdAt: "2025-04-03"
    },
    {
        id: 3,
        name: "API Integration",
        description: "Integrate frontend with backend APIs",
        status: "To Do",
        projectId: 1,
        assignedTo: "john_doe",
        createdAt: "2025-04-04"
    },
    {
        id: 4,
        name: "Database Design",
        description: "Design database schema for the project",
        status: "Completed",
        projectId: 2,
        assignedTo: "robert_johnson",
        createdAt: "2025-05-16"
    },
    {
        id: 5,
        name: "Unit Testing",
        description: "Write unit tests for core functionality",
        status: "In Progress",
        projectId: 2,
        assignedTo: "robert_johnson",
        createdAt: "2025-05-17"
    }
];

export const mockDeleteTaskResponse = {
    message: "Task successfully deleted"
};
