import axiosInstance from './axios';
import type { User, AuthResponse, LoginPayload, RegisterPayload, UpdateProfilePayload } from '../types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/profile');
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const response = await axiosInstance.put<User>('/auth/profile', payload);
    return response.data;
  },
};
