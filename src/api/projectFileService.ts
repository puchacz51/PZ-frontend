import axiosInstance from '@/config/axios';
import { IProjectFile, IProjectFileCreateRequest } from '@/types/file';

export const projectFileService = {
    // 📤 Upload file to project
    uploadFile: async (projectId: number, request: IProjectFileCreateRequest): Promise<IProjectFile> => {
        const formData = new FormData();
        formData.append('file', request.file);
        if (request.description) {
            formData.append('description', request.description);
        }

        const response = await axiosInstance.post(`/projects/${projectId}/files/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // 📋 Get all project files
    getProjectFiles: async (projectId: number): Promise<IProjectFile[]> => {
        const response = await axiosInstance.get(`/projects/${projectId}/files`);
        return response.data;
    },

    // 🔍 Get file details
    getFileDetails: async (projectId: number, fileId: number): Promise<IProjectFile> => {
        const response = await axiosInstance.get(`/projects/${projectId}/files/${fileId}`);
        return response.data;
    },

    // 📥 Download file
    downloadFile: async (projectId: number, fileId: number): Promise<Blob> => {
        const response = await axiosInstance.get(`/projects/${projectId}/files/${fileId}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },

    // 🗑️ Delete file
    deleteFile: async (projectId: number, fileId: number): Promise<void> => {
        await axiosInstance.delete(`/projects/${projectId}/files/${fileId}`);
    },

    // 👤 Get current user files
    getMyFiles: async (): Promise<IProjectFile[]> => {
        const response = await axiosInstance.get('/users/my-files');
        return response.data;
    },

    // 💾 Helper method to trigger file download in browser
    triggerFileDownload: (blob: Blob, fileName: string) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    // 📏 Format file size
    formatFileSize: (sizeInBytes: number): string => {
        if (sizeInBytes === 0) return '0 B';
        
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
        const size = sizeInBytes / Math.pow(1024, i);
        
        return `${Math.round(size * 100) / 100} ${sizes[i]}`;
    },

    // 🎨 Get file icon based on extension
    getFileIcon: (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📈';
            case 'zip':
            case 'rar':
            case '7z':
                return '🗜️';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
                return '🖼️';
            case 'mp4':
            case 'avi':
            case 'mov':
                return '🎬';
            case 'mp3':
            case 'wav':
            case 'flac':
                return '🎵';
            case 'txt':
            case 'rtf':
                return '📃';
            case 'json':
            case 'xml':
                return '🔧';
            default:
                return '📄';
        }
    }
};
