import { useEffect, useState } from "react";

export default function Navbar() {
    const isDarkMode = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return (
                document.documentElement.classList.contains("dark") ||
                localStorage.getItem("theme") === "dark"
            );
        }
        return true;
    });

    useEffect(() => {
        if (isDarkMode[0]) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);
    return <nav></nav>;
}
