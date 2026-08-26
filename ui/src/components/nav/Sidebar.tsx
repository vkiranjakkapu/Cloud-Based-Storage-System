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
    isDarkMode: boolean;
    toggleTheme: () => void;
    toggleMenu: () => void;
};

export default function Sidebar({
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
            route: RoutePaths.FILES,
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
            <nav className="w-1/5 flex p-2 py-3 flex-col gap-2 items-center justify-between">
                {/* Header Brand Info */}
                <img
                    src={FavIcon}
                    alt="CBSS LOGO"
                    className="size-10 shadow-sm rounded-xl border border-primary"
                />

                {/* Menu Items */}
                <ul className="flex flex-col items-center gap-3 text-xs text-center">
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
                <ul className="flex flex-col gap-3 text-xs text-center">
                    <li
                        className="group cursor-pointer"
                        onClick={() => navigate(RoutePaths.PROFILE)}
                    >
                        <img
                            src={Avatar}
                            alt="User Avatar"
                            className="size-8 rounded-full mx-auto outline outline-primary dark:outline-cool outline-offset-1"
                        />
                    </li>
                    <li className="border-t border-slate-300 dark:border-cool/50 w-1/2 mx-auto"></li>
                    <li className="group cursor-pointer" onClick={toggleTheme}>
                        <IconComponent icon={isDarkMode ? SunIcon : MoonIcon} />
                    </li>
                    <li className="group cursor-pointer" onClick={() => {}}>
                        <IconComponent
                            icon={ArrowLeftStartOnRectangleIcon}
                            hoverEffect="group-hover:bg-rose-500!"
                            customiseIcon="size-4.5 text-rose-400 group-hover:text-white!"
                        />
                        <span>Logout</span>
                    </li>
                </ul>
            </nav>

            {/* Focus Menu */}
            <nav className="flex-1 flex flex-col items-center *:p-2 divide-y divide-slate-300 dark:divide-cool/30">
                {/* Page Title */}
                <div className="w-full space-y-3">
                    <div className="inline-flex gap-2 justify-between items-center w-full">
                        <h5 className="text-sm font-semibold text-secondary dark:text-cool uppercase">
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
                    {/* <InputComponent
                        label={{ icon: MagnifyingGlassIcon }}
                        type="text"
                        id="search"
                        placeholder={"Search"}
                        customise="rounded-full!"
                    /> */}
                </div>

                {/* Page Specific Content */}
                <div className="flex-1 container">
                    <DividerComponent text="Recent Files" />
                </div>
            </nav>
        </div>
    );
}

type DividerComponentProps = {
    text: string;
    icon?: IconProps;
};

function DividerComponent({ text, icon }: DividerComponentProps) {
    return (
        <div className="inline-flex items-center justify-between text-slate-500/60 dark:text-cool/40 w-full pointer-events-none">
            <h2 className="text-xs uppercase font-semibold">{text}</h2>
            {icon && (
                <IconComponent
                    icon={icon}
                    customise="size-6"
                    customiseIcon="size-4"
                    theme="secondary-blur"
                />
            )}
        </div>
    );
}
