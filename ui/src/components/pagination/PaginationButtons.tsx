import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ActionButton from "../ActionButtonComponent";
import { ButtonGroupComponent } from "../ButtonGroupComponent";
import InputComponent from "../form/InputComponent";
import { type IconThemes } from "../IconComponent";
import type { PaginationProps } from "./usePagination";

export interface PaginationButtonsProps<T> extends Omit<
    PaginationProps<T>,
    "currentItems"
> {
    theme?: IconThemes;
    customise?: string;
}

export function PaginationButtons<T>({
    theme = "primary-blur",
    customise,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    changePage,
}: PaginationButtonsProps<T>) {
    if (totalPages <= 1) {
        return;
    }

    return (
        <div className={`space-y-2 text-end ${customise}`}>
            <ButtonGroupComponent
                theme={theme}
                customise={`w-fit ml-auto border-${theme.split("-")[0]}/10!`}
            >
                <ActionButton
                    theme={theme ?? "primary-blur"}
                    icon={ChevronLeftIcon}
                    customise={`size-7 rounded-none`}
                    hoverEffect={`rounded-none`}
                    onClick={goToPrevPage}
                    disabled={currentPage == 1}
                />
                {totalPages > 3 && (
                    <InputComponent
                        id="changePage"
                        type="number"
                        customise="min-h-fit! min-w-fit! border-0! rounded-none!"
                        customiseInput="p-0! px-0.5!"
                        placeholder="#"
                        defaultValue={currentPage}
                        max={totalPages}
                        step={1}
                        min={1}
                        onChange={(e) => changePage(Number(e.target.value))}
                    />
                )}
                <ActionButton
                    theme={theme ?? "primary-blur"}
                    icon={ChevronRightIcon}
                    customise={`size-7 rounded-none`}
                    hoverEffect={`rounded-none`}
                    onClick={goToNextPage}
                    disabled={totalPages == currentPage}
                />
            </ButtonGroupComponent>
            <span className="block lowercase text-sm">
                Showing page {currentPage} of {totalPages}
            </span>
        </div>
    );
}
