import { apiClient, type ApiResponse, type ErrorResponse } from "../api/api";
import type { UserProfile } from "../context/usePrincipal";
import type { Folder } from "./DirectoryService";
import type { Group } from "./GroupsService";

class FileService {
    async getSharedFiles<T>(): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "shares",
            uri: "/",
        });
    }
    async getLatestFiles<T>(): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "files",
            uri: "/latest",
        });
    }
    async getFileContent<T>(
        fileId?: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "files",
            uri: "/" + fileId + "/content",
            rawResponse: true,
            config: {
                responseType: "blob",
            },
        });
    }

    async getFileById<T>(
        fileId: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "files",
            uri: "/" + fileId,
        });
    }

    async getFileVersions<T>(
        fileId: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "files",
            uri: "/versions/" + fileId,
        });
    }

    async updateFile<T>(
        payload: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "files",
            uri: "/",
            payload,
        });
    }

    async deleteFile<T>(
        fileId: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "delete",
            service: "files",
            uri: "/" + fileId,
        });
    }
}

export default new FileService();

export type LatestFiles = {
    file: MetaFile;
    createdAt: string;
    owner: UserProfile;
    shared: boolean;
};

export type MetaFile = {
    id: string;
    fileName: string;
    fileSize: number;
    filePath: string;
    folder: Folder;
    mimeType: string;
    ownerId: string;
    owner?: UserProfile;
    accesses: FileAccess[];
    shares: SharedFile[];
    isLatest: boolean;
    isDeleted: boolean;
    modifiedDate: string;
    createdAt: string;
};

export type FileAccess = {
    id: number;
    file: File;
    userId: string;
    group: Group;
    type: AccessType;
    createdAt: string;
};

export const AccessType = {
    OWNER: "OWNER",
    MEMBER: "MEMBER",
    GROUP: "GROUP",
} as const;

export type AccessType = (typeof AccessType)[keyof typeof AccessType];

export type SharedFile = {
    id: string;
    file: MetaFile;
    type: ShareType;
    userId: string;
    expiry: string;
    updatedAt: string;
    createdAt: string;
};

export const ShareType = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
};

export type ShareType = (typeof ShareType)[keyof typeof ShareType];
