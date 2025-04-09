export interface IFileUploadRequest {
    file: File;
    uploadedBy: string;
}

export interface IFile {
    id: number;
    fileName: string;
    filePath: string;
    uploadedBy: string;
    createdAt: string;
}

export const mockFiles: IFile[] = [
    {
        id: 1,
        fileName: "requirements.pdf",
        filePath: "/uploads/requirements.pdf",
        uploadedBy: "john_doe",
        createdAt: "2025-04-02"
    },
    {
        id: 2,
        fileName: "design_mockup.png",
        filePath: "/uploads/design_mockup.png",
        uploadedBy: "jane_smith",
        createdAt: "2025-04-03"
    },
    {
        id: 3,
        fileName: "api_spec.json",
        filePath: "/uploads/api_spec.json",
        uploadedBy: "john_doe",
        createdAt: "2025-04-05"
    }
];
