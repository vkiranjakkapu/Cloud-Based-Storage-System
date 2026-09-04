import {
    EllipsisVerticalIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { type HTMLAttributes } from "react";
import { renderCellValue } from "../Commons";
import type { FloatingMenuComponentProps } from "../floatingMenu/FloatingMenuComponent";
import FloatingMenuComponent from "../floatingMenu/FloatingMenuComponent";
import IconComponent from "../IconComponent";
import { formatBytes } from "../../utils/FileUploadHelper";
import type { MetaFile } from "../../services/FileService";

type FileIconComponentProps = HTMLAttributes<HTMLDivElement> & {
    file: MetaFile;
    dropdown: FloatingMenuComponentProps<MetaFile>;
    isActive: boolean;
    className?: string;

    handleDoubleClick: (item: MetaFile) => void;
    handleInfoClick: (item: MetaFile) => void;
    onActiveChange: (item: MetaFile) => void;
    clearActiveMenu: () => void;
};

export default function FileIconComponent({
    file,
    dropdown,
    isActive,
    className,
    onActiveChange,
    handleDoubleClick,
    handleInfoClick,
    clearActiveMenu,
}: FileIconComponentProps) {
    return (
        <div
            className={`
                relative flex flex-col items-center p-1 cursor-pointer
                border border-cool/50 dark:border-cool/15 rounded-xl shadow-sm
                ${
                    isActive
                        ? "bg-warm/50 text-current dark:bg-secondary dark:text-warm dark:hover:text-warm [&>.info]:opacity-100"
                        : `text-secondary-accent/80 hover:text-current bg-slate-50 hover:bg-slate-100 
                        dark:bg-secondary-dark/70 dark:hover:bg-secondary dark:text-white/85 dark:hover:text-white`
                }

                md:[&>.info]:opacity-0 md:hover:[&>.info]:opacity-100
                md:[&>.info]:pointer-events-none md:hover:[&>.info]:pointer-events-auto

                transition-colors duration-150
                ${className}
            `}
            onClick={() => {
                onActiveChange(file);
            }}
            onDoubleClick={() => handleDoubleClick(file)}
        >
            <div
                className="info space-y-1 absolute inset-0 p-2 text-right transition-opacity duration-200"
                onClick={(e) => {
                    e.stopPropagation();
                }}
                onMouseLeave={clearActiveMenu}
            >
                <IconComponent
                    icon={InformationCircleIcon}
                    theme={`secondary-blur`}
                    customise="size-8! ml-auto"
                    customiseIcon="size-5!"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleInfoClick(file);
                    }}
                />
                <div
                    className="ml-auto w-fit! *:*:p-0 *:*:*:first:m-0!"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FloatingMenuComponent
                        {...{
                            ...dropdown,
                            alignment: "left",
                            props: {
                                ...dropdown.props,
                                icon: EllipsisVerticalIcon,
                                theme:
                                    dropdown.props?.theme ?? `secondary-blur`,
                                customise: `size-8! ml-auto m-1 ${dropdown.props?.customise}`,
                                customiseIcon: `size-5! ${dropdown.props?.customiseIcon}`,
                            },
                        }}
                    />
                </div>
            </div>
            <DocumentTextIcon className="size-20 sm:size-25" />
            <div className="space-y-1 w-full p-2">
                <h2 className="text-sm text-center w-full truncate">
                    {file.fileName}
                </h2>
                <div className="flex flex-wrap mx-auto sm:w-2/4 md:w-full justify-between items-center text-xs">
                    <span className="flex-1 text-center">
                        {renderCellValue(file.createdAt)}
                    </span>
                    <span className="flex-1 text-center">
                        {formatBytes(file.fileSize)}
                    </span>
                </div>
            </div>
        </div>
    );
}
