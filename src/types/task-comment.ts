export interface ITaskCommentCreateRequest {
    taskId: number;
    content: string;
}

export interface ITaskComment {
    id: number;
    task: {
        id: number;
        name: string;
    };
    user: {
        id: number;
        username: string;
    };
    content: string;
    createdAt: string;
}

export const mockTaskComments: ITaskComment[] = [
    {
        id: 1,
        task: {
            id: 1,
            name: "Design UI Mockups"
        },
        user: {
            id: 2,
            username: "jane_smith"
        },
        content: "I've completed the initial designs. Please review and provide feedback.",
        createdAt: "2025-04-02T14:30:00"
    },
    {
        id: 2,
        task: {
            id: 1,
            name: "Design UI Mockups"
        },
        user: {
            id: 1,
            username: "john_doe"
        },
        content: "The designs look great! Just a few minor tweaks needed.",
        createdAt: "2025-04-02T16:45:00"
    },
    {
        id: 3,
        task: {
            id: 2,
            name: "Implement Authentication"
        },
        user: {
            id: 1,
            username: "john_doe"
        },
        content: "Starting work on this today. Will use JWT for token-based authentication.",
        createdAt: "2025-04-03T09:00:00"
    }
];

export const mockDeleteCommentResponse = {
    message: "Comment successfully deleted"
};
