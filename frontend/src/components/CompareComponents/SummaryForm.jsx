"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiFetch } from "../../lib/api";

export default function SummaryForm({ token, onCreated }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter the input to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const body = { input };
      const res = await apiFetch("/summaries", { body, method: "POST", token });
      if (res) {
        alert("Product analysis completed successfully!");
        setInput("");
        onCreated && onCreated(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Error creating analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full md:w-3/4 lg:w-2/3 mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
      <CardContent className="space-y-4">
        <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
          Analyze Product with AI
        </CardTitle>

        <form
          onSubmit={submit}
          className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Textarea for input */}
          <div className="flex flex-col md:gap-5">
            <Label htmlFor="input">Product URL or Description</Label>
            <textarea
              id="input"
              placeholder="Paste a product URL or description here. Examples:
• https://amazon.com/product-page
• iPhone 15 Pro Max with 256GB storage, titanium finish, A17 Pro chip, 48MP camera system, all-day battery life, starting at $1199"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              disabled={loading}
              className="w-full rounded-md border px-3 py-2 resize-none dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
              <span className="text-sm">AI is analyzing your product...</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={loading || !input.trim()}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing with AI...
                </>
              ) : (
                "Analyze Product"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => {
                setInput("");
                setError("");
              }}
              disabled={loading}>
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
