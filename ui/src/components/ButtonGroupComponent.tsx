import type { ReactNode } from "react";
import type { ActionButtonProps } from "./ActionButtonComponent";
import ActionButton from "./ActionButtonComponent";
import type { IconThemes } from "./IconComponent";

export type ButtonGroupComponentProps = {
    children?: ReactNode;
    /**
     * Use "primary-blur" or "secondary-blur" for better experience
     */
    theme?: IconThemes;
    buttons?: (ActionButtonProps & {
        active?: boolean;
    })[];
    rounded?: "sm" | "md" | "lg" | "full";
    autoAlign?: boolean;
    customise?: string;
};

export function ButtonGroupComponent({
    children,
    theme = "primary-blur",
    buttons,
    rounded = "md",
    autoAlign = false,
    customise,
}: ButtonGroupComponentProps) {
    const seperatorColor = theme.split("-").includes("primary")
        ? `divide-warm dark:divide-primary`
        : `divide-secondary/30 dark:divide-cool dark:border-cool`;

    return (
        <div
            className={`flex items-center overflow-hidden 
                border border-${theme.split("-")[0]} rounded-${rounded}
                ${seperatorColor} 
                ${autoAlign ? `flex-col md:flex-row divide-y md:divide-y-0 md:divide-x` : `divide-x`}
                ${customise}
            `}
        >
            {buttons &&
                buttons.map((btn, idx) => {
                    const activeTheme = (
                        btn.active ? theme.split("-")[0] : theme
                    ) as IconThemes;

                    const isFirst = idx === 0;
                    const isLast = idx === buttons.length - 1;

                    const roundedClass = isFirst
                        ? `rounded-none! rounded-l-${rounded}!`
                        : isLast
                          ? `rounded-none! rounded-r-${rounded}!`
                          : "rounded-none!";

                    return (
                        <ActionButton
                            key={idx}
                            {...{ ...btn, active: btn.active + "" }}
                            customise={`size-7 ${roundedClass} ${btn.customise}`}
                            customiseLayer={`${roundedClass} ${btn.customiseLayer}`}
                            theme={btn.theme ?? activeTheme}
                            onClick={btn.onClick}
                        />
                    );
                })}
            {children && children}
        </div>
    );
}
