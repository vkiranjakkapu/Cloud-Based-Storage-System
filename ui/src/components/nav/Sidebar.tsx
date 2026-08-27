import { XMarkIcon } from "@heroicons/react/16/solid";
import {
    ArrowLeftStartOnRectangleIcon,
    ChartPieIcon,
    FolderIcon,
    IdentificationIcon,
    MoonIcon,
    SunIcon,
    UsersIcon,
} from "@heroicons/react/24/solid";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import usePrincipal from "../../context/usePrincipal";
import { RoutePaths } from "../../routes/RoutePaths";
import type { IconProps } from "../Commons";
import IconComponent from "../IconComponent";
import FavIcon from "/favicon.png";
import Avatar from "/undraw_fitness-influencer-avatar_04j0.svg";

interface NavItem {
    label: string;
    route: string;
    icon: IconProps;
    roles: string[];
}

export type SidebarProps = {
    children?: ReactNode;
    isDarkMode: boolean;
    toggleTheme: () => void;
    toggleMenu: () => void;
};

export default function Sidebar({
    children,
    isDarkMode,
    toggleTheme,
    toggleMenu,
}: SidebarProps) {
    const navigate = useNavigate();
    const { profile } = usePrincipal();

    const navPaths: NavItem[] = [
        {
            label: "Home",
            route: RoutePaths.DASHBOARD,
            icon: ChartPieIcon,
            roles: ["ADMIN", "USER"],
        },
        {
            label: "Files",
            route: RoutePaths.DIRECTORY,
            icon: FolderIcon,
            roles: ["ADMIN", "USER"],
        },
        {
            label: "Groups",
            route: RoutePaths.GROUPS,
            icon: UsersIcon,
            roles: ["ADMIN", "USER"],
        },
        {
            label: "Users",
            route: RoutePaths.USERS,
            icon: IdentificationIcon,
            roles: ["ADMIN"],
        },
    ];

    return (
        <div className="flex flex-row h-full divide-x divide-slate-300 dark:divide-cool/30">
            {/* Menu */}
            <nav
                className={`flex p-2 py-3 flex-col gap-2 items-center justify-between`}
            >
                {/* Header Brand Info */}
                <img
                    src={FavIcon}
                    alt="CBSS LOGO"
                    className="size-10 shadow-sm rounded-xl border border-primary"
                />

                {/* Menu Items */}
                <ul className="flex flex-col items-center gap-3 text-xs text-center *:flex *:flex-col">
                    {navPaths.map((item, idx) => {
                        if (profile && !item.roles.includes(profile.roles[0])) {
                            return;
                        }

                        const isActive =
                            location.pathname === item.route ||
                            location.pathname.startsWith(`${item.route}/`);

                        return (
                            <li
                                key={idx}
                                className="group cursor-pointer"
                                onClick={() => {
                                    navigate(item.route);
                                }}
                            >
                                <IconComponent
                                    icon={item.icon}
                                    theme={isActive ? `secondary` : ""}
                                />
                                <span>{item.label}</span>
                            </li>
                        );
                    })}
                </ul>

                {/* Bottom Menu */}
                <ul className="flex flex-col gap-3 text-xs text-center *:flex *:flex-col">
                    <li className="group cursor-pointer" onClick={toggleTheme}>
                        <IconComponent
                            icon={isDarkMode ? SunIcon : MoonIcon}
                            theme="secondary-blur"
                        />
                    </li>
                    <li className="border-t border-slate-300 dark:border-cool/50 w-1/2 mx-auto"></li>
                    <li
                        className={`size-8 shadow-sm rounded-full mx-auto group cursor-pointer 
                            outline outline-cool dark:outline-cool
                            hover:outline-offset-1 hover:outline-primary
                            ${location.pathname === RoutePaths.PROFILE ? "outline-offset-1 outline-primary dark:outline-primary" : ""}
                            transition-all duration-100`}
                        onClick={() => navigate(RoutePaths.PROFILE)}
                    >
                        <img
                            src={Avatar}
                            alt="User Avatar"
                            className="size-full"
                        />
                    </li>
                    <li className="group cursor-pointer" onClick={() => {}}>
                        <IconComponent
                            icon={ArrowLeftStartOnRectangleIcon}
                            hoverEffect="group-hover:bg-rose-500!"
                            customiseIcon="size-4.5 text-rose-400! group-hover:text-white!"
                        />
                        <span>Logout</span>
                    </li>
                </ul>
            </nav>

            {/* Focus Menu */}
            {children && (
                <nav className="flex-1 flex flex-col items-center *:p-2.5 *:space-y-3 divide-y divide-slate-300 dark:divide-cool/30">
                    {/* Page Title */}
                    <div className="w-full space-y-3">
                        <div className="inline-flex gap-2 justify-between items-center w-full">
                            <h5 className="text-sm font-semibold  uppercase">
                                {(() => {
                                    const page = navPaths.find(
                                        (item) =>
                                            location.pathname === item.route ||
                                            location.pathname.startsWith(
                                                `${item.route}/`,
                                            ),
                                    );

                                    return !page
                                        ? location.pathname.split("/")[1]
                                        : page.label;
                                })()}
                            </h5>
                            {/* Mobile Close Button */}
                            <div className="md:hidden">
                                <IconComponent
                                    icon={XMarkIcon}
                                    onClick={toggleMenu}
                                    customise="size-7"
                                    customiseIcon="size-4"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Page Specific Content */}
                    {children}
                </nav>
            )}
        </div>
    );
}
