import type { IconProps } from "./Commons";

export type IconComponentProps = {
    icon: IconProps;
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
    onClick?: () => void;
};

export default function IconComponent({
    icon,
    theme,
    customiseIcon,
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
                        className={`absolute inset-0 z-0 bg-primary backdrop-blur-sm group-hover:bg-primary/90 dark:group-hover:bg-primary/80 hover:bg-primary/90 dark:hover:bg-primary/80 transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    <Icon
                        className={`relative z-1 text-white pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                    />
                </>
            ) : theme === "primary-blur" ? (
                <>
                    <div
                        className={`absolute inset-0 z-0 bg-warm/40 dark:bg-warm/15 backdrop-blur-sm group-hover:bg-warm dark:group-hover:bg-warm/25 hover:bg-warm dark:hover:bg-warm/25 transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    <Icon
                        className={`relative z-1 text-primary pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                    />
                </>
            ) : theme === "secondary" ? (
                <>
                    <div
                        className={`absolute inset-0 z-0 bg-secondary/90 dark:bg-secondary-dark backdrop-blur-sm group-hover:bg-secondary dark:group-hover:bg-secondary-dark/80 hover:bg-secondary dark:hover:bg-secondary-dark/80 transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    <Icon
                        className={`relative z-1 text-white dark:text-cool pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                    />
                </>
            ) : theme === "secondary-blur" ? (
                <>
                    <div
                        className={`absolute inset-0 z-0 bg-secondary/10 dark:bg-slate-700 backdrop-blur-sm group-hover:bg-secondary/15 dark:group-hover:bg-slate-600/60 hover:bg-secondary/15 dark:hover:bg-slate-600/60 transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    <Icon
                        className={`relative z-1 text-secondary/70 dark:text-cool pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                    />
                </>
            ) : theme === "blur" ? (
                <>
                    <div
                        className={`absolute inset-0 z-0 bg-cool/35 backdrop-blur-sm group-hover:bg-cool/50 hover:bg-cool/50 transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    <Icon
                        className={`relative z-1 text-white dark:text-cool pointer-events-none ${customiseIcon ?? "size-4.5"}`}
                    />
                </>
            ) : (
                <>
                    <div
                        className={`absolute inset-0 z-0 bg-slate-100 dark:bg-secondary-dark/30 backdrop-blur-sm group-hover:bg-slate-200 dark:group-hover:bg-secondary-dark/70 hover:bg-slate-200 dark:hover:bg-secondary-dark/70 transition-colors duration-100 ${hoverEffect}`}
                    ></div>
                    <Icon
                        className={`relative z-1 pointer-events-none ${customiseIcon ?? "size-4.5 text-secondary/80 dark:text-cool"}`}
                    />
                </>
            )}
        </div>
    );
}
