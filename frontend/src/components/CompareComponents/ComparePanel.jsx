"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { apiFetch } from "../../lib/api";

export default function ComparePanel({ summaries = [], token }) {
  const [selected, setSelected] = useState([]);
  const [budget, setBudget] = useState("");
  const [features, setFeatures] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function compare() {
    if (selected.length < 2) {
      setError("Please select at least 2 products to compare.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/summaries/compare", {
        token,
        body: { ids: selected },
        method: "POST",
      });

      if (!res) {
        setError("Failed to compare products. Please try again.");
        return;
      }

      // Display the markdown comparison results
      const comparison = res.comparison;
      let msg = "AI Comparison Results:\n\n";
      msg += comparison || "Comparison completed successfully!";

      alert(msg);
      console.log("Compare results", res);
    } catch (err) {
      console.error(err);
      setError("Error comparing products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Compare Products</CardTitle>
        <CardDescription>
          Select at least 2 products, add filters, and let AI rank them for you.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Product Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Products</Label>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map((s) => (
              <div
                key={s._id}
                className="flex items-center space-x-2 rounded-md border p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <Checkbox
                  id={s._id}
                  checked={selected.includes(s._id)}
                  onCheckedChange={() => toggle(s._id)}
                  disabled={loading}
                />
                <Label
                  htmlFor={s._id}
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  {s.extracted?.title || s._id}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center space-x-2 text-indigo-600 dark:text-indigo-400 py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            <span className="text-sm font-medium">
              AI is comparing products...
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (optional)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="Enter max budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Desired Features</Label>
            <Input
              id="features"
              placeholder="e.g. fast charging, OLED, 16GB RAM"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <Separator />

        {/* Action */}
        <div className="flex justify-end">
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            onClick={compare}
            disabled={loading || selected.length < 2}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Comparing...
              </>
            ) : (
              "Compare (AI Powered)"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
