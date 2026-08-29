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
import { useNavigate } from "react-router-dom";
import DashboardSection from "../../components/layouts/DashboardSection";
import usePagination from "../../components/pagination/usePagination";
import TableComponent from "../../components/TableComponent";
import { RoutePaths } from "../../routes/RoutePaths";

export interface MetaFile {
    id: number;
    value: string;
    created: unknown;
}

export default function FilesList() {
    const navigate = useNavigate();

    const [iconView, setIconView] = useState<boolean>(false);

    const allFiles = useState<MetaFile[]>([
        {
            id: 1,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 2,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 3,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 4,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 5,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 6,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 7,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 8,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 9,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 10,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 11,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
        {
            id: 12,
            value: "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
            created: new Date().toISOString(),
        },
    ]);
    const {
        currentItems,
        currentPage,
        totalPages,
        goToNextPage,
        changePage,
        goToPrevPage,
    } = usePagination<MetaFile>(allFiles[0], 6);

    const [queryString, setQueryString] = useState<string | null>(null);
    console.log(queryString);

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
                                    onClick: () => setIconView(true),
                                },
                                {
                                    icon: ListBulletIcon,
                                    active: !iconView,
                                    onClick: () => setIconView(false),
                                },
                            ],
                        },
                    },
                ],
            }}
        >
            <TableComponent
                // headers={[]}
                body={currentItems}
                actionEvents={[
                    {
                        title: "Navigate",
                        navigation: {
                            text: "open",
                            onClick: (item) => {
                                console.log(item);

                                navigate(
                                    RoutePaths.FOLDER.replace(
                                        ":folder",
                                        item.id + "",
                                    ),
                                );
                            },
                        },
                    },
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
                    customise: "w-full md:w-3/5",
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
        </DashboardSection>
    );
}
