export type ProjectStatus = 
    | "Not Started" 
    | "In Progress" 
    | "Completed" 
    | "On Hold" 
    | "Canceled"
    | "Under Review";

export interface IProjectCreateRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
}

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

export const mockProjects: IProject[] = [
    {
        id: 1,
        name: "Project A",
        description: "Description of project A - a website for client X",
        startDate: "2025-04-01",
        endDate: "2025-06-01",
        status: "In Progress",
        createdBy: "john_doe",
        createdAt: "2025-04-01"
    },
    {
        id: 2,
        name: "Project B",
        description: "Mobile application for internal use",
        startDate: "2025-02-15",
        endDate: "2025-08-30",
        status: "In Progress",
        createdBy: "jane_smith",
        createdAt: "2025-02-10"
    },
    {
        id: 3,
        name: "Project C",
        description: "E-commerce platform revamp",
        startDate: "2025-03-25",
        endDate: "2025-03-30",
        status: "Under Review",
        createdBy: "john_doe",
        createdAt: "2025-03-25"
    },
    {
        id: 4,
        name: "Project D - Already Completed",
        description: "Legacy code cleanup",
        startDate: "2025-01-01",
        endDate: "2025-03-01",
        status: "Completed",
        createdBy: "jane_smith",
        createdAt: "2025-01-01"
    },
    {
        id: 5,
        name: "Project E - Starts Today",
        description: "Design system overhaul",
        startDate: "2025-04-09",
        endDate: "2025-07-09",
        status: "Not Started",
        createdBy: "robert_johnson",
        createdAt: "2025-04-09"
    },
    {
        id: 6,
        name: "Project F - Future Start",
        description: "AI chatbot integration",
        startDate: "2025-05-20",
        endDate: "2025-09-01",
        status: "Not Started",
        createdBy: "john_doe",
        createdAt: "2025-04-05"
    },
    {
        id: 7,
        name: "Project G - Very Old",
        description: "Old R&D project for deprecated tech",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        status: "Canceled",
        createdBy: "robert_johnson",
        createdAt: "2023-01-01"
    },
    {
        id: 8,
        name: "Project H - Just Created",
        description: "Newly initiated internal task tracking",
        startDate: "2025-04-10",
        endDate: "2025-06-30",
        status: "On Hold",
        createdBy: "jane_smith",
        createdAt: "2025-04-09"
    }
];

export const mockDeleteResponse: IDeleteResponse = {
    message: "Project successfully deleted"
};