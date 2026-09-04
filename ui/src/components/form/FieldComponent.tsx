import type { ReactNode } from "react";

type FieldComponentProps = {
    children: ReactNode;
    customise?: string;
};

export default function FieldComponent({
    children,
    customise,
}: FieldComponentProps) {
    return (
        <div
            className={`flex flex-row min-h-9 shrink-0 items-center overflow-hidden 
                focus-within:ring-2 

                focus-within:ring-[color-mix(in_srgb,currentColor_16%,transparent)] 
                dark:focus-within:ring-[color-mix(in_srgb,currentColor_30%,transparent)] 

                focus-within:border-[color-mix(in_srgb,currentColor_30%,transparent)]
                dark:focus-within:border-[color-mix(in_srgb,currentColor_60%,transparent)]

                bg-white/70 dark:bg-secondary-dark
                rounded-lg border border-slate-200 dark:border-cool/15
                ${customise}`}
        >
            {children}
        </div>
    );
}
