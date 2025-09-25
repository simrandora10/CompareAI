"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-6 text-center text-gray-700 dark:text-gray-300 space-y-4">
        <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Contact
          </a>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Made with ❤️ using AI-powered tools.
        </p>
      </div>
    </footer>
  );
}
