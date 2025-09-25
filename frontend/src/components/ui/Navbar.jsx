"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-scroll"; // <-- import Link

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);

  // Apply/remove dark class on body
  useEffect(() => {
    const body = document.body;
    if (isDark) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="fixed top-0 left-0 w-full border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur-md z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
          MyApp
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6 text-gray-700 dark:text-gray-300">
          <Link
            to="features"
            smooth={true}
            offset={-80} // adjust for fixed navbar height
            duration={500}
            className="cursor-pointer hover:text-gray-900 dark:hover:text-white"
          >
            Features
          </Link>
          <Link
            to="testimonials"
            smooth={true}
            offset={-80}
            duration={500}
            className="cursor-pointer hover:text-gray-900 dark:hover:text-white"
          >
            Testimonials
          </Link>
          <Link
            to="contact"
            smooth={true}
            offset={-80}
            duration={500}
            className="cursor-pointer hover:text-gray-900 dark:hover:text-white"
          >
            Contact
          </Link>
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
