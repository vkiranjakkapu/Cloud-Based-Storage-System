import type { ReactNode } from "react";

type FocusMenuProps = {
    children: ReactNode;
};

export default function FocusMenu({ children }: FocusMenuProps) {
    return children;
}
