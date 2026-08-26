import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Files from "../pages/files/Files";
import Groups from "../pages/groups/Groups";
import LandingPage from "../pages/landing/LandingPage";
import Profile from "../pages/profile/Profile";
import Users from "../pages/users/Users";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { RoutePaths } from "./RoutePaths";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path={RoutePaths.HOME} element={<LandingPage />}></Route>
            <Route element={<ProtectedLayout />}>
                <Route path={RoutePaths.DASHBOARD} element={<Dashboard />} />
                <Route path={RoutePaths.FILES} element={<Files />} />
                <Route path={RoutePaths.GROUPS} element={<Groups />} />
                <Route path={RoutePaths.PROFILE} element={<Profile />} />
                <Route element={<AdminLayout />}>
                    <Route path={RoutePaths.USERS} element={<Users />} />
                </Route>
            </Route>
        </Routes>
    );
}
