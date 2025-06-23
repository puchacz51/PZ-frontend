import { UserProfileResponse } from '@/api/userService';

export interface IFileUploadRequest {
    file: File;
    description?: string;
}

export interface IProjectFile {
    id: number;
    originalFileName: string;
    storedFileName: string;
    contentType: string;
    fileSize: number;
    description?: string;
    downloadUrl: string;
    uploadedBy: UserProfileResponse;
    uploadDate: string;
    projectId: number;
}

export interface IProjectFileCreateRequest {
    file: File;
    description?: string;
}

// Backward compatibility - można usunąć po migracji
export interface IFile {
    id: number;
    fileName: string;
    filePath: string;
    uploadedBy: string;
    createdAt: string;
}

export const mockFiles: IFile[] = [];
