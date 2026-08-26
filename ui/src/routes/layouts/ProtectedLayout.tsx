import { Outlet } from "react-router-dom";
import SidebarLayout from "../../components/layouts/SidebarLayout";

export default function ProtectedLayout() {
    return (
        <SidebarLayout>
            <Outlet />
        </SidebarLayout>
    );
}
