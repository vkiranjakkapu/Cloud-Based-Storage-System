import DashboardLayout from "../../components/layouts/dashboard/DashboardLayout";
import DashboardSectionLayout from "../../components/layouts/dashboard/DashboardSectionLayout";

export default function Dashboard() {
    return (
        <DashboardLayout>
            {[
                <DashboardSectionLayout title="Dashboard" description="Welcome back, user.">
                    <h1>Dashboard </h1>
                </DashboardSectionLayout>,
            ]}
        </DashboardLayout>
    );
}
