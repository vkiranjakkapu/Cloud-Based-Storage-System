import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSection from "../../components/layouts/DashboardSection";

export default function Dashboard() {
    return (
        <DashboardLayout>
            {[
                <DashboardSection
                    header={{
                        title: "Dashboard",
                        description: "Welcome back, user.",
                    }}
                >
                    <h1>Dashboard </h1>
                </DashboardSection>,
            ]}
        </DashboardLayout>
    );
}
