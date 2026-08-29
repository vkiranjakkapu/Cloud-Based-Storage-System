import type { ReactNode } from "react";
import SidebarLayout from "./SidebarLayout";

export type DashboardLayoutProps = {
    children: [ReactNode, ReactNode?];
    override?: boolean;
};

export default function DashboardLayout({
    children,
    override = false,
}: DashboardLayoutProps) {
    const [dashboard, focusMenu] = children;

    return (
        <SidebarLayout>
            {/* Dashboard View */}
            {override ? (
                <section className="p-2">{dashboard}</section>
            ) : (
                <section className="relative p-2 rounded-xl overflow-clip text-secondary dark:text-cool">
                    <div className="absolute inset-0 bg-white/70 dark:bg-secondary backdrop-blur-md"></div>
                    <div className="relative">{dashboard}</div>
                </section>
            )}

            {/* Focus Menu Aside Nav */}
            {focusMenu}
        </SidebarLayout>
    );
}
