export const RoutePaths = {
    HOME: "/",

    DASHBOARD: "/dashboard",

    GROUPS: "/groups",

    DIRECTORY: "/directory",
    FOLDER: "/directory/:folderId",
    FILE: "/directory/:folderId/:fileId",

    USERS: "/users",
    PROFILE: "/profile",
    USER: "/profile/:userId",
} as const;
