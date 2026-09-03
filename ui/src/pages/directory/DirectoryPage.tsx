import {
    ArrowUpTrayIcon,
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
    PlusCircleIcon,
    ShareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useState, type ChangeEvent, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import ActionButton from "../../components/ActionButtonComponent";
import FileListComponent from "../../components/directories/FileListComponent";
import { FolderComponent } from "../../components/directories/FolderComponent";
import InputComponent from "../../components/form/InputComponent";
import IconComponent from "../../components/IconComponent";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSection from "../../components/layouts/DashboardSection";
import IconHeaderLayout from "../../components/layouts/IconHeaderLayout";
import DividerComponent from "../../components/nav/DividerComponent";
import FocusMenu from "../../components/nav/FocusMenu";
import SharedUserComponent from "../../components/SheredUserComponent";
import {
    UploadComponent,
    type UploadComponentProps,
} from "../../components/UploadComponent";
import UploadService, {
    type UploadRequest,
} from "../../services/UploadService";
import FilesList, { type MetaFile } from "./FilesList";
import sampleData from "./sampleData.json";

export default function DirectoryPage() {
    const { folder: activeDirectory } = useParams<{ folder: string }>();

    const allFiles = useState<MetaFile[]>(sampleData as MetaFile[]);

    const [activeFile, setActiveFile] = useState<MetaFile | null>(null);
    console.log(activeFile);

    const [uploadItems, setUploadItems] = useState<UploadComponentProps[]>([]);

    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleOpenFile = (file: MetaFile) => {
        console.log("file selected-" + file.id);
        setActiveFile(file);
    };

    const handleOpenFolder = (folder: unknown) => {
        console.log("folder selected-" + folder);
    };

    // TODO: get file details by fileId
    const handleFileInfoClick = (file: MetaFile) => {
        console.log("Info of file-" + file.id);
        setActiveFile(file);
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

    const handleFileSelection = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFileList = Array.from(e.target.files);

        const initialItems: UploadComponentProps[] = selectedFileList.map(
            (file) => ({
                file,
                progress: { loaded: 0, total: file.size, percentage: 0 },
                status: "uploading",
                controller: new AbortController(),
            }),
        );

        setUploadItems(initialItems);

        const uploadPromises = initialItems.map((item) =>
            UploadService.uploadFile<MetaFile>(
                { file: item.file, folderId: activeDirectory } as UploadRequest,
                (progress) => {
                    setUploadItems((prev) =>
                        prev.map((upItem) =>
                            upItem.file === item.file
                                ? { ...upItem, progress }
                                : upItem,
                        ),
                    );
                },
                item.controller?.signal,
            )
                .then((resp) => {
                    const isError = !resp || "errorMessage" in resp;
                    const errorMessage = isError
                        ? (resp as { errorMessage?: string })?.errorMessage ||
                          "Upload failed"
                        : undefined;

                    setUploadItems((prev) =>
                        prev.map((upItem) =>
                            upItem.file === item.file
                                ? {
                                      ...upItem,
                                      status: isError ? "error" : "success",
                                      error: errorMessage,
                                  }
                                : upItem,
                        ),
                    );
                })
                .catch((err) => {
                    if (err?.name === "CanceledError" || axios.isCancel(err))
                        return;

                    setUploadItems((prev) =>
                        prev.map((upItem) =>
                            upItem.file === item.file
                                ? {
                                      ...upItem,
                                      status: "error",
                                      error:
                                          err?.response?.data?.message ||
                                          err?.message ||
                                          "Upload failed",
                                  }
                                : upItem,
                        ),
                    );
                }),
        );

        await Promise.allSettled(uploadPromises);
    };

    const handleCancelUpload = (fileToCancel: File) => {
        setUploadItems((prevItems) => {
            const itemToCancel = prevItems.find(
                (item) => item.file === fileToCancel,
            );

            // Abort the active HTTP connection
            itemToCancel?.controller?.abort();

            return prevItems.filter((item) => item.file !== fileToCancel);
        });
    };

    function FileInfoSidebar(): ReactNode {
        return (
            <div className="space-y-3">
                <div className="relative bg-slate-50 dark:bg-secondary-dark w-full h-40 border border-slate-200 dark:border-cool/15 p-2 rounded-md shadow-sm">
                    <div className="relative h-full">
                        <DocumentTextIcon className="w-full h-full" />
                    </div>
                    <div className="absolute inset-0 flex justify-end text-end">
                        <div className="ml-auto p-2">
                            <IconComponent icon={ShareIcon} />
                        </div>
                    </div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-secondary-dark rounded-md shadow-sm border border-slate-200 dark:border-cool/15">
                    <p>{activeFile?.id}</p>
                    <p>Size: {activeFile?.id}</p>
                    <p>Uploaded: {activeFile?.id}</p>
                    <p>Owner: {activeFile?.id}</p>
                </div>
                <SharedUserComponent />
            </div>
        );
    }

    return (
        <DashboardLayout
            override={true}
            useRightSidebar={{
                active: activeFile !== null,
                children: FileInfoSidebar(),
                handleSidebarClose() {
                    setActiveFile(null);
                },
                useDirectoryTheme: "",
            }}
        >
            {[
                <div className="flex gap-3">
                    {/* Folders */}
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
                                <FolderComponent
                                    handleDoubleClick={handleOpenFolder}
                                />
                                <FolderComponent
                                    handleDoubleClick={handleOpenFolder}
                                />
                                <FolderComponent
                                    handleDoubleClick={handleOpenFolder}
                                />
                                <FolderComponent
                                    handleDoubleClick={handleOpenFolder}
                                />
                                <FolderComponent
                                    handleDoubleClick={handleOpenFolder}
                                />
                                <FolderComponent
                                    handleDoubleClick={handleOpenFolder}
                                />
                                <FolderComponent
                                    handleDoubleClick={handleOpenFolder}
                                />
                            </div>
                        </DashboardSection>
                        {/* Files Section */}
                        <FilesList
                            files={allFiles[0]}
                            handleDoubleClick={handleOpenFile}
                            handleInfoButtonClick={handleFileInfoClick}
                            handleRenameFileClick={handleRenameFileClick}
                            handleShareFileClick={handleShareFileClick}
                            handleDeleteFileClick={handleDeleteFileClick}
                            trackActiveFile={setActiveFile}
                        />
                    </IconHeaderLayout>
                </div>,

                // Focus Menu
                <FocusMenu>
                    {/* Upload Options */}
                    <div className="container">
                        <DividerComponent text="Upload" icon={PlusCircleIcon} />
                        <input
                            type="file"
                            id="navUploadFile"
                            className="hidden"
                            multiple
                            onChange={handleFileSelection}
                        />
                        <ActionButton
                            icon={ArrowUpTrayIcon}
                            text="Upload Files"
                            theme="primary"
                            onClick={() => {
                                document
                                    .getElementById("navUploadFile")
                                    ?.click();
                            }}
                        />
                        {uploadItems.length > 0 && (
                            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                                {uploadItems.map((item, idx) => (
                                    <UploadComponent
                                        key={`${item.file.name}-${idx}`}
                                        file={item.file}
                                        progress={item.progress}
                                        status={item.status}
                                        error={item.error}
                                        handleCancelClick={handleCancelUpload}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

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
                                        customiseLayer="pointer-events-none"
                                    />
                                </div>
                                <IconComponent
                                    icon={ChevronRightIcon}
                                    customise="size-6"
                                    theme="blur"
                                    customiseLayer="pointer-events-none"
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
                                        customiseLayer="pointer-events-none"
                                    />
                                </div>
                                <IconComponent
                                    icon={ChevronRightIcon}
                                    customise="size-6"
                                    theme="blur"
                                    customiseLayer="pointer-events-none"
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
                                    customiseLayer="pointer-events-none"
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
                                    customiseLayer="pointer-events-none"
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
                            {allFiles[0].slice(0, 5).map((file, idx) => (
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
                                    handleDoubleClick={handleOpenFile}
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
