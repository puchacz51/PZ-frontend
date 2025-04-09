export type TaskStatus = "To Do" | "In Progress" | "Review" | "Completed" | "Blocked";

export interface ITaskCreateRequest {
    name: string;
    description: string;
    status: TaskStatus;
    projectId: number;
    assignedTo: string;
}

export interface ITaskUpdateRequest {
    name: string;
    description: string;
    status: TaskStatus;
    assignedTo: string;
}

export interface ITask {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
    projectId?: number;
    assignedTo: string;
    createdAt: string;
}

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
