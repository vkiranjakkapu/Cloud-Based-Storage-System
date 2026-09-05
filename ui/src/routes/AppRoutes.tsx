import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import DirectoryPage from "../pages/directory/DirectoryPage";
import GroupsPage from "../pages/groups/GroupsPage";
import LandingPage from "../pages/landing/LandingPage";
import ProfilePage from "../pages/profile/ProfilePage";
import UsersPage from "../pages/users/UsersPage";
import AdminLayout from "./layouts/AdminLayout";
import LandingLayout from "./layouts/LandingLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { RoutePaths } from "./RoutePaths";
import FilePage from "../pages/file/FilePage";
import SharedPage from "../pages/shared/SharedPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LandingLayout />}>
                <Route path={RoutePaths.HOME} element={<LandingPage />}></Route>
            </Route>
            <Route element={<ProtectedLayout />}>
                <Route path={RoutePaths.DASHBOARD} element={<Dashboard />} />
                <Route
                    path={RoutePaths.DIRECTORY}
                    element={<DirectoryPage />}
                />
                <Route
                    path={RoutePaths.FOLDER}
                    element={<DirectoryPage />}
                />
                <Route
                    path={RoutePaths.FILE}
                    element={<FilePage />}
                />
                <Route
                    path={RoutePaths.SHARED}
                    element={<SharedPage />}
                />
                <Route path={RoutePaths.GROUPS} element={<GroupsPage />} />
                <Route path={RoutePaths.PROFILE} element={<ProfilePage />} />
                <Route path={RoutePaths.USER} element={<ProfilePage />} />
                <Route element={<AdminLayout />}>
                    <Route path={RoutePaths.USERS} element={<UsersPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
