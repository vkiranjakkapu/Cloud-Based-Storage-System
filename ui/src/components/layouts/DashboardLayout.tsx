import type { ReactNode } from "react";
import type { RightSidebarComponentProps } from "../sidebars/RightSidebarComponent";
import SpinnerComponent, {
    type SpinnerComponentProps,
} from "../SpinnerComponent";
import NavSidebarLayout from "./NavSidebarLayout";

export type DashboardLayoutProps = {
    children: [ReactNode, ReactNode?];
    spinner?: SpinnerComponentProps & {
        isLoading: boolean;
    };
    override?: boolean;
    useRightSidebar?: RightSidebarComponentProps;
};

export default function DashboardLayout({
    children,
    spinner,
    override = false,
    useRightSidebar,
}: DashboardLayoutProps) {
    const [dashboard, focusMenu] = children;

    return (
        <NavSidebarLayout rightSidebar={useRightSidebar}>
            {/* Dashboard View */}
            {override ? (
                <section className="p-2 py-0">
                    {spinner && spinner.isLoading ? (
                        <SpinnerComponent {...spinner} />
                    ) : (
                        dashboard
                    )}
                </section>
            ) : (
                <section className="relative p-6 rounded-xl overflow-clip text-secondary dark:text-cool">
                    <div className="absolute inset-0 bg-white/70 dark:bg-secondary backdrop-blur-md"></div>
                    <div className="relative">
                        {spinner && spinner.isLoading ? (
                            <SpinnerComponent {...spinner} />
                        ) : (
                            dashboard
                        )}
                    </div>
                </section>
            )}
            {/* Focus Menu Aside Nav */}
            {focusMenu}
        </NavSidebarLayout>
    );
}
