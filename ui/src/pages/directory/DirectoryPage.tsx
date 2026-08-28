import {
    ChevronRightIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
} from "@heroicons/react/16/solid";
import {
    ChevronDownIcon,
    DocumentDuplicateIcon,
    DocumentTextIcon,
    EllipsisHorizontalIcon,
    FolderOpenIcon,
    SpeakerWaveIcon,
    VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { FolderIcon } from "@heroicons/react/24/solid";
import InputComponent from "../../components/form/InputComponent";
import IconComponent from "../../components/IconComponent";
import DashboardLayout from "../../components/layouts/dashboard/DashboardLayout";
import DividerComponent from "../../components/nav/DividerComponent";
import FocusMenu from "../../components/nav/FocusMenu";
import FolderDetails from "./FolderDetails";

export default function DirectoryPage() {
    return (
        <DashboardLayout override={true}>
            {[
                <div className="">
                    <FolderDetails />
                </div>,

                // Focus Menu
                <FocusMenu>
                    {/* Folders */}
                    <div className="container">
                        <DividerComponent
                            text="Categories"
                            icon={FolderOpenIcon}
                            // inline={true}
                        />
                        <ul
                            className={`
                            *:p-1 *:pl-5 *:first:pl-0 *:cursor-pointer space-y-2
                            *:not-first:hover:bg-warm/60 *:not-first:dark:hover:bg-secondary-dark *:rounded-full
                            *:flex *:first:justify-start *:justify-between *:gap-1 *:items-center
                            *:not-first:*:last:invisible [&>.active]:*:last:visible
                            *:*:first:inline-flex *:*:first:items-center *:*:first:gap-1.5 
                            [&>.active]:bg-primary [&>.active]:hover:bg-primary [&>.active]:text-white 
                            `}
                        >
                            <li className="pointer-events-none justify-between!">
                                <div className="">
                                    <DocumentDuplicateIcon className="size-4" />
                                    <span>All Files</span>
                                </div>
                                <ChevronDownIcon className="size-3" />
                            </li>
                            <li className="">
                                <div className="">
                                    <FolderIcon className="size-4" />
                                    <span>Videos</span>
                                    <IconComponent
                                        text={"8"}
                                        customise="size-4.5"
                                        theme="secondary-blur"
                                        hoverEffect="pointer-events-none"
                                    />
                                </div>
                                <IconComponent
                                    icon={ChevronRightIcon}
                                    customise="size-6"
                                    theme="blur"
                                    hoverEffect="pointer-events-none"
                                />
                            </li>
                            <li className="active">
                                <div className="">
                                    <FolderIcon className="size-4" />
                                    <span>Documents</span>
                                    <IconComponent
                                        text={"8"}
                                        customise="size-4.5"
                                        theme="secondary"
                                        hoverEffect="pointer-events-none"
                                    />
                                </div>
                                <IconComponent
                                    icon={ChevronRightIcon}
                                    customise="size-6"
                                    theme="blur"
                                    hoverEffect="pointer-events-none"
                                />
                            </li>
                            <li className="">
                                <div className="">
                                    <FolderIcon className="size-4" />
                                    <span>Images</span>
                                    <IconComponent
                                        text={"8"}
                                        customise="size-4.5"
                                        theme="secondary-blur"
                                    />
                                </div>
                                <IconComponent
                                    icon={ChevronRightIcon}
                                    customise="size-6"
                                    theme="blur"
                                    hoverEffect="pointer-events-none"
                                />
                            </li>
                            <li className="">
                                <div className="">
                                    <FolderIcon className="size-4" />
                                    <span>Random</span>
                                    <IconComponent
                                        text={"8"}
                                        customise="size-4.5"
                                        theme="secondary-blur"
                                    />
                                </div>
                                <IconComponent
                                    icon={ChevronRightIcon}
                                    customise="size-6"
                                    theme="blur"
                                    hoverEffect="pointer-events-none"
                                />
                            </li>
                        </ul>
                    </div>
                    {/* Files */}
                    <div className="container flex-1">
                        <DividerComponent
                            text="Latest Files"
                            icon={DocumentTextIcon}
                            // inline={true}
                        />
                        {/* Search */}
                        <InputComponent
                            id="searchFiles"
                            type="text"
                            label={{ icon: MagnifyingGlassIcon }}
                            placeholder="Search..."
                            customise="rounded-full!"
                            customiseInput="text-sm"
                        />
                        {/* Latest Files */}
                        <div className="space-y-1 *:cursor-pointer *:hover:bg-slate-50/70 *:dark:hover:bg-secondary-dark/60">
                            <div
                                className={`
                                    bg-white/70 backdrop-blur-sm dark:bg-secondary-dark rounded-lg border border-slate-200 dark:border-secondary p-1.5
                                    grid grid-cols-[auto_1fr_auto] gap-2
                                    *:inline-flex *:items-center *:justify-center
                                `}
                            >
                                <div className="bg-slate-200/60 dark:bg-secondary rounded size-10">
                                    <DocumentTextIcon className="size-5" />
                                </div>
                                <div className="flex-col items-start! min-w-0">
                                    <h2 className="text-sm truncate w-full">
                                        Annual Statement Annual Statement
                                    </h2>
                                    <span className="text-xs opacity-50">
                                        2 MB
                                    </span>
                                </div>
                                <div className="cursor-pointer group">
                                    <EllipsisHorizontalIcon className="size-5 pointer-events-none group-hover:text-primary" />
                                </div>
                            </div>
                            <div
                                className={`
                                    bg-white/70 backdrop-blur-sm dark:bg-secondary-dark rounded-lg border border-slate-200 dark:border-secondary p-1.5
                                    grid grid-cols-[auto_1fr_auto] gap-2
                                    *:inline-flex *:items-center *:justify-center
                                `}
                            >
                                <div className="bg-slate-200/60 dark:bg-secondary rounded size-10">
                                    <PhotoIcon className="size-5" />
                                </div>
                                <div className="flex-col items-start! min-w-0">
                                    <h2 className="text-sm truncate w-full">
                                        Annual Statement Annual Statement
                                    </h2>
                                    <span className="text-xs opacity-50">
                                        2 MB
                                    </span>
                                </div>
                                <div className="cursor-pointer group">
                                    <EllipsisHorizontalIcon className="size-5 pointer-events-none group-hover:text-primary" />
                                </div>
                            </div>
                            <div
                                className={`
                                    bg-white/70 backdrop-blur-sm dark:bg-secondary-dark rounded-lg border border-slate-200 dark:border-secondary p-1.5
                                    grid grid-cols-[auto_1fr_auto] gap-2
                                    *:inline-flex *:items-center *:justify-center
                                `}
                            >
                                <div className="bg-slate-200/60 dark:bg-secondary rounded size-10">
                                    <SpeakerWaveIcon className="size-5" />
                                </div>
                                <div className="flex-col items-start! min-w-0">
                                    <h2 className="text-sm truncate w-full">
                                        Annual Statement Annual Statement
                                    </h2>
                                    <span className="text-xs opacity-50">
                                        2 MB
                                    </span>
                                </div>
                                <div className="cursor-pointer group">
                                    <EllipsisHorizontalIcon className="size-5 pointer-events-none group-hover:text-primary" />
                                </div>
                            </div>
                            <div
                                className={`
                                    bg-white/70 backdrop-blur-sm dark:bg-secondary-dark rounded-lg border border-slate-200 dark:border-secondary p-1.5
                                    grid grid-cols-[auto_1fr_auto] gap-2
                                    *:inline-flex *:items-center *:justify-center
                                `}
                            >
                                <div className="bg-slate-200/60 dark:bg-secondary rounded size-10">
                                    <VideoCameraIcon className="size-5" />
                                </div>
                                <div className="flex-col items-start! min-w-0">
                                    <h2 className="text-sm truncate w-full">
                                        Annual Statement Annual Statement
                                    </h2>
                                    <span className="text-xs opacity-50">
                                        2 MB
                                    </span>
                                </div>
                                <div className="cursor-pointer group">
                                    <EllipsisHorizontalIcon className="size-5 pointer-events-none group-hover:text-primary" />
                                </div>
                            </div>
                            <div
                                className={`
                                    bg-white/70 backdrop-blur-sm dark:bg-secondary-dark rounded-lg border border-slate-200 dark:border-secondary p-1.5
                                    grid grid-cols-[auto_1fr_auto] gap-2
                                    *:inline-flex *:items-center *:justify-center
                                `}
                            >
                                <div className="bg-slate-200/60 dark:bg-secondary rounded size-10">
                                    <DocumentTextIcon className="size-5" />
                                </div>
                                <div className="flex-col items-start! min-w-0">
                                    <h2 className="text-sm truncate w-full">
                                        Annual Statement Annual Statement
                                    </h2>
                                    <span className="text-xs opacity-50">
                                        2 MB
                                    </span>
                                </div>
                                <div className="cursor-pointer group">
                                    <EllipsisHorizontalIcon className="size-5 pointer-events-none group-hover:text-primary" />
                                </div>
                            </div>
                            <div
                                className={`
                                    bg-white/70 backdrop-blur-sm dark:bg-secondary-dark rounded-lg border border-slate-200 dark:border-secondary p-1.5
                                    grid grid-cols-[auto_1fr_auto] gap-2
                                    *:inline-flex *:items-center *:justify-center
                                `}
                            >
                                <div className="bg-slate-200/60 dark:bg-secondary rounded size-10">
                                    <PhotoIcon className="size-5" />
                                </div>
                                <div className="flex-col items-start! min-w-0">
                                    <h2 className="text-sm truncate w-full">
                                        Annual Statement Annual Statement
                                    </h2>
                                    <span className="text-xs opacity-50">
                                        2 MB
                                    </span>
                                </div>
                                <div className="cursor-pointer group">
                                    <EllipsisHorizontalIcon className="size-5 pointer-events-none group-hover:text-primary" />
                                </div>
                            </div>
                            <div
                                className={`
                                    bg-white/70 backdrop-blur-sm dark:bg-secondary-dark rounded-lg border border-slate-200 dark:border-secondary p-1.5
                                    grid grid-cols-[auto_1fr_auto] gap-2
                                    *:inline-flex *:items-center *:justify-center
                                `}
                            >
                                <div className="bg-slate-200/60 dark:bg-secondary rounded size-10">
                                    <SpeakerWaveIcon className="size-5" />
                                </div>
                                <div className="flex-col items-start! min-w-0">
                                    <h2 className="text-sm truncate w-full">
                                        Annual Statement Annual Statement
                                    </h2>
                                    <span className="text-xs opacity-50">
                                        2 MB
                                    </span>
                                </div>
                                <div className="cursor-pointer group">
                                    <EllipsisHorizontalIcon className="size-5 pointer-events-none group-hover:text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </FocusMenu>,
            ]}
        </DashboardLayout>
    );
}
