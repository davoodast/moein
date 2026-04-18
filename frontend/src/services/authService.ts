import apiClient from '../lib/apiClient';
import type { LoginResponse, User } from '../types';

export const authService = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return response;
  },

  getCurrentUser: async (token: string) => {
    const response = await apiClient.get<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  },

  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response;
  },
};
