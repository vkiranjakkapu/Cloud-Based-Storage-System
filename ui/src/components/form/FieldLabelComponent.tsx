import type { LabelHTMLAttributes } from "react";
import type { IconProps } from "../Commons";

export interface LabelComponentProps extends LabelHTMLAttributes<HTMLLabelElement> {
    icon?: IconProps;
    iconAfter?: boolean;
    text?: string;
}

export default function FieldLabelComponent({
    icon: Icon,
    iconAfter = false,
    text,
    ...props
}: LabelComponentProps) {
    return (
        <label
            className={`text-sm flex items-center justify-center gap-1 px-2
            text-secondary/50 dark:text-cool/40
            `}
            {...props}
        >
            {!iconAfter && Icon && (
                <span>
                    <Icon className="size-5" />
                </span>
            )}
            {text && <span>{text}</span>}
            {iconAfter && Icon && (
                <span>
                    <Icon className="size-5" />
                </span>
            )}
        </label>
    );
}
