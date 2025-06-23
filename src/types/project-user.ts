// Project role enum matching backend
export type ProjectRole = 
    | "MANAGER"
    | "DEVELOPER" 
    | "DESIGNER"
    | "TESTER"
    | "ANALYST";

// Frontend project role labels
export type ProjectRoleLabel = 
    | "Manager"
    | "Developer"
    | "Designer" 
    | "Tester"
    | "Analyst";

// Backend project user response format
export interface IProjectUserResponse {
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl?: string;
    };
    role: ProjectRole;
}

// Frontend project user format
export interface IProjectUser {
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl?: string;
    };
    role: ProjectRoleLabel;
}

// Request to assign user to project
export interface IProjectUserAssignRequest {
    userEmail: string;
    role: ProjectRoleLabel;
}

// Request to update user role
export interface IProjectUserRoleUpdateRequest {
    role: ProjectRoleLabel;
}

// Role transformation helpers
export const transformRoleFromBackend = (backendRole: ProjectRole): ProjectRoleLabel => {
    switch (backendRole) {
        case "MANAGER": return "Manager";
        case "DEVELOPER": return "Developer";
        case "DESIGNER": return "Designer";
        case "TESTER": return "Tester";
        case "ANALYST": return "Analyst";
        default: return "Developer";
    }
};

export const transformRoleToBackend = (frontendRole: ProjectRoleLabel): ProjectRole => {
    switch (frontendRole) {
        case "Manager": return "MANAGER";
        case "Developer": return "DEVELOPER";
        case "Designer": return "DESIGNER";
        case "Tester": return "TESTER";
        case "Analyst": return "ANALYST";
        default: return "DEVELOPER";
    }
};

// Transform project user from backend
export const transformProjectUserFromBackend = (backendProjectUser: IProjectUserResponse): IProjectUser => {
    // Zabezpieczenie przed nieprawidłowymi danymi
    if (!backendProjectUser || !backendProjectUser.user) {
        throw new Error('Invalid project user data: missing user information');
    }

    const { user, role } = backendProjectUser;
    
    // Sprawdzenie czy user ma wymagane pola
    if (!user.firstName || !user.lastName || !user.email) {
        console.warn('⚠️ User data incomplete:', user);
    }

    return {
        user: {
            id: user.id || 0,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            avatarUrl: user.avatarUrl
        },
        role: transformRoleFromBackend(role)
    };
};

export interface IProjectUserCreateRequest {
    projectId: number;
    userId: number;
    role: string;
}

export interface IProjectUser_Old {
    id: number;
    projectId: number;
    userId: number;
    role: string;
    createdAt: string;
}

export const mockProjectUsers: IProjectUser_Old[] = [
    {
        id: 1,
        projectId: 1,
        userId: 1,
        role: "Developer",
        createdAt: "2025-04-01"
    },
    {
        id: 2,
        projectId: 1,
        userId: 2,
        role: "Designer",
        createdAt: "2025-02-15"
    },
    {
        id: 3,
        projectId: 2,
        userId: 1,
        role: "Manager",
        createdAt: "2025-02-15"
    },
    {
        id: 4,
        projectId: 2,
        userId: 3,
        role: "Tester",
        createdAt: "2025-02-15"
    }
];
