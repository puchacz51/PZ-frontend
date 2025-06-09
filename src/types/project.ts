export type ProjectStatus = 
    | "Not Started" 
    | "In Progress" 
    | "Completed" 
    | "On Hold" 
    | "Canceled"
    | "Under Review";

// Backend status format
export type BackendProjectStatus = 
    | "NOT_STARTED"
    | "IN_PROGRESS" 
    | "COMPLETED"
    | "ON_HOLD"
    | "CANCELED"
    | "UNDER_REVIEW";

export interface IProjectCreateRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
}

// Backend response format
export interface IBackendProject {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: BackendProjectStatus;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
}

// Frontend format (transformed)
export interface IProject {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    createdBy: string;
    createdAt: string;
}

export interface IDeleteResponse {
    message: string;
}

// 🔄 Status transformation helpers
export const transformStatusFromBackend = (backendStatus: BackendProjectStatus): ProjectStatus => {
    switch (backendStatus) {
        case "NOT_STARTED": return "Not Started";
        case "IN_PROGRESS": return "In Progress";
        case "COMPLETED": return "Completed";
        case "ON_HOLD": return "On Hold";
        case "CANCELED": return "Canceled";
        case "UNDER_REVIEW": return "Under Review";
        default: return "Not Started";
    }
};

export const transformStatusToBackend = (frontendStatus: ProjectStatus): BackendProjectStatus => {
    switch (frontendStatus) {
        case "Not Started": return "NOT_STARTED";
        case "In Progress": return "IN_PROGRESS";
        case "Completed": return "COMPLETED";
        case "On Hold": return "ON_HOLD";
        case "Canceled": return "CANCELED";
        case "Under Review": return "UNDER_REVIEW";
        default: return "NOT_STARTED";
    }
};

// 🔄 Project transformation helper
export const transformProjectFromBackend = (backendProject: IBackendProject): IProject => {
    return {
        id: backendProject.id,
        name: backendProject.name,
        description: backendProject.description,
        startDate: backendProject.startDate,
        endDate: backendProject.endDate,
        status: transformStatusFromBackend(backendProject.status),
        createdBy: `${backendProject.createdBy.firstName} ${backendProject.createdBy.lastName}`,
        createdAt: backendProject.createdAt
    };
};