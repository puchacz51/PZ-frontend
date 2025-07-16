import axiosInstance from '@/config/axios';

export interface UserProfileResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl?: string;
}

class UserService {
    async uploadAvatar(file: File): Promise<UserProfileResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    }

    async deleteAvatar(): Promise<void> {
        await axiosInstance.delete('/users/avatar');
    }

    async getProfile(): Promise<UserProfileResponse> {
        const response = await axiosInstance.get('/users/profile');
        return response.data;
    }    
    async getAvatarUrl(fileName: string): Promise<string> {
        return `${axiosInstance.defaults.baseURL}/users/avatar/${fileName}`;
    }

    async getAllUsers(): Promise<UserProfileResponse[]> {
        const response = await axiosInstance.get('/users');
        return response.data;
    }
}

export const userService = new UserService();