import {
    ChevronDownIcon,
    ChevronRightIcon,
    DocumentDuplicateIcon,
    DocumentPlusIcon,
    DocumentTextIcon,
    EllipsisHorizontalIcon,
    FolderIcon,
    FolderOpenIcon,
    FolderPlusIcon,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    ShareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import FileListComponent from "../../components/directories/FileListComponent";
import { FolderComponent } from "../../components/directories/FolderComponent";
import InputComponent from "../../components/form/InputComponent";
import IconComponent from "../../components/IconComponent";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSection from "../../components/layouts/DashboardSection";
import IconHeaderLayout from "../../components/layouts/IconHeaderLayout";
import DividerComponent from "../../components/nav/DividerComponent";
import FocusMenu from "../../components/nav/FocusMenu";
import FilesList, { type MetaFile } from "./FilesList";
import sampleData from "./sampleData.json";

export default function DirectoryPage() {
    // const activeDirectory = useParams<{ folder: string }>();

    const allFiles = useState<MetaFile[]>(sampleData as MetaFile[]);

    const [activeFile, setActiveFile] = useState<MetaFile | null>(null);
    console.log(activeFile);

    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // TODO: get file details by fileId
    const handleFileInfoClick = (file: MetaFile) => {
        console.log("Info of file-" + file.id);
    };

    const handleRenameFileClick = (file: MetaFile) => {
        console.log("Rename file-" + file.id);
    };

    const handleShareFileClick = (file: MetaFile) => {
        console.log("Share file-" + file.id);
    };

    const handleDeleteFileClick = (file: MetaFile) => {
        console.log("Delete file-" + file.id);
    };

    return (
        <DashboardLayout override={true}>
            {[
                // Folders
                <IconHeaderLayout
                    title="Documents"
                    description="3 folders and 48 files in category"
                    actionButtons={[{ theme: "primary", icon: ShareIcon }]}
                >
                    {/* Folders Section */}
                    <DashboardSection
                        header={{
                            // title:"3 Folders",
                            breadCrumbs: [
                                { text: "Documents" },
                                { text: "Projects" },
                                { text: "Internship" },
                            ],
                            description: "3 Folders",
                            actionElements: [
                                {
                                    button: {
                                        icon: DocumentPlusIcon,
                                        text: "New File",
                                    },
                                },
                                {
                                    button: {
                                        icon: FolderPlusIcon,
                                        text: "New Folder",
                                    },
                                },
                                {
                                    icon: {
                                        icon: ShareIcon,
                                        customise:
                                            "p-2 size-8 shadow-md sm:hidden",
                                        theme: "primary",
                                    },
                                },
                                {
                                    dropdown: {
                                        type: "icon",
                                        props: {
                                            theme: "primary",
                                            customise: "p-2 shadow-sm",
                                        },
                                        items: [
                                            {
                                                // text: "Rename",
                                                icon: { icon: PencilIcon },
                                                title: "Rename Folder",
                                                onClick: () => {},
                                            },
                                            {
                                                // text: "Delete",
                                                icon: { icon: TrashIcon },
                                                title: "Delete Folder",
                                                onClick: () => {},
                                            },
                                        ],
                                    },
                                },
                            ],
                        }}
                    >
                        <div className="max-h-100 overflow-scroll grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
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
                    </DashboardSection>

                    {/* Files Section */}
                    <FilesList
                        files={allFiles[0]}
                        handleInfoButtonClick={handleFileInfoClick}
                        handleRenameFileClick={handleRenameFileClick}
                        handleShareFileClick={handleShareFileClick}
                        handleDeleteFileClick={handleDeleteFileClick}
                        trackActiveFile={setActiveFile}
                    />
                </IconHeaderLayout>,

                // Focus Menu
                <FocusMenu>
                    {/* Folders */}
                    <div className="container flex-1">
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
                        <div className="space-y-1">
                            {allFiles[0].slice(0, 8).map((file, idx) => (
                                <FileListComponent
                                    key={idx}
                                    file={file}
                                    useIcon={DocumentTextIcon}
                                    showFileSize={false}
                                    showOwner={false}
                                    dropdown={{
                                        type: "icon",
                                        useIcon: EllipsisHorizontalIcon,
                                        props: {
                                            theme: "secondary-blur",
                                            // menutheme: "secondary-blur",
                                        },
                                        alignment: "bottom",
                                        items: [
                                            {
                                                target: file,
                                                icon: {
                                                    icon: InformationCircleIcon,
                                                },
                                                text: "Info",
                                                onClick(item) {
                                                    handleFileInfoClick(
                                                        item as MetaFile,
                                                    );
                                                },
                                            },
                                            {
                                                target: file,
                                                icon: { icon: PencilIcon },
                                                text: "Rename",
                                                onClick(item) {
                                                    handleRenameFileClick(
                                                        item as MetaFile,
                                                    );
                                                },
                                            },
                                            {
                                                target: file,
                                                icon: { icon: ShareIcon },
                                                text: "Share",
                                                onClick(item) {
                                                    handleShareFileClick(
                                                        item as MetaFile,
                                                    );
                                                },
                                            },
                                            {
                                                target: file,
                                                icon: {
                                                    icon: TrashIcon,
                                                    customiseIcon:
                                                        "group-hover:text-rose-500!",
                                                },
                                                text: "Delete",
                                                onClick(item) {
                                                    handleDeleteFileClick(
                                                        item as MetaFile,
                                                    );
                                                },
                                            },
                                        ],
                                        menuId: `latestFile-${file.id}`,
                                        activeMenu,
                                        setActiveMenu,
                                    }}
                                    trackSelectedFile={(file) => {
                                        setActiveFile(file);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </FocusMenu>,
            ]}
        </DashboardLayout>
    );
}
