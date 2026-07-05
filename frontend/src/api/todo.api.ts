import axiosInstance from './axios';
import type {
    Task,
    CreateTaskPayload,
    UpdateTaskPayload,
    TasksResponse,
} from '../types';

export const todoApi = {
    /**
     * Get all tasks with optional query params (search, filter, page)
     */
    getTasks: async (params?: {
        search?: string;
        status?: string;
        priority?: string;
        page?: number;
        limit?: number;
    }): Promise<TasksResponse> => {
        const response = await axiosInstance.get<TasksResponse>('/tasks', { params });
        return response.data;
    },

    /**
     * Get a single task by ID
     */
    getTaskById: async (id: string): Promise<Task> => {
        const response = await axiosInstance.get<{ data: Task }>(`/tasks/${id}`);
        return response.data.data;
    },

    /**
     * Create a new task
     */
    createTask: async (payload: CreateTaskPayload): Promise<Task> => {
        const response = await axiosInstance.post<{ data: Task }>('/tasks', payload);
        return response.data.data;
    },

    /**
     * Update a task by ID
     */
    updateTask: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
        const response = await axiosInstance.put<{ data: Task }>(`/tasks/${id}`, payload);
        return response.data.data;
    },

    /**
     * Delete a task by ID
     */
    deleteTask: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/tasks/${id}`);
    },

    /**
     * Upload an image for a task (multipart/form-data)
     */
    uploadTaskImage: async (id: string, file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axiosInstance.post<{ url: string }>(
            `/tasks/${id}/image`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    },

    /**
     * Get task statistics for dashboard
     */
    getTaskStats: async (): Promise<{
        completed: number;
        inProgress: number;
        notStarted: number;
        total: number;
    }> => {
        const response = await axiosInstance.get('/tasks/stats');
        return response.data;
    },
};
