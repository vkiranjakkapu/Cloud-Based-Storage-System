import DashboardLayout from "../../components/layouts/DashboardLayout";
import usePrincipal from "../../context/usePrincipal";

export default function GroupsPage() {
    const { profile } = usePrincipal();
    return (
        <DashboardLayout>
            {[<h1>Welcome {profile?.name}</h1>, <nav>Focus Menu</nav>]}
        </DashboardLayout>
    );
}
