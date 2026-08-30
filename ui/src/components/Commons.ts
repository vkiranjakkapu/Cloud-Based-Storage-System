import type {
    ForwardRefExoticComponent,
    PropsWithoutRef,
    SVGProps,
} from "react";
import { DateFormatter } from "../utils/DateFormatter";
import type { IconComponentProps } from "./IconComponent";

export type IconProps = ForwardRefExoticComponent<
    PropsWithoutRef<SVGProps<SVGSVGElement>>
>;

export function renderCellValue(value: unknown) {
    if (DateFormatter.isTimestampFormat(value)) {
        return DateFormatter.toRelativeTime(value);
    }

    return String(value);
}

export function isIconComponentProps(
    icon: unknown,
): icon is IconComponentProps {
    return (
        typeof icon === "object" &&
        icon !== null &&
        ("icon" in icon || "theme" in icon || "customiseIcon" in icon)
    );
}
