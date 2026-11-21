import apiClient from './axiosConfig';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, GetUserByEmailResponse, UpdateUserRequest } from "@/types/api/index";
import { User } from "@/types/common/index";

export const userApi = {
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/users/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  getUserByEmail: async (email: string): Promise<GetUserByEmailResponse> => {
    const response = await apiClient.get(`/users/email/${email}`);
    return response.data;
  },

  updateCurrentUser: async (userData: UpdateUserRequest) => {
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  }
};
