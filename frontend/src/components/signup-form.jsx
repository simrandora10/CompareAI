"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import apiFetch from "../lib/api"; // make sure this path is correct

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className="mb-6 rounded-md border px-4 py-2 text-sm font-medium 
                 bg-neutral-100 text-neutral-900
                 dark:bg-neutral-800 dark:text-neutral-100"
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: formData,
      });
      setLoading(false);
      if (res) {
        alert("Signup successful!");
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6 dark:bg-neutral-950">
        <ThemeToggle />

        <div className="shadow-input mx-auto w-full max-w-md rounded-lg bg-white p-6 md:rounded-2xl md:p-8 dark:bg-neutral-900">
          <h2 className="text-center text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to Project
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Create an account to start comparing
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <LabelInputContainer>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Tyler"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            </div>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md 
             bg-gradient-to-br from-gray-900 to-gray-700 
             font-medium text-white 
             shadow-[0px_1px_0px_0px_#ffffff40_inset,
                     0px_-1px_0px_0px_#ffffff40_inset] 
             dark:from-gray-100 dark:to-gray-300 
             dark:text-black 
             dark:shadow-[0px_1px_0px_0px_#27272a_inset,
                         0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up →"}
              <BottomGradient />
            </button>

            <div
              className="my-8 h-[1px] w-full bg-gradient-to-r 
                            from-transparent via-neutral-300 to-transparent 
                            dark:via-neutral-700"
            />
          </form>
          <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-200"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span
        className="absolute inset-x-0 -bottom-px block h-px w-full 
                   bg-gradient-to-r from-transparent via-cyan-500 to-transparent 
                   opacity-0 transition duration-500 
                   group-hover/btn:opacity-100"
      />
      <span
        className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 
                   bg-gradient-to-r from-transparent via-indigo-500 to-transparent 
                   opacity-0 blur-sm transition duration-500 
                   group-hover/btn:opacity-100"
      />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
