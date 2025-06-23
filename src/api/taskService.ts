import axiosInstance from '@/config/axios';
import { 
    ITask, 
    ITaskCreateRequest, 
    ITaskUpdateRequest, 
    IBackendTask,
    transformTaskFromBackend,
    transformTaskStatusToBackend,
    TaskStatusDisplay
} from '@/types/task';

export const taskService = {
    // 📝 Create new task
    createTask: async (taskData: Omit<ITaskCreateRequest, 'status'> & { status: TaskStatusDisplay }): Promise<ITask> => {
        const backendData = {
            ...taskData,
            status: transformTaskStatusToBackend(taskData.status)
        };
        const response = await axiosInstance.post('/tasks', backendData);
        return transformTaskFromBackend(response.data);
    },

    // 📋 Get all tasks
    getAllTasks: async (): Promise<ITask[]> => {
        const response = await axiosInstance.get('/tasks');
        return response.data.map((task: IBackendTask) => transformTaskFromBackend(task));
    },

    // 🎯 Get tasks by project ID
    getTasksByProject: async (projectId: number): Promise<ITask[]> => {
        const response = await axiosInstance.get(`/tasks/project/${projectId}`);
        return response.data.map((task: IBackendTask) => transformTaskFromBackend(task));
    },

    // 👤 Get tasks assigned to current user
    getMyTasks: async (): Promise<ITask[]> => {
        const response = await axiosInstance.get('/tasks/my-tasks');
        return response.data.map((task: IBackendTask) => transformTaskFromBackend(task));
    },

    // 🔍 Get task by ID
    getTaskById: async (id: number): Promise<ITask> => {
        const response = await axiosInstance.get(`/tasks/${id}`);
        return transformTaskFromBackend(response.data);
    },

    // ✏️ Update task
    updateTask: async (id: number, taskData: Omit<ITaskUpdateRequest, 'status'> & { status: TaskStatusDisplay }): Promise<ITask> => {
        const backendData = {
            ...taskData,
            status: transformTaskStatusToBackend(taskData.status)
        };
        const response = await axiosInstance.put(`/tasks/${id}`, backendData);
        return transformTaskFromBackend(response.data);
    },

    // 🗑️ Delete task
    deleteTask: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/tasks/${id}`);
    }
};
