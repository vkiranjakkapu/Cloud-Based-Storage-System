import DashboardLayout from "../../components/layouts/DashboardLayout";
import SectionLayout from "../../components/layouts/SectionLayout";

export default function Dashboard() {
    return (
        <DashboardLayout>
            {[
                <SectionLayout title="Dashboard" description="Welcome back, user.">
                    <h1>Dashboard </h1>
                </SectionLayout>,
            ]}
        </DashboardLayout>
    );
}
