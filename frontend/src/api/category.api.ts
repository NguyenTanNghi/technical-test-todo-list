import axiosInstance from './axios';
import type { Category, CategoriesResponse, CategoryType } from '../types';

export const categoryApi = {
    getCategories: async (): Promise<CategoriesResponse> => {
        const response = await axiosInstance.get<CategoriesResponse>('/categories');
        return response.data;
    },

    createCategory: async (payload: {
        type: CategoryType;
        name: string;
    }): Promise<Category> => {
        const response = await axiosInstance.post<Category>('/categories', payload);
        return response.data;
    },

    updateCategory: async (
        id: string,
        payload: { name: string },
    ): Promise<Category> => {
        const response = await axiosInstance.patch<Category>(`/categories/${id}`, payload);
        return response.data;
    },

    deleteCategory: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/categories/${id}`);
    },
};