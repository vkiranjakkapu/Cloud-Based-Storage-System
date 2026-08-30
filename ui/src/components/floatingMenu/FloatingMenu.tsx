import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import IconComponent, {
    type IconComponentProps,
    type IconThemes,
} from "../IconComponent";

export type MenuItem<T> = {
    target?: T;
    text?: string;
    icon?: IconComponentProps;
    title?: string;
    className?: string;
    onClick: (target: T | unknown) => void;
};

export type MenuItemProps<T> = {
    items: MenuItem<T>[];
    theme?: IconThemes;
    alignment?: "left" | "bottom";
};

export default function FloatingMenu<T>({
    items,
    theme,
    alignment,
}: MenuItemProps<T>) {
    if (items.some((item) => item.text !== undefined)) {
        return (
            <div
                className={`
                    min-w-30 rounded-md overflow-hidden transition-colors duration-100 shadow-md
                    border border-white dark:border-cool/30 
                    bg-cool/50 dark:bg-cool/20 backdrop-blur-md
                    divide-y divide-white dark:divide-secondary  
                `}
            >
                {items.map((item, idx) => {
                    return (
                        <div
                            key={idx}
                            className={`
                                flex justify-start items-center 
                                gap-1 p-1 px-2 cursor-pointer
                                hover:bg-white/40 dark:hover:bg-secondary-dark/70 group
                                ${item.className}
                            `}
                            onClick={() => item.onClick?.(item.target)}
                            title={item.title ?? ""}
                        >
                            {item.icon && (
                                <IconComponent
                                    {...item.icon}
                                    customise="size-6"
                                    customiseIcon={`size-3.5! ${item.icon.customiseIcon}`}
                                    theme={
                                        item.icon.theme
                                            ? item.icon.theme
                                            : theme && theme
                                    }
                                />
                            )}
                            {item.text && (
                                <span>
                                    {item.text ?? "Menu Item " + (idx + 1)}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div
            className={`
                p-0.5 rounded-lg bg-cool/50 dark:bg-cool/20 backdrop-blur-md
            ${alignment === "bottom" ? `space-y-1` : `flex gap-1`}
        `}
        >
            {items.map((item, idx) => {
                return (
                    <IconComponent
                        key={idx}
                        {...item}
                        theme={theme}
                        customise={`size-8! ${item.icon?.customise}`}
                        customiseIcon={`size-4! ${item.icon?.customiseIcon}`}
                        icon={item.icon?.icon ?? EllipsisVerticalIcon}
                        onClick={() => {
                            item.onClick(item.target);
                        }}
                    />
                );
            })}
        </div>
    );
}
