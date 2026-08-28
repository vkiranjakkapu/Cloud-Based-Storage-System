import {
    DocumentPlusIcon,
    FolderPlusIcon,
    TrashIcon,
} from "@heroicons/react/16/solid";
import { PencilIcon, ShareIcon } from "@heroicons/react/24/solid";
import { FolderComponent } from "../../components/directories/FolderComponent";
import IconComponent from "../../components/IconComponent";
import DuoFolderIcon from "../../components/icons/DuoFolderIcon";
import DashboardSectionLayout from "../../components/layouts/dashboard/DashboardSectionLayout";
import FilesList from "./FilesList";

export default function FolderDetails() {
    return (
        <section
            className={`
                *:p-4 *:md:p-8

                *:last:mb-0
                [&>:not(.directory-header)]:mb-2
                [&>:not(.directory-header)]:space-y-3 
                [&>:not(.directory-header)]:rounded-lg

                [&>:not(.directory-header)]:relative
                [&>:not(.directory-header)]:-top-16 
                md:[&>:not(.directory-header)]:-top-10 

                [&>:not(.directory-header)]:bg-white/50 
                dark:[&>:not(.directory-header)]:bg-secondary/50 
                [&>:not(.directory-header)]:backdrop-blur-lg 
        `}
        >
            <div className="directory-header sticky z-0 h-45 inset-x-0 px-4! md:px-8!">
                <div className="flex flex-row justify-between items-center gap-2 md:gap-10 h-full">
                    <DuoFolderIcon
                        className="text-primary h-1/2 md:size-40 drop-shadow-md dark:drop-shadow-warm/15"
                        shadowColor="text-slate-50 dark:text-secondary"
                    />
                    <div className="h-full flex-1 flex justify-between items-center gap-2">
                        <div className="space-y-0.5 mb-6 lg:mb-0">
                            <h1 className="text-sm md:text-lg font-semibold">
                                Documents
                            </h1>
                            <span className="text-sm">
                                3 folders and 48 files in category
                            </span>
                        </div>
                        <div className="space-x-1 hidden sm:block">
                            <IconComponent icon={ShareIcon} theme="primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Folders Section */}
            <DashboardSectionLayout
                // title="3 Folders"
                breadCrumbs={[
                    { text: "Documents" },
                    { text: "Projects" },
                    { text: "Internship" },
                ]}
                description="3 Folders"
                actionButtons={[
                    {
                        type: "button",
                        props: {
                            icon: DocumentPlusIcon,
                            text: "New File",
                        },
                    },
                    {
                        type: "button",
                        props: {
                            icon: FolderPlusIcon,
                            text: "New Folder",
                        },
                    },
                    {
                        type: "icon",
                        props: {
                            icon: ShareIcon,
                            customise: "p-2 size-8 shadow-md sm:hidden",
                            theme: "primary",
                        },
                    },
                    {
                        dropdown: {
                            type: "icon",
                            useIcon: PencilIcon,
                            props: {
                                theme: "primary",
                                customise: "p-2 shadow-md",
                            },
                            items: [
                                {
                                    // text: "Rename",
                                    icon: PencilIcon,
                                    title: "Rename Folder",
                                    onClick: () => {},
                                },
                                {
                                    // text: "Delete",
                                    icon: TrashIcon,
                                    title: "Delete Folder",
                                    onClick: () => {},
                                },
                            ],
                        },
                    },
                ]}
            >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                    <FolderComponent />
                </div>
            </DashboardSectionLayout>

            {/* Files Section */}
            <DashboardSectionLayout
                title="Labmantix"
                description="21 Files"
                actionButtons={[
                    {
                        type: "button",
                        props: {
                            icon: DocumentPlusIcon,
                            text: "New Files",
                        },
                    },
                ]}
            >
                <FilesList />
            </DashboardSectionLayout>
        </section>
    );
}
