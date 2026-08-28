import type { ActionButtonProps } from "./ActionButtonComponent";
import ActionButton from "./ActionButtonComponent";
import type { IconThemes } from "./IconComponent";

export type ButtonGroupComponentProps = {
    theme?: "primary-blur" | "secondary-blur";
    buttons: (ActionButtonProps & {
        active?: boolean;
    })[];
    rounded?: "sm" | "md" | "lg" | "full";
    autoAlign?: boolean;
    customise?: string;
};

export function ButtonGroupComponent({
    theme = "secondary-blur",
    buttons,
    rounded = "md",
    autoAlign = false,
    customise,
}: ButtonGroupComponentProps) {
    const seperatorColor =
        theme === "primary-blur"
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
            {buttons.map((btn, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === buttons!.length - 1;
                const roundedClass =
                    isFirst && isLast
                        ? `rounded-${rounded}`
                        : isFirst
                          ? `rounded-t-${rounded} md:rounded-l-${rounded} md:rounded-tr-none`
                          : isLast &&
                            `rounded-b-${rounded} md:rounded-r-${rounded} md:rounded-bl-none`;

                const activeTheme = (
                    btn.active ? theme.split("-")[0] : theme
                ) as IconThemes;
                return (
                    <ActionButton
                        key={idx}
                        customise={`size-7 rounded-none ${roundedClass}`}
                        hoverEffect={`rounded-none ${roundedClass}`}
                        theme={activeTheme}
                        onClick={btn.onClick}
                        {...btn}
                    />
                );
            })}
        </div>
    );
}
