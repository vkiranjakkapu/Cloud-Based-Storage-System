import DashboardLayout from "../../components/layouts/dashboard/DashboardLayout";

export default function ProfilePage() {
    return (
        <DashboardLayout>
            {[<h1>Welcome User</h1>, <nav>Focus Menu</nav>]}
        </DashboardLayout>
    );
}
