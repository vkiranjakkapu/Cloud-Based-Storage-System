import {
    DocumentTextIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
import type { Dispatch, HTMLAttributes, SetStateAction } from "react";
import type { MetaFile } from "../../pages/directory/FilesList";
import { renderCellValue, type IconProps } from "../Commons";
import type { FloatingMenuComponentProps } from "../floatingMenu/FloatingMenuComponent";
import FloatingMenuComponent from "../floatingMenu/FloatingMenuComponent";
import IconComponent, { type IconComponentProps } from "../IconComponent";

type FileListComponentProps = HTMLAttributes<HTMLDivElement> & {
    file: MetaFile;
    dropdown: FloatingMenuComponentProps<MetaFile>;
    className?: string;
    showFileSize?: boolean;
    infoButton?: Omit<IconComponentProps, "onClick"> & {
        onClick: (file: MetaFile) => void;
    };
    showOwner?: boolean;
    preview?: boolean;
    useIcon?: IconProps;
    handleDoubleClick: (item: MetaFile) => void;
    trackSelectedFile?: Dispatch<SetStateAction<MetaFile | null>>;
};

export default function FileListComponent({
    file,
    dropdown,
    infoButton,
    showFileSize = true,
    showOwner = true,
    preview = true,
    useIcon: Icon,
    className,
    handleDoubleClick,
    trackSelectedFile,
    ...props
}: FileListComponentProps) {
    return (
        <div
            className={`
                cursor-pointer rounded-lg transition-all duration-150
                bg-white/60 backdrop-blur-sm dark:bg-secondary-dark
                border border-slate-200 dark:border-secondary p-1.5
                text-current/80 hover:text-current
                hover:bg-warm/20 dark:hover:bg-secondary-dark/60

                grid grid-cols-[auto_1fr_auto_auto] gap-2

                [&>.preview]:flex [&>.preview]:self-center [&>.preview]:items-center [&>.preview]:justify-center
                ${className}
            `}
            onClick={() => trackSelectedFile?.(file)}
            onDoubleClick={() => handleDoubleClick(file)}
            {...props}
        >
            {Icon ? (
                <div className="preview bg-slate-200/60 dark:bg-secondary rounded size-10">
                    <Icon className="size-5" />
                </div>
            ) : (
                preview && (
                    <div className="preview bg-slate-200/60 dark:bg-secondary rounded size-10">
                        <DocumentTextIcon className="size-5" />
                    </div>
                )
            )}
            <div
                className={`
                    @container flex flex-wrap justify-around min-w-0 
                    *:my-auto
                    [&>:not(.fileName)]:flex-1
                `}
            >
                <h2
                    className={`fileName text-sm md:@md:text-base truncate md:@xs:w-[20ch] md:@md:w-[30ch]`}
                >
                    {file.fileName}
                </h2>
                <span className="text-xs mr-auto md:@md:mr-0 md:@md:text-base md:@sm:text-center">
                    {renderCellValue(file.uploaded)}
                </span>
                {showOwner && (
                    <span className="text-xs md:md:@md:w-[25ch] truncate md:md:@md:text-base">
                        {"Venkata Kiran J"}
                    </span>
                )}
                {showFileSize && (
                    <span className="text-xs md:@md:text-base md:@sm:text-center">
                        {file.size}
                    </span>
                )}
            </div>
            {infoButton && (
                <div className="cursor-pointer group my-auto">
                    <IconComponent
                        {...infoButton}
                        icon={infoButton.icon ?? InformationCircleIcon}
                        onClick={(e) => {
                            e.stopPropagation();
                            infoButton.onClick(file);
                        }}
                    />
                </div>
            )}
            <div className="cursor-pointer group my-auto">
                <FloatingMenuComponent {...dropdown} />
            </div>
        </div>
    );
}
