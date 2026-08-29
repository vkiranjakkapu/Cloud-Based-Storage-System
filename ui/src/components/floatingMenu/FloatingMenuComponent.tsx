import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { IconProps } from "../Commons";
import IconComponent, { type IconComponentProps } from "../IconComponent";
import type { MenuItem } from "./FloatingMenu";
import FloatingMenu from "./FloatingMenu";

/**
 * For type: 'text', 'props.text' is the display text
 */
export type FloatingMenuComponentProps = {
    type: "icon" | "text";
    items: MenuItem[];
    props?: IconComponentProps;
    useIcon?: IconProps;

    menuId?: string;
    activeMenu?: string | null;
    setActiveMenu?: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function FloatingMenuComponent({
    type,
    items,
    props,
    useIcon,
    menuId,
    activeMenu,
    setActiveMenu,
}: FloatingMenuComponentProps) {
    const [localActive, setLocalActive] = useState(false);

    const isControlled =
        menuId !== undefined &&
        activeMenu !== undefined &&
        setActiveMenu !== undefined;

    const isActive = isControlled ? activeMenu === menuId : localActive;

    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0,
    });

    const parentRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!parentRef.current || !menuRef.current) return;

        const updatePosition = () => {
            if (!parentRef.current || !menuRef.current) return;

            const parent = parentRef.current.getBoundingClientRect();
            const menu = menuRef.current.getBoundingClientRect();

            setMenuPosition({
                top: parent.bottom + 4,
                left: parent.right - menu.width,
            });
        };

        updatePosition();

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, []);

    const toggleMenu = () => {
        if (isControlled) {
            setActiveMenu(isActive ? null : menuId);
            return;
        }

        setLocalActive((prev) => !prev);
    };

    const menu = (
        <div
            ref={menuRef}
            className={`
            fixed z-50
            transition-all duration-200 ease-in-out
            ${
                isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 pointer-events-none -translate-y-2"
            }
        `}
            style={{
                top: menuPosition.top,
                left: menuPosition.left,
                transformOrigin: "top right",
            }}
        >
            <FloatingMenu items={items} />
        </div>
    );

    return (
        <>
            <div className="relative w-fit">
                <div
                    ref={parentRef}
                    className="relative z-2 cursor-pointer p-0.5"
                >
                    {type === "text" ? (
                        <IconComponent
                            customiseIcon="size-4"
                            onClick={toggleMenu}
                            {...props}
                        />
                    ) : (
                        type === "icon" && (
                            <IconComponent
                                theme={isActive ? "primary" : "secondary-blur"}
                                customise="size-8"
                                icon={
                                    isActive
                                        ? XMarkIcon
                                        : (useIcon ?? EllipsisVerticalIcon)
                                }
                                customiseIcon="size-4"
                                onClick={toggleMenu}
                                {...props}
                            />
                        )
                    )}
                </div>
            </div>

            {createPortal(menu, document.body)}
        </>
    );
}
