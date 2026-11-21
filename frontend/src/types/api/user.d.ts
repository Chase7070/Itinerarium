import { User } from '@/types/common/user';

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    avatar?: string;
}

export interface RegisterResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}


export interface UpdateUserRequest {
    username?: string;
    password?: string;
    avatar?: string;
}

export interface GetUserByEmailResponse {
    user: User;
}