import { apiClient, type ApiResponse, type ErrorResponse } from "../api/api";
import type { RoleType } from "../context/usePrincipal";
import TokenStorage from "../storage/TokenStorage";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

class AuthService {
    async getMe<T>(): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "profile",
            uri: "/me",
        });
    }

    async register<T>(
        payload: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "profile",
            uri: "/register",
            payload,
        });
    }

    async login<T>(
        payload: LoginRequest,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "identity",
            uri: "/login",
            payload,
        });
    }

    async refresh<T>(
        refreshToken: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "identity",
            uri: "/refresh",
            payload: { refreshToken },
        });
    }

    async logout<T>(): Promise<ApiResponse<T> | ErrorResponse> {
        const refreshToken = TokenStorage.getRefreshToken();
        return apiClient({
            type: "post",
            service: "identity",
            uri: "/logout",
            payload: { refreshToken },
        });
    }
    async getUserById<T>(
        userId: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "profile",
            uri: "/" + userId,
        });
    }

    async getAllUsers<T>(
        role?: RoleType,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "profile",
            uri: role ? "/role/" + role : "/",
        });
    }

    async createUser<T>(
        payload: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "profile",
            uri: "/",
            payload,
        });
    }

    async updateProfile<T>(
        id: string,
        payload: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "put",
            service: "profile",
            uri: "/" + id,
            payload,
        });
    }

    async changePassword<T>(
        payload: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "patch",
            service: "profile",
            uri: "/",
            payload,
        });
    }

    async deleteProfile<T>(
        id: number,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "delete",
            service: "profile",
            uri: "/" + id,
        });
    }
}

export default new AuthService();
