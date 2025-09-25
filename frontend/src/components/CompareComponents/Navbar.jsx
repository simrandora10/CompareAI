"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";


export default function ComparisonNavbar() {
  const [isDark, setIsDark] = useState(true);

  // Apply/remove dark mode class
  useEffect(() => {
    const body = document.body;
    if (isDark) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="fixed top-0 left-0 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
          CompareAI
        </div>


        {/* Theme Switch */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">🌞</span>
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setIsDark(checked)}
            aria-label="Toggle theme"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">🌙</span>
        </div>
      </nav>
    </header>
  );
}
