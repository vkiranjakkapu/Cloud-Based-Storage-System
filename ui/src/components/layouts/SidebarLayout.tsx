import { Bars3Icon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "../nav/Sidebar";
import FavIcon from "/favicon.png";
import IconComponent from "../IconComponent";

export type SidebarLayoutProps = {
    children: ReactNode;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return (
                document.documentElement.classList.contains("dark") ||
                localStorage.getItem("theme") === "dark"
            );
        }
        return true;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    const toggleTheme = (): void => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden transition-colors duration-300">
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-cool/20 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <aside
                className={`
					fixed inset-y-0 left-0 z-50 flex w-76 flex-col 
                    transition-transform duration-300 ease-in-out
                    rounded-e-xl overflow-hidden
					dark:text-cool bg-white/70 dark:bg-secondary backdrop-blur-md
					border-r border-slate-200 dark:border-cool/30
					md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
				`}
            >
                <Sidebar
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    toggleMenu={() => setIsOpen(!isOpen)}
                />
            </aside>

            {/* RIGHT VIEWPORT VIEW CANVAS */}
            <div className="flex flex-1 flex-col md:pl-76 h-full w-full">
                {/* Top Sticky Header for Mobile */}
                <header className="flex h-16 items-center justify-between border-b px-4 md:hidden border-gray-200 bg-white dark:border-secondary-dark dark:bg-secondary">
                    <img
                        src={FavIcon}
                        alt="IMS"
                        width="40px"
                        className="rounded-lg shadow-sm border border-primary"
                    />
                    <h1 className="text-center text-lg font-semibold text-secondary dark:text-cool">
                        Cloud Based Storage System
                    </h1>
                    <div className="space-x-2">
                        <IconComponent
                            icon={isDarkMode ? SunIcon : MoonIcon}
                            onClick={toggleTheme}
                        />
                        <IconComponent
                            icon={Bars3Icon}
                            onClick={() => setIsOpen(!isOpen)}
                        />
                    </div>
                </header>

                {/* Main Context Canvas View */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children ?? (
                        <>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Workspace
                            </h1>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
