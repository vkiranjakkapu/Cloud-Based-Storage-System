import type { IconProps } from "./Commons";

export type IconComponentProps = {
    icon?: IconProps;
    text?: string;
    theme?:
        | "primary"
        | "primary-blur"
        | "secondary"
        | "secondary-blur"
        | "blur"
        | "";
    customise?: string;
    hoverEffect?: string;
    customiseIcon?: string;
    customiseText?: string;
    onClick?: () => void;
};

export default function IconComponent({
    icon,
    text,
    theme,
    customiseIcon,
    customiseText,
    customise,
    hoverEffect,
    onClick,
}: IconComponentProps) {
    const Icon = icon;

    return (
        <div
            className={`cursor-pointer relative rounded-full overflow-hidden inline-flex items-center justify-center ${customise ?? "size-9.5"}`}
            onClick={onClick}
        >
            {theme === "primary" ? (
                <>
                    <div
                        className={`absolute inset-0 z-0 rounded-full backdrop-blur-sm
                            bg-primary
                            group-hover:bg-primary/90 dark:group-hover:bg-primary/80 
                            hover:bg-primary/90 dark:hover:bg-primary/80
                            transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    {Icon && (
                        <Icon
                            className={`relative z-1 text-white pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                        />
                    )}
                    {text && (
                        <span
                            className={`relative z-1 text-white pointer-events-none font-semibold text-xs ${customiseText}`}
                        >
                            {text}
                        </span>
                    )}
                </>
            ) : theme === "primary-blur" ? (
                <>
                    <div
                        className={`absolute inset-0 z-0 rounded-full backdrop-blur-sm
                            bg-warm/40 dark:bg-warm/15
                            group-hover:bg-warm dark:group-hover:bg-warm/25 
                            hover:bg-warm dark:hover:bg-warm/25
                            transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    {Icon && (
                        <Icon
                            className={`relative z-1 text-primary pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                        />
                    )}
                    {text && (
                        <span
                            className={`relative z-1 text-primary pointer-events-none font-semibold text-xs ${customiseText}`}
                        >
                            {text}
                        </span>
                    )}
                </>
            ) : theme === "secondary" ? (
                <>
                    <div
                        className={`absolute inset-0 z-0 rounded-full backdrop-blur-sm
                            bg-secondary/90 dark:bg-cool
                            group-hover:bg-secondary dark:group-hover:bg-cool/85 
                            hover:bg-secondary dark:hover:bg-cool/85
                            transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    {Icon && (
                        <Icon
                            className={`relative z-1 text-white dark:text-secondary pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                        />
                    )}
                    {text && (
                        <span
                            className={`relative z-1 text-white dark:text-secondary pointer-events-none font-semibold text-xs ${customiseText}`}
                        >
                            {text}
                        </span>
                    )}
                </>
            ) : theme === "secondary-blur" ? (
                <>
                    <div
                        className={`absolute inset-0 z-0 rounded-full backdrop-blur-sm
                            bg-secondary/10 dark:bg-secondary-dark/65
                            hover:bg-secondary/15 dark:hover:bg-secondary-dark/80
                            group-hover:bg-secondary/15 dark:group-hover:bg-secondary-dark/80
                            transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    {Icon && (
                        <Icon
                            className={`relative z-1 text-secondary/70 dark:text-cool pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                        />
                    )}
                    {text && (
                        <span
                            className={`relative z-1 text-secondary/70 dark:text-cool pointer-events-none font-semibold text-xs ${customiseText}`}
                        >
                            {text}
                        </span>
                    )}
                </>
            ) : theme === "blur" ? (
                <>
                    <div
                        className={`absolute inset-0 z-0 rounded-full backdrop-blur-sm
                            bg-cool/35
                            group-hover:bg-cool/50 hover:bg-cool/50
                            transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    {Icon && (
                        <Icon
                            className={`relative z-1 text-white dark:text-cool pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                        />
                    )}
                    {text && (
                        <span
                            className={`relative z-1 text-white dark:text-cool pointer-events-none font-semibold text-xs ${customiseText}`}
                        >
                            {text}
                        </span>
                    )}
                </>
            ) : (
                <>
                    <div
                        className={`absolute inset-0 z-0 rounded-full backdrop-blur-sm
                            bg-slate-100 dark:bg-secondary-dark/30
                            group-hover:bg-slate-200 dark:group-hover:bg-secondary-dark/70 
                            hover:bg-slate-200 dark:hover:bg-secondary-dark/70
                            transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    {Icon && (
                        <Icon
                            className={`relative z-1 pointer-events-none ${customiseIcon ?? "size-4.5 text-secondary/80 dark:text-cool"}`}
                        />
                    )}
                    {text && (
                        <span
                            className={`relative z-1 pointer-events-none text-secondary font-semibold text-xs ${customiseText}`}
                        >
                            {text}
                        </span>
                    )}
                </>
            )}
        </div>
    );
}
