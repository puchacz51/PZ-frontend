import axiosInstance from '@/config/axios';
import { 
    IProject, 
    IProjectCreateRequest, 
    IBackendProject, 
    transformProjectFromBackend,
    transformStatusToBackend 
} from '@/types/project';

export const projectService = {
    // 📁 Create new project
    createProject: async (projectData: IProjectCreateRequest): Promise<IProject> => {
        const backendData = {
            ...projectData,
            status: transformStatusToBackend(projectData.status)
        };
        const response = await axiosInstance.post('/projects', backendData);
        return transformProjectFromBackend(response.data);
    },

    // 📋 Get all projects
    getAllProjects: async (): Promise<IProject[]> => {
        const response = await axiosInstance.get('/projects');
        console.log('🔍 Backend response:', response.data);
        return response.data.map((project: IBackendProject) => transformProjectFromBackend(project));
    },

    // 👤 Get projects created by current user
    getMyProjects: async (): Promise<IProject[]> => {
        const response = await axiosInstance.get('/projects/my-projects');
        return response.data.map((project: IBackendProject) => transformProjectFromBackend(project));
    },

    // 🔍 Get project by ID
    getProjectById: async (id: number): Promise<IProject> => {
        const response = await axiosInstance.get(`/projects/${id}`);
        return transformProjectFromBackend(response.data);
    },

    // ✏️ Update project
    updateProject: async (id: number, projectData: IProjectCreateRequest): Promise<IProject> => {
        const backendData = {
            ...projectData,
            status: transformStatusToBackend(projectData.status)
        };
        const response = await axiosInstance.put(`/projects/${id}`, backendData);
        return transformProjectFromBackend(response.data);
    },

    // 🗑️ Delete project
    deleteProject: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/projects/${id}`);
    }
};
