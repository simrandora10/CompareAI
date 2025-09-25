"use client";

import React from "react";
import { HoverEffect } from "./card-hover-effect";

const aboutItems = [
  {
    title: "Instant Comparison",
    description:
      "Compare multiple products side by side in seconds using AI-powered insights.",
    link: "#",
  },
  {
    title: "Smart Recommendations",
    description:
      "Get intelligent product suggestions based on your preferences and usage patterns.",
    link: "#",
  },
  {
    title: "Save Time & Effort",
    description:
      "Stop wasting hours reading reviews manually. Let AI summarize and rank products for you.",
    link: "#",
  },
  {
    title: "Data-Driven Insights",
    description:
      "Make informed decisions with metrics, ratings, and AI-analyzed comparisons.",
    link: "#",
  },
  {
    title: "Interactive Dashboard",
    description:
      "Visualize and track products, comparisons, and AI scores in one place.",
    link: "#",
  },
  {
    title: "Personalized Filters",
    description:
      "Narrow down choices quickly with AI-powered filters tailored to your needs.",
    link: "#",
  },
];

export default function About() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            About Our Project
          </h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            We leverage AI to help you compare products faster and smarter. 
            Explore the features that make our platform efficient and insightful.
          </p>
        </div>

        <HoverEffect items={aboutItems} />
      </div>
    </section>
  );
}
