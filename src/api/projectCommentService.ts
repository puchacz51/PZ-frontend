import axiosInstance from '@/config/axios';
import { 
    IProjectComment, 
    IProjectCommentCreateRequest, 
    IProjectCommentUpdateRequest, 
    IProjectCommentDeleteResponse 
} from '@/types/project-comment';

export const projectCommentService = {
    // Pobieranie wszystkich komentarzy projektu
    async getProjectComments(projectId: number): Promise<IProjectComment[]> {
        try {
            const response = await axiosInstance.get<IProjectComment[]>(
                `/projects/${projectId}/comments`
            );
            return response.data;
        } catch (error) {
            console.error('❌ Failed to fetch project comments:', error);
            throw error;
        }
    },

    // Pobieranie pojedynczego komentarza
    async getComment(projectId: number, commentId: number): Promise<IProjectComment> {
        try {
            const response = await axiosInstance.get<IProjectComment>(
                `/projects/${projectId}/comments/${commentId}`
            );
            return response.data;
        } catch (error) {
            console.error('❌ Failed to fetch project comment:', error);
            throw error;
        }
    },

    // Dodawanie nowego komentarza
    async addComment(projectId: number, request: IProjectCommentCreateRequest): Promise<IProjectComment> {
        try {
            const response = await axiosInstance.post<IProjectComment>(
                `/projects/${projectId}/comments`,
                request
            );
            return response.data;
        } catch (error) {
            console.error('❌ Failed to add project comment:', error);
            throw error;
        }
    },

    // Aktualizacja komentarza
    async updateComment(
        projectId: number, 
        commentId: number, 
        request: IProjectCommentUpdateRequest
    ): Promise<IProjectComment> {
        try {
            const response = await axiosInstance.put<IProjectComment>(
                `/projects/${projectId}/comments/${commentId}`,
                request
            );
            return response.data;
        } catch (error) {
            console.error('❌ Failed to update project comment:', error);
            throw error;
        }
    },

    // Usuwanie komentarza
    async deleteComment(projectId: number, commentId: number): Promise<IProjectCommentDeleteResponse> {
        try {
            const response = await axiosInstance.delete<IProjectCommentDeleteResponse>(
                `/projects/${projectId}/comments/${commentId}`
            );
            return response.data;
        } catch (error) {
            console.error('❌ Failed to delete project comment:', error);
            throw error;
        }
    }
};
