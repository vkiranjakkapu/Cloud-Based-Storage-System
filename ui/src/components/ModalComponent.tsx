import React, {
    useEffect,
    type ForwardRefExoticComponent,
    type PropsWithoutRef,
    type SVGProps,
} from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ActionButton from "./ActionButtonComponent";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: ForwardRefExoticComponent<
        PropsWithoutRef<SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        }
    >;
    children: React.ReactNode;
    maxWidthClass?:
        | "max-w-md"
        | "max-w-lg"
        | "max-w-xl"
        | "max-w-2xl"
        | "max-w-4xl"
        | "max-w-6xl";
}

export default function ModalComponent({
    isOpen,
    onClose,
    title,
    icon: Icon,
    children,
    maxWidthClass = "max-w-lg",
}: ModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modal = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="fixed inset-0 bg-slate-900/40 dark:bg-secondary-dark/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Body Container */}
            <div
                className={`relative w-full ${maxWidthClass} transform rounded-xl bg-white dark:bg-secondary-dark border border-slate-200/80 dark:border-cool/15 p-6 text-left shadow-2xl transition-all duration-200 ease-out`}
            >
                {/* Header Block */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-cool/15">
                    <h3 className="flex gap-1 items-center justify-start font-semibold text-current capitalize">
                        {Icon && <Icon className="size-4" />}
                        <span>{title}</span>
                    </h3>
                    <ActionButton
                        onClick={onClose}
                        icon={XMarkIcon}
                        theme="secondary-blur"
                        aria-label="Close modal"
                    />
                </div>

                <div className="max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
    return <>{createPortal(modal, document.body)}</>;
}
