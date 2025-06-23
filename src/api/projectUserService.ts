import axiosInstance from '@/config/axios';
import { 
    IProjectUserResponse,
    IProjectUserAssignRequest,
    IProjectUserRoleUpdateRequest,
    IProjectUser,
    transformProjectUserFromBackend,
    transformRoleToBackend
} from '@/types/project-user';

export const projectUserService = {
    // 👥 Assign user to project
    assignUserToProject: async (projectId: number, request: IProjectUserAssignRequest): Promise<IProjectUser> => {
        const backendRequest = {
            ...request,
            role: transformRoleToBackend(request.role)
        };
        const response = await axiosInstance.post(`/projects/${projectId}/users`, backendRequest);
        return transformProjectUserFromBackend(response.data);
    },    // 📋 Get project users
    getProjectUsers: async (projectId: number): Promise<IProjectUser[]> => {
        try {
            const response = await axiosInstance.get(`/projects/${projectId}/users`);
            console.log('🔍 Project users response:', response.data);
            
            // Zabezpieczenie przed pustą odpowiedzią lub nieprawidłowymi danymi
            if (!response.data || !Array.isArray(response.data)) {
                console.warn('⚠️ Invalid response format for project users:', response.data);
                return [];
            }            // Filtrujemy i transformujemy tylko prawidłowe dane
            return response.data
                .filter((user: unknown): user is IProjectUserResponse => {
                    return Boolean(user) && 
                           typeof user === 'object' && 
                           user !== null &&
                           'user' in user && 
                           'role' in user &&
                           Boolean((user as IProjectUserResponse).user) &&
                           typeof (user as IProjectUserResponse).user === 'object' &&
                           'firstName' in (user as IProjectUserResponse).user &&
                           'lastName' in (user as IProjectUserResponse).user;
                })
                .map((user: IProjectUserResponse) => transformProjectUserFromBackend(user));        } catch (error: unknown) {
            console.error('❌ Failed to get project users:', error);
            
            // Rzucamy błąd dla specyficznych statusów HTTP, żeby komponent mógł je obsłużyć
            const axiosError = error as { response?: { status: number } };
            if (axiosError.response) {
                const status = axiosError.response.status;
                if (status === 403) {
                    // Brak uprawnień do przeglądania członków zespołu
                    throw new Error('NO_PERMISSIONS');
                } else if (status === 404) {
                    // Projekt nie istnieje
                    throw new Error('PROJECT_NOT_FOUND');
                }
            }
            
            // Dla innych błędów zwracamy pustą tablicę
            return [];
        }
    },

    // 🗑️ Remove user from project
    removeUserFromProject: async (projectId: number, userId: number): Promise<void> => {
        await axiosInstance.delete(`/projects/${projectId}/users/${userId}`);
    },

    // ✏️ Update user role in project
    updateUserRole: async (projectId: number, userId: number, request: IProjectUserRoleUpdateRequest): Promise<IProjectUser> => {
        const backendRequest = {
            role: transformRoleToBackend(request.role)
        };
        const response = await axiosInstance.put(`/projects/${projectId}/users/${userId}/role`, backendRequest);
        return transformProjectUserFromBackend(response.data);
    }
};
