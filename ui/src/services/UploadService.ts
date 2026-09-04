import type { AxiosProgressEvent } from "axios";
import { apiClient, type ApiResponse, type ErrorResponse } from "../api/api";

export interface UploadProgressDetails {
    loaded: number;
    total: number;
    percentage: number;
}

export type UploadRequest = {
    folderId?: string;
    file: File;
};

class UploadService {
    async uploadFile<T>(
        payload: UploadRequest,
        onProgress: (progressDetails: UploadProgressDetails) => void,
        signal?: AbortSignal,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "storage",
            uri: "/uploads/",
            payload,
            config: {
                signal,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const loaded = progressEvent.loaded;

                    // Fallback to file.size if total is undefined
                    const total = progressEvent.total || payload.file.size;

                    const percentage = Math.round((loaded * 100) / total);

                    onProgress({
                        loaded,
                        total,
                        percentage,
                    });
                },
            },
        });
    }
}

export default new UploadService();
