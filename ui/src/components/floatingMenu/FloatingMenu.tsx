import type { IconProps } from "../Commons";
import IconComponent from "../IconComponent";

export type MenuItem = {
    text?: string;
    icon?: IconProps;
    title?: string;
    onClick?: () => void;
};

export type MenuItemProps = {
    items: MenuItem[];
};

export default function FloatingMenu({ items }: MenuItemProps) {
    if (items.some((item) => item.text)) {
        return (
            <div
                className={`
                    min-w-30 rounded-md overflow-hidden transition-colors duration-100 shadow-md
                    border border-white dark:border-cool/30 
                    bg-cool/50 dark:bg-secondary-dark/65 backdrop-blur-md
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
                            hover:bg-white/40 dark:hover:bg-secondary-dark/70
                        `}
                            onClick={item.onClick}
                        >
                            {item.icon && (
                                <item.icon className="size-3 mr-0.5" />
                            )}
                            <span>{item.text}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="space-y-1 p-0.5 rounded-lg bg-cool dark:bg-cool/20 backdrop-blur-md ">
            {items.map((item, idx) => (
                <IconComponent
                    key={idx}
                    customise="size-8"
                    customiseIcon="size-4"
                    {...item}
                />
            ))}
        </div>
    );
}
