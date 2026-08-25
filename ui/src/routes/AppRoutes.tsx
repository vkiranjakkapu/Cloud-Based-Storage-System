import { Route, Routes } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import { RoutePaths } from "./RoutePaths";
import LandingPage from "../pages/landing/LandingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={RoutePaths.HOME} element={<LandingPage />}></Route>
      <Route element={<ProtectedLayout />}>
        <Route path={RoutePaths.DASHBOARD} element={<Dashboard />}></Route>
      </Route>
    </Routes>
  );
}
