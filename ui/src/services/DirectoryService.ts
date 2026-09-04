import { apiClient, type ApiResponse, type ErrorResponse } from "../api/api";
import type { MetaFile } from "./FileService";
import type { Group } from "./GroupsService";

class DirectoryService {
    async deleteFolder<T>(
        folderId: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "delete",
            service: "storage",
            uri: "/" + folderId,
        });
    }

    async getFolderTree<T>(): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "storage",
            uri: "/tree",
        });
    }

    async addFolder<T>(
        payload: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "storage",
            uri: "/",
            payload,
        });
    }

    async updateFolder<T>(
        payload: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "patch",
            service: "storage",
            uri: "/",
            payload,
        });
    }

    async getDirectoryContents<T>(
        directory?: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "storage",
            uri: directory ? "/" + directory : "/",
        });
    }
}

export default new DirectoryService();

export type TreeResponseDto = {
    parent: Folder;
    children: TreeResponseDto[];
};

export type DirectoryResponse = {
    current: Folder;
    parentFolders: Folder[];
    subFolders: Folder[];
    files: MetaFile[];
    sharedFiles: MetaFile[];
};

export type UpdateFolderRequest = {
    id: string;
    name: string;
    targetId: string;
    type: UpdateType;
};

export const UpdateType = {
    RENAME: "RENAME",
    MOVE: "MOVE",
} as const;

export type UpdateType = (typeof UpdateType)[keyof typeof UpdateType];

export type Folder = {
    id: string;
    ownerId: string;
    name: string;
    isRoot: boolean;
    parent: Folder;
    children: Folder[];
    files: MetaFile[];
    group: Group;
    isDeleted: boolean;
    updatedAt: string;
    createdAt: string;
};
