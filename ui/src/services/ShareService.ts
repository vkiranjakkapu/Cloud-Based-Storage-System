import { apiClient, type ApiResponse, type ErrorResponse } from "../api/api";
import type { UserProfile } from "../context/usePrincipal";
import type { SharedFile } from "./FileService";

class ShareService {
    async removeAccess<T>(
        accessId: string,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "delete",
            service: "shares",
            uri: "/" + accessId,
        });
    }

    async shareFileWithUserIds<T>(
        payload: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "storage",
            uri: "/shares/",
            payload,
        });
    }

    async getSharedWithUsers<T>(
        fileId: unknown,
    ): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "shares",
            uri: "/users/" + fileId,
        });
    }
}

export default new ShareService();

export type AccessRecord = {
    share: SharedFile;
    user: UserProfile;
};
