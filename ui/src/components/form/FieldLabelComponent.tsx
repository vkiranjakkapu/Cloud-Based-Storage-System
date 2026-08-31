import type { LabelHTMLAttributes } from "react";
import type { IconProps } from "../Commons";

export interface LabelComponentProps extends LabelHTMLAttributes<HTMLLabelElement> {
    icon?: IconProps;
    text?: string;
}

export default function FieldLabelComponent({
    icon: Icon,
    text,
    ...props
}: LabelComponentProps) {
    return (
        <label
            className={`text-sm flex items-center justify-center gap-1 pl-3
            text-secondary/50 dark:text-cool/40
            `}
            {...props}
        >
            {Icon && (
                <span>
                    <Icon className="size-5" />
                </span>
            )}
            {text && <span>{text}</span>}
        </label>
    );
}
