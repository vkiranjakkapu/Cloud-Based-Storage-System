import {
    DocumentPlusIcon,
    ShareIcon,
    TrashIcon,
} from "@heroicons/react/16/solid";
import {
    DocumentTextIcon,
    ListBulletIcon,
    PencilIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import FileComponent from "../../components/directories/FileComponent";
import DashboardSection from "../../components/layouts/DashboardSection";
import usePagination from "../../components/pagination/usePagination";
import TableComponent from "../../components/TableComponent";

export interface MetaFile {
    id: number;
    fileName: string;
    size: string;
    uploaded: unknown;
}

export default function FilesList() {
    const [iconView, setIconView] = useState<boolean>(true);

    const allFiles = useState<MetaFile[]>([
        {
            id: 1,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 2,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 3,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 4,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 5,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 6,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 7,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 8,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 9,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 10,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 11,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
        {
            id: 12,
            fileName:
                "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            size: "2 MB",
            uploaded: new Date().toISOString(),
        },
    ]);

    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const {
        currentItems,
        currentPage,
        totalPages,
        goToNextPage,
        changePage,
        goToPrevPage,
    } = usePagination<MetaFile>(allFiles[0], itemsPerPage);

    const [queryString, setQueryString] = useState<string | null>(null);
    console.log(queryString);

    const [activeFile, setActiveFile] = useState<MetaFile | null>(null);

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
            {iconView ? (
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                        {currentItems.map((file) => {
                            return (
                                <FileComponent
                                    key={file.id}
                                    file={file}
                                    isActive={activeFile?.id === file.id}
                                    onActiveChange={(file) =>
                                        setActiveFile(file)
                                    }
                                    handleInfoClick={(file) => {
                                        console.log(file);
                                    }}
                                />
                            );
                        })}
                    </div>
                </DashboardSection>
            ) : (
                <TableComponent
                    // headers={[]}
                    noHeader={true}
                    body={currentItems}
                    actionEvents={[
                        {
                            title: "Manage",
                            dropdown: {
                                type: "icon",
                                props: {
                                    theme: "secondary-blur",
                                },
                                items: [
                                    {
                                        icon: PencilIcon,
                                        text: "Rename",
                                    },
                                    {
                                        icon: TrashIcon,
                                        text: "Delete",
                                    },
                                    {
                                        icon: ShareIcon,
                                        text: "Share",
                                    },
                                ],
                            },
                        },
                    ]}
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
                />
            )}
        </DashboardSection>
    );
}
