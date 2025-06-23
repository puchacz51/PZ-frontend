export interface IProjectComment {
    id: number;
    content: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl?: string;
    };
    projectId: number;
    createdAt: string;
    updatedAt?: string;
    canEdit: boolean;
    canDelete: boolean;
}

export interface IProjectCommentCreateRequest {
    content: string;
}

export interface IProjectCommentUpdateRequest {
    content: string;
}

export interface IProjectCommentDeleteResponse {
    message: string;
}
