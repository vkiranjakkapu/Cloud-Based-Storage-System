import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSection from "../../components/layouts/DashboardSection";
import usePrincipal from "../../context/usePrincipal";

export default function Dashboard() {
    const { profile } = usePrincipal();
    return (
        <DashboardLayout>
            {[
                <DashboardSection
                    header={{
                        title: "Dashboard",
                        description: `Welcome back, ${profile?.name}.`,
                    }}
                >
                    <h1>Dashboard </h1>
                </DashboardSection>,
            ]}
        </DashboardLayout>
    );
}
