export const AppConfig = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    IDENTITY_AUTH_URL: "identity/api/v1/auth",
    IDENTITY_PROFILE_URL: "identity/api/v1/users",
    STORAGE_SERVICE_URL: "storage/api/v1",
    FILE_URL: "storage/api/v1/files",
    SHARES_URL: "storage/api/v1/shares",
    REPORTS_SERVICE_URL: "reports/api/v1",

    LOCAL_AUTH_KEY: "cbss_auth",
    PUBLIC_ENDPOINTS: ["/auth/", "/users/register"],
};
