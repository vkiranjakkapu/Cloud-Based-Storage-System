import type { ReactNode } from "react";

export type CanvasLayoutProps = {
    children: ReactNode;
};

export default function CanvasLayout({ children }: CanvasLayoutProps) {
    return (
        <main className="bg-cool/60 dark:bg-secondary-dark min-h-screen">
            {children}
        </main>
    );
}
