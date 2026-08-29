import { useState, type TableHTMLAttributes } from "react";
import FloatingMenuComponent, {
    type FloatingMenuComponentProps,
} from "./floatingMenu/FloatingMenuComponent";
import type { InputComponentProps } from "./form/InputComponent";
import DashboardSection from "./layouts/DashboardSection";
import type { PaginationButtonsProps } from "./pagination/PaginationButtons";
import { renderCellValue } from "./Commons";

export type TableComponentProps<T> = TableHTMLAttributes<HTMLTableElement> & {
    headers?: HeaderAlias<T>[];
    noHeader?: boolean;
    body: T[];
    actionEvents?: {
        title: string;
        dropdown?: FloatingMenuComponentProps;
        navigation?: { text: string; onClick: (item: T) => void };
    }[];
    search?: InputComponentProps;
    pagination?: PaginationButtonsProps<T>;
};

export type HeaderAlias<T> = {
    key: keyof T;
    alias?: string;
};

export default function TableComponent<T>({
    headers,
    noHeader,
    body,
    actionEvents,
    search,
    pagination,
}: TableComponentProps<T>) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const cols =
        body.length != 0
            ? !headers || headers.length == 0
                ? Object.keys(
                      body.reduce(
                          (maxRow, currentRow) =>
                              Object.keys(currentRow as object).length >
                              Object.keys(maxRow as object).length
                                  ? currentRow
                                  : maxRow,
                          body[0],
                      ) as object,
                  ).map((key) => ({ key }) as HeaderAlias<T>)
                : headers
            : [];

    return (
        <DashboardSection search={search} pagination={pagination}>
            <div className="container overflow-x-auto overflow-y-clip bg-cool/20 dark:bg-secondary-dark border border-cool/60 dark:border-secondary rounded-xl backdrop-blur-md">
                <table
                    className={`
                    w-full min-w-max text-left text-sm
                    [&_th,td]:px-6
                    [&_th]:py-4
                    [&_td]:py-2.5
                    [&_tr>*:last-child:not(.fullSpan)]:text-end
                `}
                >
                    {!noHeader && body.length > 0 && (
                        <thead
                            className={`
                                text-xs font-semibold uppercase tracking-wider 
                                border-b border-slate-300 bg-cool
                                dark:border-secondary dark:bg-cool/10 dark:text-primary
                            `}
                        >
                            <tr>
                                {cols.map((column, idx) => (
                                    <th scope="col" key={"th" + idx}>
                                        {String(column.alias ?? column.key)}
                                    </th>
                                ))}
                                {actionEvents &&
                                    actionEvents.map((action, idx) => (
                                        <th key={"ae" + idx}>{action.title}</th>
                                    ))}
                            </tr>
                        </thead>
                    )}
                    <tbody
                        className={`
                        divide-y divide-slate-200 transition-colors dark:divide-secondary
                        *:hover:bg-slate-50/80 *:transition-colors *:dark:hover:bg-secondary/40
                    `}
                    >
                        {body.map((item, idx) => (
                            <tr key={"tb" + idx}>
                                {cols.map((column) => {
                                    return (
                                        <td
                                            key={String(column.key)}
                                            className={
                                                (
                                                    column.key as string
                                                ).toLowerCase() === "filename"
                                                    ? `max-w-[20ch] truncate`
                                                    : ``
                                            }
                                        >
                                            {renderCellValue(
                                                String(item[column.key]),
                                            )}
                                        </td>
                                    );
                                })}
                                {actionEvents &&
                                    actionEvents.map((action, actionIdx) => {
                                        const nav = action.navigation;

                                        return (
                                            <td
                                                key={"act" + actionIdx}
                                                className={`*:ml-auto`}
                                            >
                                                {action.dropdown && (
                                                    <FloatingMenuComponent
                                                        {...action.dropdown}
                                                        menuId={`${idx}-${actionIdx}`}
                                                        activeMenu={activeMenu}
                                                        setActiveMenu={
                                                            setActiveMenu
                                                        }
                                                    />
                                                )}
                                                {nav && (
                                                    <span
                                                        onClick={() => {
                                                            nav.onClick(item);
                                                        }}
                                                    >
                                                        {nav.text}
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                            </tr>
                        ))}
                        {body.length == 0 && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="fullSpan capitalize text-center"
                                >
                                    No Data to display
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardSection>
    );
}
