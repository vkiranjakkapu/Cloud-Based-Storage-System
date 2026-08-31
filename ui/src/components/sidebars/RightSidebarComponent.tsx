import { XMarkIcon } from "@heroicons/react/24/outline";
import { type HTMLAttributes, type ReactNode } from "react";
import IconComponent from "../IconComponent";
import DashboardSection from "../layouts/DashboardSection";

export type RightSidebarComponentProps = HTMLAttributes<HTMLElement> & {
    children: ReactNode;
    className?: string;
    useDirectoryTheme?: string;
    active: boolean;
    handleSidebarClose: () => void;
};

export default function SidebarComponent({
    children,
    className,
    useDirectoryTheme,
    active = true,
    handleSidebarClose,
    ...props
}: RightSidebarComponentProps) {
    return (
        <aside
            {...props}
            className={`fixed z-50 right-0 rounded-l-lg overflow-hidden h-full 
                shadow-md border
                border-slate-200 dark:border-cool/15
                **:border-slate-200 **:dark:border-cool/15
                
                ${active ? `w-84` : `w-0`}
                ${className}
            `}
        >
            <DashboardSection
                useDirectoryTheme={useDirectoryTheme}
                className="h-full rounded-r-none p-4!"
            >
                <div className="flex justify-between items-center border-b">
                    <IconComponent
                        theme="secondary-blur"
                        icon={XMarkIcon}
                        onClick={handleSidebarClose}
                    />
                </div>
                <div className="mt-3 p-2">{children}</div>
            </DashboardSection>
        </aside>
    );
}
