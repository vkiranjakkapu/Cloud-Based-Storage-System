import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import DirectoryPage from "../pages/files/DirectoryPage";
import GroupsPage from "../pages/groups/GroupsPage";
import LandingPage from "../pages/landing/LandingPage";
import ProfilePage from "../pages/profile/ProfilePage";
import UsersPage from "../pages/users/UsersPage";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { RoutePaths } from "./RoutePaths";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path={RoutePaths.HOME} element={<LandingPage />}></Route>
            <Route element={<ProtectedLayout />}>
                <Route path={RoutePaths.DASHBOARD} element={<Dashboard />} />
                <Route path={RoutePaths.DIRECTORY} element={<DirectoryPage />} />
                <Route path={RoutePaths.GROUPS} element={<GroupsPage />} />
                <Route path={RoutePaths.PROFILE} element={<ProfilePage />} />
                <Route element={<AdminLayout />}>
                    <Route path={RoutePaths.USERS} element={<UsersPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
