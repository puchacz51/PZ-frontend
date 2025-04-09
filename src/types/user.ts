export interface IUser {
    id: number;
    login: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    createdAt?: string;
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
        avatarUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6226df1d-daeb-4c81-ae3d-1cf452d072fb/djgcrxm-249f8010-65bb-49dd-a01b-0b1e557ab7de.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzYyMjZkZjFkLWRhZWItNGM4MS1hZTNkLTFjZjQ1MmQwNzJmYlwvZGpnY3J4bS0yNDlmODAxMC02NWJiLTQ5ZGQtYTAxYi0wYjFlNTU3YWI3ZGUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.r73v5kg9aX__a8Lx0-mnBA7-8otnZm3Kq9P3azYcjBk',
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