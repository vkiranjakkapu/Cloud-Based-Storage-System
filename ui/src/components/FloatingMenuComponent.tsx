import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import type { IconProps } from "./Commons";
import IconComponent, {
    type IconComponentProps
} from "./IconComponent";

export type FloatingMenuComponentProps = {
    type: "icon" | "text";
    items: MenuItem[];
    props?: IconComponentProps;
    useIcon?: IconProps;
};

export type MenuItem = {
    text?: string;
    icon?: IconProps;
    title?: string;
    onClick: () => void;
};

export type MenuItemProps = {
    items: MenuItem[];
};

export default function FloatingMenuComponent({
    type,
    items,
    props,
    useIcon,
}: FloatingMenuComponentProps) {
    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <div className={`relative`}>
            <div className="relative z-2 cursor-pointer p-0.5">
                {type === "text" ? (
                    <IconComponent
                        customiseIcon="size-4"
                        onClick={() => setIsActive(!isActive)}
                        {...props}
                    />
                ) : (
                    type === "icon" && (
                        <IconComponent
                            theme={isActive ? `primary` : `secondary-blur`}
                            customise="size-8"
                            icon={
                                isActive
                                    ? XMarkIcon
                                    : (useIcon ?? EllipsisVerticalIcon)
                            }
                            customiseIcon="size-4"
                            onClick={() => setIsActive(!isActive)}
                            {...props}
                        />
                    )
                )}
            </div>
            <div
                className={`absolute z-5 right-0 *:mt-1
                    ${isActive ? `top-full opacity-100 scale-y-100` : `top-[calc(100%+0.5rem)] opacity-0 pointer-events-none scale-y-95`}
                    transition-all duration-300 ease-in-out
                `}
            >
                <FloatingMenu items={items} />
            </div>
        </div>
    );
}

export function FloatingMenu({ items }: MenuItemProps) {
    if (items.some((item) => item.text)) {
        return (
            <div
                className={`
                    min-w-30 rounded-md overflow-hidden transition-colors duration-100 shadow-md
                    border border-white bg-warm dark:bg-secondary-dark/65 backdrop-blur-md
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
