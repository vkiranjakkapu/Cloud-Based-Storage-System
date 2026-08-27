import { PlusCircleIcon, ShareIcon } from "@heroicons/react/24/solid";
import { FolderComponent } from "../../components/directories/FolderComponent";
import IconComponent from "../../components/IconComponent";
import DuoFolderIcon from "../../components/icons/DuoFolderIcon";

export default function FolderDetailsPage() {
    return (
        <section className="relative min-h-100">
            <div className="sticky z-0 h-45 inset-x-0 px-4 md:px-8">
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
                            <span className="text-xs md:text-sm">
                                3 folders and 48 files in category
                            </span>
                        </div>
                        <div className="space-x-1">
                            <IconComponent icon={ShareIcon} theme="primary" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute inset-x-0 z-1 top-32 space-y-3 bg-white/50 backdrop-blur-lg rounded-lg p-4 md:p-8 max-h-100 overflow-scroll">
                <div className="sticky flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex-1">
                        <div className="text-lg font-semibold">
                            {["Documents", "Projects", "Internship"].join(
                                " / ",
                            )}
                        </div>
                        <span className="text-xs">3 Folders</span>
                    </div>
                    <div className="space-x-2">
                        <IconComponent
                            icon={PlusCircleIcon}
                            text="New File"
                            customise="p-2 shadow-xs"
                            customiseText="font-bold! pl-1"
                            theme="secondary-blur"
                        />
                        <IconComponent
                            icon={PlusCircleIcon}
                            text="New Folder"
                            customise="p-2 shadow-xs"
                            customiseText="font-bold! pl-1"
                            theme="secondary-blur"
                        />
                    </div>
                </div>
                {/* Folder Elements */}
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
            </div>
        </section>
    );
}
