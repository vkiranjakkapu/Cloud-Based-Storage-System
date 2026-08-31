import {
    DocumentPlusIcon,
    DocumentTextIcon,
    ListBulletIcon,
    PencilIcon,
    ShareIcon,
    Squares2X2Icon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import {
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import FileIconComponent from "../../components/directories/FileIconComponent";
import DashboardSection from "../../components/layouts/DashboardSection";
import usePagination from "../../components/pagination/usePagination";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import FileListComponent from "../../components/directories/FileListComponent";

export interface MetaFile {
    id: number;
    fileName: string;
    size: string;
    uploaded: unknown;
}

type FilesListProps = {
    files: MetaFile[];

    handleDoubleClick: (item: MetaFile) => void;
    handleInfoButtonClick?: (file: MetaFile) => void;
    handleRenameFileClick?: (file: MetaFile) => void;
    handleShareFileClick?: (file: MetaFile) => void;
    handleDeleteFileClick?: (file: MetaFile) => void;
    trackActiveFile?: Dispatch<SetStateAction<MetaFile | null>>;
};

export default function FilesList({
    files,
    handleDoubleClick,
    handleInfoButtonClick,
    handleRenameFileClick,
    handleShareFileClick,
    handleDeleteFileClick,
    trackActiveFile,
}: FilesListProps) {
    const [iconView, setIconView] = useState<boolean>(true);

    const [queryString, setQueryString] = useState<string | null>(null);

    const [activeFile, setActiveFile] = useState<MetaFile | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        trackActiveFile?.(activeFile);
    }, [activeFile, trackActiveFile]);

    const queryFiles = useMemo(() => {
        if (files.length === 0) return [];

        if (!queryString) return files;

        const fileteredFiles = files.filter((fl) =>
            fl.fileName.includes(queryString),
        );

        return fileteredFiles;
    }, [files, queryString]);

    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const {
        currentItems,
        currentPage,
        totalPages,
        goToNextPage,
        changePage,
        goToPrevPage,
    } = usePagination<MetaFile>(queryFiles, itemsPerPage);

    return (
        <DashboardSection
            header={{
                title: "Labmantix",
                description: "21 Files",
                actionElements: [
                    {
                        button: {
                            icon: DocumentPlusIcon,
                            text: "New Files",
                        },
                    },
                    {
                        iconGroup: {
                            buttons: [
                                {
                                    icon: Squares2X2Icon,
                                    active: iconView,
                                    onClick: () => {
                                        setIconView(true);
                                        setItemsPerPage(10);
                                    },
                                },
                                {
                                    icon: ListBulletIcon,
                                    active: !iconView,
                                    onClick: () => {
                                        setIconView(false);
                                        setItemsPerPage(6);
                                    },
                                },
                            ],
                        },
                    },
                ],
            }}
        >
            <DashboardSection
                search={{
                    id: "searchFiles",
                    placeholder: "Filename",
                    customise: "w-full md:w-3/5 lg:w-3/4",
                    label: { icon: DocumentTextIcon },
                    onChange: (e) => {
                        setQueryString(e.target.value);
                    },
                }}
                pagination={{
                    totalPages,
                    currentPage,
                    goToNextPage,
                    goToPrevPage,
                    changePage,
                    theme: "primary",
                }}
            >
                {iconView && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                        {currentItems.map((file) => {
                            return (
                                <FileIconComponent
                                    key={file.id}
                                    file={file}
                                    dropdown={{
                                        type: "icon",
                                        props: {
                                            onClick: () => {
                                                setActiveFile(file);
                                            },
                                        },
                                        items: [
                                            {
                                                target: file,
                                                icon: {
                                                    icon: TrashIcon,
                                                    customiseIcon:
                                                        "text-rose-500!",
                                                },
                                                title: "Delete",
                                                onClick: (file) => {
                                                    handleDeleteFileClick?.(
                                                        file as MetaFile,
                                                    );
                                                },
                                            },
                                            {
                                                target: file,
                                                icon: { icon: ShareIcon },
                                                title: "Share",
                                                onClick: (file) => {
                                                    handleShareFileClick?.(
                                                        file as MetaFile,
                                                    );
                                                },
                                            },
                                            {
                                                target: file,
                                                icon: { icon: PencilIcon },
                                                title: "Rename",
                                                onClick: (file) => {
                                                    handleRenameFileClick?.(
                                                        file as MetaFile,
                                                    );
                                                },
                                            },
                                        ],
                                        menuId: "fileIconView-" + file.id,
                                        activeMenu,
                                        setActiveMenu,
                                    }}
                                    isActive={activeFile?.id === file.id}
                                    onActiveChange={(file) =>
                                        setActiveFile(file)
                                    }
                                    handleInfoClick={(file) => {
                                        handleInfoButtonClick?.(file);
                                    }}
                                    handleDoubleClick={handleDoubleClick}
                                    clearActiveMenu={() => setActiveMenu(null)}
                                />
                            );
                        })}
                    </div>
                )}
                {!iconView && (
                    <div className="space-y-1">
                        {currentItems.map((file) => {
                            return (
                                <FileListComponent
                                    key={file.id}
                                    file={file}
                                    infoButton={{
                                        onClick: (file) =>
                                            handleInfoButtonClick?.(file),
                                    }}
                                    dropdown={{
                                        type: "icon",
                                        useIcon: EllipsisVerticalIcon,
                                        props: {
                                            theme: "secondary-blur",
                                        },
                                        alignment: "left",
                                        items: [
                                            {
                                                target: file,
                                                icon: {
                                                    icon: TrashIcon,
                                                    customiseIcon:
                                                        "text-rose-500!",
                                                },
                                                title: "Delete",
                                                onClick: (file) => {
                                                    handleDeleteFileClick?.(
                                                        file as MetaFile,
                                                    );
                                                },
                                            },
                                            {
                                                target: file,
                                                icon: { icon: ShareIcon },
                                                title: "Share",
                                                onClick: (file) => {
                                                    handleShareFileClick?.(
                                                        file as MetaFile,
                                                    );
                                                },
                                            },
                                            {
                                                target: file,
                                                icon: { icon: PencilIcon },
                                                title: "Rename",
                                                onClick: (file) => {
                                                    handleRenameFileClick?.(
                                                        file as MetaFile,
                                                    );
                                                },
                                            },
                                        ],
                                        menuId: "fileListView-" + file.id,
                                        activeMenu,
                                        setActiveMenu,
                                    }}
                                    handleDoubleClick={handleDoubleClick}
                                    trackSelectedFile={trackActiveFile}
                                />
                            );
                        })}
                    </div>
                )}
            </DashboardSection>
        </DashboardSection>
    );
}
