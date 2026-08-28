import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton, { type ActionButtonProps } from "../ActionButtonComponent";
import {
    ButtonGroupComponent,
    type ButtonGroupComponentProps,
} from "../ButtonGroupComponent";
import type { FloatingMenuComponentProps } from "../FloatingMenuComponent";
import FloatingMenuComponent from "../FloatingMenuComponent";
import type { IconComponentProps } from "../IconComponent";
import IconComponent from "../IconComponent";
import type { InputComponentProps } from "../form/InputComponent";
import InputComponent from "../form/InputComponent";
import {
    PaginationButtons,
    type PaginationButtonsProps,
} from "../pagination/Pagination";

type SectionLayoutProps<T> = {
    children: ReactNode;
    title?: string;
    description?: string;
    breadCrumbs?: { text: string; uri?: string }[];
    actionElements?: {
        icon?: IconComponentProps;
        button?: ActionButtonProps;
        dropdown?: FloatingMenuComponentProps;
        iconGroup?: ButtonGroupComponentProps;
    }[];
    search?: InputComponentProps;
    pagination?: PaginationButtonsProps<T>;
};

export default function SectionLayout<T>({
    children,
    title,
    description,
    breadCrumbs,
    actionElements,
    search,
    pagination,
}: SectionLayoutProps<T>) {
    const navigate = useNavigate();

    return (
        <div
            className={`
                *:not-last:flex *:not-last:flex-wrap 
                *:not-last:justify-between 
                *:not-last:items-center 
                *:not-last:gap-3
            `}
        >
            {/* Header */}
            <div>
                <div className="flex-1 -space-y-0.5 *:transition-all *:duration-100">
                    {(breadCrumbs || title) && (
                        <div className="text-lg font-semibold">
                            {breadCrumbs
                                ? breadCrumbs.map((path, idx) => {
                                      const isLast =
                                          idx == breadCrumbs.length - 1;
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
                                  })
                                : title && (
                                      <span className="text-primary">
                                          {title}
                                      </span>
                                  )}
                        </div>
                    )}
                    {description && (
                        <span className="text-sm">{description}</span>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {actionElements &&
                        actionElements.map((type, idx) => {
                            return type.icon ? (
                                <IconComponent
                                    key={idx}
                                    customise="p-2 shadow-xs"
                                    customiseIcon="size-4"
                                    {...type.icon}
                                />
                            ) : type.button ? (
                                <ActionButton {...type.button} />
                            ) : type.dropdown ? (
                                <FloatingMenuComponent {...type.dropdown} />
                            ) : (
                                type.iconGroup && (
                                    <ButtonGroupComponent {...type.iconGroup} />
                                )
                            );
                        })}
                </div>
            </div>

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

            {/* Dashboard Content */}
            <div className="max-h-100 overflow-scroll">{children}</div>
        </div>
    );
}
