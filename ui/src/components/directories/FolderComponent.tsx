import { ShareIcon } from "@heroicons/react/20/solid";
import {
    EllipsisVerticalIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import IconComponent from "../IconComponent";
import DuoFolderIcon from "../icons/DuoFolderIcon";

type FolderComponentProps = {
    folder?: unknown;
};

export function FolderComponent({ folder }: FolderComponentProps) {
    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <div
            className={`text-center relative p-2 rounded-xl cursor-pointer 

                ${
                    isActive &&
                    `backdrop-blur-lg
                bg-slate-200/60 dark:bg-secondary-dark/50
                [&>.folder]:text-primary [&>.folder]:scale-105
                [&>.menu]:visible`
                }
                
                hover:backdrop-blur-lg
                hover:bg-slate-200/60 hover:dark:bg-secondary-dark/50
                hover:[&>.folder]:text-primary hover:[&>.folder]:scale-105

                [&>.menu]:invisible hover:[&>.menu]:visible
                *:transition-all *:duration-100`}
        >
            <div className="absolute z-2 right-0 pr-1 menu">
                <IconComponent
                    theme={isActive ? `primary` : `secondary-blur`}
                    customise="size-6.5"
                    icon={isActive ? XMarkIcon : EllipsisVerticalIcon}
                    customiseIcon="size-4"
                    onClick={() => setIsActive(!isActive)}
                />
            </div>
            <div className="absolute z-1 right-0 pr-1">
                <div
                    className={`flex flex-col gap-1 
                    *:transition-all *:duration-150`}
                >
                    <IconComponent
                        customise={`size-6.5 ${isActive ? "translate-y-7.5" : "invisible pointer-events-none"}`}
                        theme="secondary-blur"
                        icon={PencilIcon}
                        customiseIcon="size-3.5"
                    />
                    <IconComponent
                        customise={`size-6.5 duration-300! ${isActive ? "translate-y-7.5" : "-translate-y-7.5 invisible pointer-events-none"}`}
                        theme="secondary-blur"
                        icon={ShareIcon}
                        customiseIcon="size-3.5"
                    />
                    <IconComponent
                        customise={`size-6.5 duration-450! ${isActive ? "translate-y-7.5" : "-translate-y-15 invisible pointer-events-none"}`}
                        theme="secondary-blur"
                        icon={TrashIcon}
                        customiseIcon="size-3.5"
                    />
                </div>
            </div>
            <DuoFolderIcon
                className="folder size-20 mx-auto text-secondary-light dark:text-warm"
                shadowColor="text-white dark:text-white/30"
            />
            <div className="text-sm min-w-0">
                <h2 className="w-full truncate block font-medium">
                    {JSON.stringify(folder)}
                    Labmantix Projects
                </h2>
                <span className="text-xs opacity-60">2 items</span>
            </div>
        </div>
    );
}
