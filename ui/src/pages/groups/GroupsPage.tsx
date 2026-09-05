import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/24/outline";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DividerComponent from "../../components/nav/DividerComponent";
import FocusMenu from "../../components/nav/FocusMenu";
import usePrincipal from "../../context/usePrincipal";
import InputComponent from "../../components/form/InputComponent";
import SharedUserComponent from "../../components/SheredUserComponent";

export default function GroupsPage() {
    const { profile } = usePrincipal();
    return (
        <DashboardLayout>
            {[
                <h1>Welcome {profile?.name}</h1>,
                <FocusMenu>
                    <div className="container">
                        <DividerComponent text="groups" icon={UsersIcon} />
                        <InputComponent
                            id="groupSearch"
                            label={{
                                icon: MagnifyingGlassIcon,
                            }}
                            customise="rounded-full!"
                            placeholder="Group Name"
                        />
                    </div>
                    <div className="container">
                        <DividerComponent text="Participants" icon={UsersIcon} />
                        <SharedUserComponent />
                    </div>
                </FocusMenu>,
            ]}
        </DashboardLayout>
    );
}
