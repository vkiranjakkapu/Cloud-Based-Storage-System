import type { ReactNode } from "react";
import type { RightSidebarComponentProps } from "../sidebars/RightSidebarComponent";
import NavSidebarLayout from "./NavSidebarLayout";

export type DashboardLayoutProps = {
    children: [ReactNode, ReactNode?];
    override?: boolean;
    useRightSidebar?: RightSidebarComponentProps;
};

export default function DashboardLayout({
    children,
    override = false,
    useRightSidebar,
}: DashboardLayoutProps) {
    const [dashboard, focusMenu] = children;

    return (
        <NavSidebarLayout rightSidebar={useRightSidebar}>
            {/* Dashboard View */}
            {override ? (
                <section className="p-2 py-0">{dashboard}</section>
            ) : (
                <section className="relative p-6 rounded-xl overflow-clip text-secondary dark:text-cool">
                    <div className="absolute inset-0 bg-white/70 dark:bg-secondary backdrop-blur-md"></div>
                    <div className="relative">{dashboard}</div>
                </section>
            )}
            {/* Focus Menu Aside Nav */}
            {focusMenu}
        </NavSidebarLayout>
    );
}
