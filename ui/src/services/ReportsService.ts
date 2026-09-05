import { apiClient, type ApiResponse, type ErrorResponse } from "../api/api";

class ReportsService {
    async getFileReports<T>(): Promise<ApiResponse<T> | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "reports",
            uri: "/files",
        });
    }
}

export type FileReport = {
    type: string;
    totalSize: number;
    fileCount: number;
};

export default new ReportsService();
