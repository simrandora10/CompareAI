"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"; // adjust import path

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Ripple Background */}
      <BackgroundRippleEffect rows={8} cols={27} cellSize={56} />

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 flex flex-col-reverse lg:flex-row items-center justify-between gap-16">
        
        {/* Hero Text */}
        <div className="max-w-lg text-center lg:text-left space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Compare Products Smarter with AI
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Instantly analyze, compare, and choose the best products using our AI-powered platform. 
            Save time, make informed decisions, and never settle for less.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="/login">
              <Button className="group/btn relative block h-10 w-full rounded-md 
               bg-gradient-to-br from-gray-900 to-gray-700 
               font-medium text-white 
               shadow-[0px_1px_0px_0px_#ffffff40_inset,
                       0px_-1px_0px_0px_#ffffff40_inset] 
               dark:from-gray-100 dark:to-gray-300 
               dark:text-black 
               dark:shadow-[0px_1px_0px_0px_#27272a_inset,
                           0px_-1px_0px_0px_#27272a_inset]">
                Get Started
              </Button>
            </a>
          </div>
        </div>

        {/* Hero Illustration / Card */}
        <Card className="w-full max-w-lg shadow-2xl border-none">
          <CardContent className="p-8 bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex flex-col items-center justify-center gap-4">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                AI Product Comparison
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Compare multiple products side by side instantly and get AI-driven recommendations.
              </p>
            </div>
            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              {/* Example product cards */}
              {["A", "B", "C"].map((label, i) => (
                <Card key={i} className="w-36 bg-white dark:bg-gray-900 rounded-xl shadow">
                  <CardContent className="text-center">
                    <p className="font-bold">Product {label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">⭐ {4.5 + i * 0.1}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="group/btn relative block h-10 w-full rounded-md 
             bg-gradient-to-br from-gray-900 to-gray-700 
             font-medium text-white 
             shadow-[0px_1px_0px_0px_#ffffff40_inset,
                     0px_-1px_0px_0px_#ffffff40_inset] 
             dark:from-gray-100 dark:to-gray-300 
             dark:text-black 
             dark:shadow-[0px_1px_0px_0px_#27272a_inset,
                         0px_-1px_0px_0px_#27272a_inset]">
              Compare Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
