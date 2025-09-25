"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react"; // eslint-disable-line no-unused-vars
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import { apiFetch } from "../../lib/api";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function SummaryList({ summaries = [], token, onDeleted }) {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  // Function to extract title from markdown content
  function extractTitleFromMarkdown(markdownText) {
    // Ensure markdownText is a string
    if (!markdownText || typeof markdownText !== "string") {
      return "Untitled";
    }

    // Look for **Title**: pattern in the markdown
    const titleMatch = markdownText.match(/\*\*Title\*\*:\s*(.+?)(?:\n|$)/i);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }

    // Fallback: look for any heading with "Title" or first h1/h2
    const headingMatch = markdownText.match(/^#+\s*(.+?)(?:\n|$)/m);
    if (headingMatch && headingMatch[1]) {
      return headingMatch[1].trim();
    }

    return "Untitled";
  }

  async function remove(id) {
    if (!confirm("Delete this summary?")) return;
    await apiFetch("/summaries/" + id, { method: "DELETE", token });
    onDeleted && onDeleted();
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") setActive(null);
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  if (!summaries.length) {
    return (
      <p className="text-center text-gray-500">No summaries yet. Create one.</p>
    );
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Modal */}
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${active._id}-${id}`}
              ref={ref}
              className="w-full max-w-[800px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-xl">
              <div className="flex justify-between items-start p-4">
                <div>
                  <motion.h3
                    layoutId={`title-${active._id}-${id}`}
                    className="font-bold text-neutral-700 dark:text-neutral-200 text-lg">
                    {active.title}
                  </motion.h3>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(active._id)}>
                  Delete
                </Button>
              </div>

              <div className="px-4 pb-4 overflow-auto space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
                {/* Display markdown content with ReactMarkdown */}
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2 mt-4">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-3">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-neutral-700 dark:text-neutral-300 mb-2 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 mb-3 text-neutral-700 dark:text-neutral-300">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-neutral-700 dark:text-neutral-300">
                          {children}
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {children}
                        </strong>
                      ),
                    }}>
                    {active.markdownContent}
                  </ReactMarkdown>
                </div>

                <p className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                  Model: {active.model || "gemini-2.5-flash"}
                </p>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Summary Cards List */}
      <ul className="max-w-3xl mx-auto w-full grid grid-cols-1 gap-4">
        {summaries.map((s) => {
          // Handle markdown text response - aiSummary is an array of strings
          const markdownText = Array.isArray(s.aiSummary)
            ? s.aiSummary.join("\n")
            : String(s.aiSummary || "");

          const cardData = {
            _id: s._id,
            title: extractTitleFromMarkdown(markdownText),
            heading: null,
            model: s.aiMetadata?.model || "gemini-2.5-flash",
            markdownContent: markdownText,
          };

          return (
            <motion.div
              key={s._id}
              onClick={() => {
                setActive(cardData);
              }}
              layoutId={`card-${s._id}-${id}`}
              className="p-4 flex justify-between items-center bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl cursor-pointer shadow-sm">
              <div>
                <motion.h3
                  layoutId={`title-${s._id}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200">
                  {cardData.title}
                </motion.h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                  {markdownText.length > 100
                    ? markdownText.substring(0, 100) + "..."
                    : markdownText}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {cardData.model || "gemini-2.5-flash"}
              </span>
            </motion.div>
          );
        })}
      </ul>
    </>
  );
}
