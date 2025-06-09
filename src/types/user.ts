export interface IUser {
    id: number;
    login: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
}

export interface IUserSummary {
    id: number;
    login: string;
    role: string;
}

export const mockUsers: IUser[] = [
    {
        id: 1,
        login: "john_doe",
        email: "john_doe@example.com",
        role: "developer",
        firstName: "John",
        lastName: "Doe",
        avatarUrl: 'https://i.pravatar.cc/150?u=john',
        createdAt: "2025-04-01"
    },
    {
        id: 2,
        login: "jane_smith",
        email: "jane_smith@example.com",
        role: "manager",
        firstName: "Jane",
        lastName: "Smith",
        avatarUrl: "https://i.pravatar.cc/150?u=jane",
        createdAt: "2025-03-15"
    },
    {
        id: 3,
        login: "robert_johnson",
        email: "robert_johnson@example.com",
        role: "tester",
        firstName: "Robert",
        lastName: "Johnson",
        avatarUrl: "https://i.pravatar.cc/150?u=robert",
        createdAt: "2025-03-20"
    }
];