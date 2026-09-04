import type { HTMLAttributes, ReactNode } from "react";
import type { ActionButtonProps } from "../ActionButtonComponent";
import IconComponent from "../IconComponent";
import DuoFolderSvgIcon from "../icons/DuoFolderIcon";

type IconHeaderLayoutProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    title: string;
    description: string;
    actionButtons: ActionButtonProps[];
};

export default function IconHeaderLayout({
    children,
    title,
    description,
    actionButtons,
}: IconHeaderLayoutProps) {
    return (
        <section
            className={`
                *:p-4 *:md:p-8

                [&>*:not(:first-child):not(:last-child)]:mb-3

                [&>:not(.directory-header)]:space-y-3 
                [&>:not(.directory-header)]:rounded-lg

                [&>:not(.directory-header)]:relative
                [&>:not(.directory-header)]:-top-16 
                md:[&>:not(.directory-header)]:-top-10 

                [&>:not(.directory-header)]:bg-white/50 
                dark:[&>:not(.directory-header)]:bg-secondary/50 
                [&>:not(.directory-header)]:backdrop-blur-lg 
        `}
        >
            <div className="directory-header sticky z-0 h-45 inset-x-0">
                <div className="flex flex-row justify-between items-center gap-2 md:gap-10 h-full">
                    <DuoFolderSvgIcon
                        className="text-primary h-1/2 md:size-40 drop-shadow-md dark:drop-shadow-warm/15"
                        shadowColor="text-slate-50 dark:text-secondary"
                    />
                    <div className="flex-1 flex flex-wrap justify-between items-center">
                        <div className="space-y-0.5 mb-6 md:mb-0">
                            <h1 className="text-sm md:text-lg font-semibold capitalize">
                                {title}
                            </h1>
                            <span className="text-sm">{description}</span>
                        </div>
                        <div className="hidden sm:flex flex-wrap gap-1">
                            {actionButtons.map((btn, idx) => (
                                <IconComponent
                                    key={idx}
                                    theme="primary"
                                    {...btn}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </section>
    );
}
