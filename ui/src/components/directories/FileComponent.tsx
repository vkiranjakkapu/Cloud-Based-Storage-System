import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { type HTMLAttributes } from "react";
import type { MetaFile } from "../../pages/directory/FilesList";
import { renderCellValue } from "../Commons";
import IconComponent from "../IconComponent";

type FileComponentProps = HTMLAttributes<HTMLDivElement> & {
    file: MetaFile;
    handleInfoClick: (item: MetaFile) => void;

    isActive: boolean;
    onActiveChange: (item: MetaFile) => void;

    className?: string;
};

export default function FileComponent({
    file,
    isActive,
    className,
    onActiveChange,
    handleInfoClick,
}: FileComponentProps) {
    return (
        <div
            className={`
                relative flex flex-col items-center p-1 cursor-pointer
                border border-cool/50 rounded-xl shadow-sm
                text-current/90 hover:text-current dark:text-cool/80 dark:hover:text-cool

                ${
                    isActive
                        ? "bg-cool/50 text-current dark:bg-secondary dark:text-warm dark:hover:text-warm [&>.info]:opacity-100"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-secondary-dark/70 dark:hover:bg-secondary"
                }

                [&>.info]:opacity-0 hover:[&>.info]:opacity-100

                transition-colors duration-150
                ${className}
            `}
            onClick={() => {
                onActiveChange(file);
            }}
        >
            <div className="info absolute inset-0 p-2 text-right transition-opacity duration-200">
                <IconComponent
                    icon={InformationCircleIcon}
                    theme={`primary-blur`}
                    customise="size-7 ml-auto"
                    onClick={() => {
                        handleInfoClick(file);
                    }}
                />
            </div>
            <DocumentTextIcon className="size-20 sm:size-25" />
            <div className="space-y-1 max-w-full p-2">
                <h2 className="text-sm w-full truncate">{file.fileName}</h2>
                <div className="flex flex-wrap justify-between items-center text-xs">
                    <span className="">{renderCellValue(file.uploaded)}</span>
                    <span className="">{file.size}</span>
                </div>
            </div>
        </div>
    );
}
