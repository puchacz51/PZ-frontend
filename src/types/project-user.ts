export interface IProjectUserCreateRequest {
    projectId: number;
    userId: number;
    role: string;
}

export interface IProjectUser {
    id: number;
    projectId: number;
    userId: number;
    role: string;
    createdAt: string;
}

export const mockProjectUsers: IProjectUser[] = [
    {
        id: 1,
        projectId: 1,
        userId: 1,
        role: "developer",
        createdAt: "2025-04-01"
    },
    {
        id: 2,
        projectId: 1,
        userId: 2,
        role: "designer",
        createdAt: "2025-02-15"
    },
    {
        id: 3,
        projectId: 2,
        userId: 1,
        role: "lead developer",
        createdAt: "2025-02-15"
    },
    {
        id: 4,
        projectId: 2,
        userId: 3,
        role: "tester",
        createdAt: "2025-02-15"
    }
];
