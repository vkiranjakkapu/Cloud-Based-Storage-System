import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
    PaginationButtons,
    type PaginationButtonsProps,
} from "../../../pagination/Pagination";
import ActionButton from "../../ActionButtonComponent";
import type { IconComponentProps } from "../../IconComponent";
import IconComponent from "../../IconComponent";
import type { InputComponentProps } from "../../form/InputComponent";
import InputComponent from "../../form/InputComponent";
import type { FloatingMenuComponentProps } from "../../FloatingMenuComponent";
import FloatingMenuComponent from "../../FloatingMenuComponent";

type SectionLayoutProps<T> = {
    children: ReactNode;
    title?: string;
    description?: string;
    breadCrumbs?: { text: string; uri?: string }[];
    actionButtons?: {
        type?: "icon" | "button";
        props?: IconComponentProps;
        dropdown?: FloatingMenuComponentProps;
    }[];
    search?: InputComponentProps;
    pagination?: PaginationButtonsProps<T>;
};

export default function DashboardSectionLayout<T>({
    children,
    title,
    description,
    breadCrumbs,
    actionButtons,
    search,
    pagination,
}: SectionLayoutProps<T>) {
    const navigate = useNavigate();

    return (
        <div
            className={`
                *:not-last:flex *:not-last:flex-col 
                *:not-last:justify-between 
                *:not-last:items-start 
                *:not-last:gap-3 
                md:*:not-last:flex-row 
                md:*:not-last:items-center 
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
                <div className="flex items-center gap-2">
                    {actionButtons &&
                        actionButtons.map((element, idx) => {
                            return element.type === "icon" ? (
                                <IconComponent
                                    key={idx}
                                    customise="p-2 shadow-xs"
                                    customiseIcon="size-4"
                                    {...element.props}
                                />
                            ) : element.type === "button" ? (
                                <ActionButton {...element.props} />
                            ) : (
                                element.dropdown && (
                                    <FloatingMenuComponent
                                        {...element.dropdown}
                                    />
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
