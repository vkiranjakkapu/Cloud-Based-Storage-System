import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import IconComponent, { type IconThemes } from "../components/IconComponent";
import type { Pagination } from "./usePagination";
import InputComponent from "../components/form/InputComponent";

export interface PaginationButtonsProps<T> extends Omit<
    Pagination<T>,
    "currentItems"
> {
    theme?: IconThemes;
}

export function PaginationButtons<T>({
    theme,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    changePage,
}: PaginationButtonsProps<T>) {
    return (
        <div className="space-y-2 text-start md:text-end">
            {/* Pagination buttons */}
            <div
                className={`inline-flex items-center rounded-lg outline outline-offset-2 ${theme == "primary" ? "outline-primary " : "outline-secondary "} overflow-hidden`}
            >
                <IconComponent
                    theme={theme ?? "primary-blur"}
                    icon={ChevronLeftIcon}
                    customise="size-5"
                    onClick={goToPrevPage}
                    disabled={currentPage == 1}
                />
                <InputComponent
                    id="changePage"
                    type="number"
                    max={totalPages}
                    step={1}
                    min={1}
                    onChange={(e) => changePage(Number(e.target.value))}
                />
                <IconComponent
                    theme={theme ?? "primary-blur"}
                    icon={ChevronRightIcon}
                    customise="size-5"
                    onClick={goToNextPage}
                    disabled={totalPages == currentPage}
                />
            </div>
            <span className="block lowercase text-sm">
                Showing page {currentPage} of {totalPages}
            </span>
        </div>
    );
}
