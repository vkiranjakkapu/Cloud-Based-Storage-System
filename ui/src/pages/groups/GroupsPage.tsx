import DashboardLayout from "../../components/layouts/DashboardLayout";
import FocusMenu from "../../components/nav/FocusMenu";
import usePrincipal from "../../context/usePrincipal";

export default function GroupsPage() {
    const { profile } = usePrincipal();
    return (
        <DashboardLayout>
            {[
                <h1>Welcome {profile?.name}</h1>,
                <FocusMenu>
                    <h1>Menu</h1>
                </FocusMenu>,
            ]}
        </DashboardLayout>
    );
}
