import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { type HTMLAttributes } from "react";
import type { MetaFile } from "../../pages/directory/FilesList";
import { renderCellValue } from "../Commons";
import type { FloatingMenuComponentProps } from "../floatingMenu/FloatingMenuComponent";
import FloatingMenuComponent from "../floatingMenu/FloatingMenuComponent";
import IconComponent from "../IconComponent";

type FileIconComponentProps = HTMLAttributes<HTMLDivElement> & {
    file: MetaFile;
    dropdown: FloatingMenuComponentProps<MetaFile>;
    isActive: boolean;
    className?: string;

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
    handleInfoClick,
    clearActiveMenu,
}: FileIconComponentProps) {
    return (
        <div
            className={`
                relative flex flex-col items-center p-1 cursor-pointer
                border border-cool/50 rounded-xl shadow-sm
                ${
                    isActive
                        ? "bg-warm/50 text-current dark:bg-secondary dark:text-warm dark:hover:text-warm [&>.info]:opacity-100"
                        : `text-secondary-accent/80 hover:text-current bg-slate-50 hover:bg-slate-100 
                        dark:bg-secondary-dark/70 dark:hover:bg-secondary dark:text-white/85 dark:hover:text-white`
                }

                [&>.info]:opacity-0 hover:[&>.info]:opacity-100

                transition-colors duration-150
                ${className}
            `}
            onClick={() => {
                onActiveChange(file);
            }}
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
                    theme={isActive ? `primary-blur` : `secondary-blur`}
                    customise="size-8! ml-auto"
                    customiseIcon="size-5!"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleInfoClick(file);
                    }}
                />
                <div className="ml-auto w-fit! *:*:p-0 *:*:*:first:m-0!">
                    <FloatingMenuComponent
                        {...{
                            ...dropdown,
                            alignment: "left",
                            props: {
                                ...dropdown.props,
                                theme:
                                    dropdown.props?.theme ?? `secondary-blur`,
                                customise: `ml-auto m-1 ${dropdown.props?.customise}`,
                                customiseIcon: `${dropdown.props?.customiseIcon}`,
                            },
                        }}
                    />
                </div>
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
