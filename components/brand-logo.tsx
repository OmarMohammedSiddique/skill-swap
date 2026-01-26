"use client";

import { RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function BrandLogo() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by rendering a placeholder or default until mounted
    if (!mounted) {
        return (
            <div className="flex items-center gap-2 font-bold text-xl cursor-pointer text-foreground">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                    <RefreshCw size={20} />
                </div>
                <span>SkillSwap</span>
            </div>
        );
    }

    const isDark = theme === "dark";

    return (
        <div className="flex items-center gap-2 font-bold text-xl cursor-pointer text-foreground transition-colors duration-300">
            <div
                className={`p-1.5 rounded-lg text-white transition-colors duration-300 ${isDark ? "bg-orange-500" : "bg-indigo-600"}`}
            >
                <RefreshCw size={20} className={isDark ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"} />
            </div>
            <span>SkillSwap</span>
        </div>
    );
}
