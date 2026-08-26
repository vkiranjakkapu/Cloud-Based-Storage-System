import type {
    InputHTMLAttributes,
    LabelHTMLAttributes,
    ReactNode,
} from "react";
import type { IconProps } from "../Commons";

export interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
    children?: ReactNode;
    id: string;
    customise?: string;
    customiseInput?: string;
    label?: LabelComponentProps;
}

export interface LabelComponentProps extends LabelHTMLAttributes<HTMLLabelElement> {
    icon?: IconProps;
    text?: string;
}

export default function InputComponent({
    children,
    id,
    customise,
    customiseInput,
    label,
    ...props
}: InputComponentProps) {
    return (
        <div
            className={`container inline-flex min-h-9 shrink-0 shadow-xs items-center overflow-hidden 
                focus-within:ring-2 focus-within:ring-warm dark:focus-within:ring-warm/30 focus-within:border-warm dark:focus-within:border-warm/60
                rounded-lg border border-slate-200 dark:border-secondary-dark bg-slate-200 dark:bg-secondary-dark
                ${customise}`}
        >
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm flex items-center justify-center gap-1 px-1.5"
                    {...label}
                >
                    {label.icon && (
                        <span>
                            <label.icon className="size-5 text-secondary/50 dark:text-cool/40" />
                        </span>
                    )}
                    {label.text && <span>{label?.text}</span>}
                </label>
            )}
            <input
                id={id}
                className={`focus:outline-none focus:ring-0 p-1 flex-1 ${customiseInput}`}
                {...props}
            />
            {children}
        </div>
    );
}
