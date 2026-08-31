import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/16/solid";
import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import type { IconProps } from "../Commons";
import IconComponent, {
    type IconComponentProps,
    type IconThemes,
} from "../IconComponent";
import type { MenuItem } from "./FloatingMenu";
import FloatingMenu from "./FloatingMenu";

/**
 * For type: 'text', 'props.text' is the display text,
 * If 'icon' Use 'props.menutheme' to set theme for menu items.
 * For menu alignment, use 'props.menualignment'.
 */
export type FloatingMenuComponentProps<T> = {
    type: "icon" | "text";
    items: MenuItem<T>[];
    props?: IconComponentProps & {
        menutheme?: IconThemes;
    };
    alignment?: "left" | "bottom";
    useIcon?: IconProps;

    menuId?: string;
    activeMenu?: string | null;
    setActiveMenu?: Dispatch<SetStateAction<string | null>>;
};

export default function FloatingMenuComponent<T>({
    type = "icon",
    items,
    props,
    alignment = "bottom",
    useIcon,
    menuId,
    activeMenu,
    setActiveMenu,
}: FloatingMenuComponentProps<T>) {
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
                top:
                    type === "icon" && alignment === "left"
                        ? parent.top + (parent.height - menu.height) / 2
                        : parent.bottom + 4,
                left:
                    type === "icon" && alignment === "left"
                        ? parent.left - menu.width - 4
                        : parent.right - menu.width,
            });
        };

        updatePosition();

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [type, alignment]);

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
                    ? `opacity-100 ${alignment === "bottom" ? "translate-y-0" : "translate-x-0"}`
                    : `opacity-0 pointer-events-none ${alignment === "bottom" ? "-translate-y-2" : "translate-x-2"}`
            }
        `}
            style={{
                top: menuPosition.top,
                left: menuPosition.left,
                transformOrigin: "top right",
            }}
        >
            <FloatingMenu
                items={items}
                theme={props?.menutheme}
                alignment={alignment}
            />
        </div>
    );

    return (
        <>
            <div
                className="relative w-fit"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    ref={parentRef}
                    className="relative z-2 cursor-pointer p-0.5"
                >
                    {type === "text" ? (
                        <IconComponent
                            {...{
                                ...props,
                                menutheme: props?.menutheme + "",
                            }}
                            customiseIcon={`size-4 ${props?.customiseIcon}`}
                            onClick={toggleMenu}
                        />
                    ) : (
                        type === "icon" && (
                            <IconComponent
                                {...{
                                    ...props,
                                    menutheme: props?.menutheme + "",
                                }}
                                theme={
                                    isActive
                                        ? "primary"
                                        : (props?.theme ?? "secondary-blur")
                                }
                                customise={`size-8 ${props?.customise}`}
                                icon={
                                    isActive
                                        ? XMarkIcon
                                        : (useIcon ?? EllipsisVerticalIcon)
                                }
                                customiseIcon={`size-4 ${props?.customiseIcon}`}
                                onClick={toggleMenu}
                            />
                        )
                    )}
                </div>
            </div>

            {createPortal(menu, document.body)}
        </>
    );
}
