import type { KeyboardEvent, MouseEvent } from "react";
import type { IconComponentProps } from "./IconComponent";
import IconComponent from "./IconComponent";

export type ActionButtonProps = IconComponentProps & {
    type?: "submit" | "default";
};

export default function ActionButton({
    type = "default",
    onClick,
    ...props
}: ActionButtonProps) {
    const submitForm = (target: HTMLElement) => {
        const form = target.closest("form");
        if (form) {
            form.requestSubmit();
        }
    };

    const triggerSubmit = (e: MouseEvent<HTMLDivElement>) => {
        submitForm(e.currentTarget);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            submitForm(e.currentTarget);
        }
    };
    return (
        <IconComponent
            {...props}
            customise={`p-2 shadow-xs ${props.customise}`}
            customiseIcon={`size-4 ${props.customiseIcon}`}
            customiseText={`font-bold! pl-1 ${props.customiseText}`}
            theme={props.theme ?? `secondary-blur`}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={type === "submit" ? triggerSubmit : onClick}
        />
    );
}
