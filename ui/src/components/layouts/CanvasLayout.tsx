import type { ReactNode } from "react";

export type CanvasLayoutProps = {
    children: ReactNode;
};

export default function CanvasLayout({ children }: CanvasLayoutProps) {
    return (
        <main className="min-h-screen">
            {children}
        </main>
    );
}
