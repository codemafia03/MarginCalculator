"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white shadow-lg border border-gray-200 w-11 h-11" />
        );
    }

    return <ThemeToggleInner />;
}

function ThemeToggleInner() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 hover:scale-110 transition-all duration-200"
            aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
        >
            {theme === "light" ? (
                <Moon className="w-5 h-5 text-slate-700" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
            )}
        </button>
    );
}
