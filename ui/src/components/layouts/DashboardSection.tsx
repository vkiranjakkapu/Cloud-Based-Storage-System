import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton, { type ActionButtonProps } from "../ActionButtonComponent";
import {
    ButtonGroupComponent,
    type ButtonGroupComponentProps,
} from "../ButtonGroupComponent";
import type { FloatingMenuComponentProps } from "../floatingMenu/FloatingMenuComponent";
import FloatingMenuComponent from "../floatingMenu/FloatingMenuComponent";
import type { IconComponentProps } from "../IconComponent";
import IconComponent from "../IconComponent";
import type { InputComponentProps } from "../form/InputComponent";
import InputComponent from "../form/InputComponent";
import {
    PaginationButtons,
    type PaginationButtonsProps,
} from "../pagination/PaginationButtons";

type SectionLayoutProps<T> = {
    children: ReactNode;
    header?: {
        title?: string;
        description?: string;
        breadCrumbs?: { text: string; uri?: string }[];
        actionElements?: {
            icon?: IconComponentProps;
            button?: ActionButtonProps;
            dropdown?: FloatingMenuComponentProps;
            iconGroup?: ButtonGroupComponentProps;
        }[];
    };
    search?: InputComponentProps;
    pagination?: PaginationButtonsProps<T>;
};

export default function DashboardSection<T>({
    children,
    header,
    search,
    pagination,
}: SectionLayoutProps<T>) {
    const navigate = useNavigate();

    return (
        <div
            className={`
                *:not-last:flex-1
                *:not-last:flex *:not-last:flex-wrap 
                *:not-last:justify-between 
                *:not-last:items-center 
                *:not-last:gap-2 

                *:not-last:pb-2
                space-y-2
                divide-y divide-slate-200 dark:divide-cool/15
            `}
        >
            {/* Header */}
            {header && (
                <div>
                    {(header.title ||
                        header.breadCrumbs ||
                        header.description) && (
                        <div className="flex-1 -space-y-0.5 *:transition-all *:duration-100">
                            {/* Title / Breadcrumbs */}
                            <div className="text-lg font-semibold">
                                {header.breadCrumbs &&
                                    header.breadCrumbs.map((path, idx) => {
                                        const isLast =
                                            idx ==
                                            (header.breadCrumbs ?? []).length -
                                                1;
                                        return (
                                            <span
                                                key={idx}
                                                className={`cursor-pointer hover:opacity-100 ${isLast ? `text-primary` : `opacity-70`}`}
                                                onClick={() =>
                                                    navigate(
                                                        path.uri ??
                                                            "/" +
                                                                location.pathname,
                                                    )
                                                }
                                            >
                                                {path.text}
                                                {!isLast && " / "}
                                            </span>
                                        );
                                    })}
                                {header.title && (
                                    <span className="text-primary">
                                        {header.title}
                                    </span>
                                )}
                            </div>

                            {/* Descriptino */}
                            {header.description && (
                                <span className="text-sm">
                                    {header.description}
                                </span>
                            )}
                        </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                        {header.actionElements &&
                            header.actionElements.map((type, idx) => {
                                return type.icon ? (
                                    <IconComponent
                                        key={idx}
                                        customise="p-2 shadow-xs"
                                        customiseIcon="size-4"
                                        {...type.icon}
                                    />
                                ) : type.button ? (
                                    <ActionButton key={idx} {...type.button} />
                                ) : type.dropdown ? (
                                    <FloatingMenuComponent
                                        key={idx}
                                        {...type.dropdown}
                                    />
                                ) : (
                                    type.iconGroup && (
                                        <ButtonGroupComponent
                                            key={idx}
                                            {...type.iconGroup}
                                        />
                                    )
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Search & Pagination */}
            {(search || pagination) && (
                <div>
                    {search && (
                        <div className="flex-1">
                            <InputComponent {...search} />
                        </div>
                    )}
                    {pagination && (
                        <div className="flex-1">
                            <PaginationButtons {...pagination} />
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            {children}
        </div>
    );
}
