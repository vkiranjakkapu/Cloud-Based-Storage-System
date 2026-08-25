import type { ReactNode } from "react";

export type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <>{children}</>;
}
