import { apiClient, type ApiResponse, type ErrorResponse } from "../api/api";
import type { Folder } from "./DirectoryService";
import type { Group } from "./GroupsService";

class FileService {
    async getFileById<T>(
        fileId: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "storage",
            uri: "/files/" + fileId,
        });
    }
    async getFileVersions<T>(
        fileId: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "storage",
            uri: "/files/versions/" + fileId,
        });
    }
    async updateFile<T>(
        payload: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "storage",
            uri: "/files/",
            payload,
        });
    }
    async deleteFile<T>(
        fileId: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "delete",
            service: "storage",
            uri: "/files/" + fileId,
        });
    }
}

export default new FileService();

export type MetaFile = {
    id: string;
    fileName: string;
    fileSize: number;
    filePath: string;
    folder: Folder;
    mimeType: string;
    ownerId: string;
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
