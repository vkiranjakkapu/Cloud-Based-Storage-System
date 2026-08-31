import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/nav/Navbar";
import usePrincipal from "../../context/usePrincipal";
import { RoutePaths } from "../RoutePaths";

export default function LandingLayout() {
    const { isLoggedIn } = usePrincipal();
    const currentLocation = useLocation();

    if (isLoggedIn) {
        return (
            <Navigate
                to={
                    currentLocation.pathname == RoutePaths.HOME
                        ? RoutePaths.DASHBOARD
                        : currentLocation
                }
                replace
            />
        );
    }

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}
