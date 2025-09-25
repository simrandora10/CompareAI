"use client";

import React, { useState, useEffect } from "react";
import SummaryForm from "./CompareComponents/SummaryForm";
import SummaryList from "./CompareComponents/SummaryList";
import ComparePanel from "./CompareComponents/ComparePanel";
import Navbar from "./CompareComponents/Navbar";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconPlus,
  IconList,
  IconArrowsRightLeft,
  IconSettings,
} from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { apiFetch } from "../lib/api";

// Updated dummy data to match Gemini response structure (for reference)
const DUMMY_SUMMARIES = [
  {
    _id: "1",
    userId: "dummy-user",
    rawInput: "iPhone 15 Pro Max",
    sourceUrl: null,
    aiSummary: `# Product Analysis

## Product Information
- **Title**: iPhone 15 Pro Max
- **Brand**: Apple
- **Category**: Smartphone
- **Price**: $1,199
- **Rating**: 4.5/5
- **Availability**: In Stock

## Key Features
- A17 Pro chip with 6-core CPU
- 48MP Main camera with 5x Telephoto
- Titanium design
- All-day battery life
- Action Button

## Pros
- Excellent camera system
- Premium build quality
- Powerful A17 Pro chip
- Long battery life

## Cons
- Expensive price point
- Large size may not suit everyone
- Limited customization options

## Analysis & Scores
- **Overall Score**: 9/10

## Recommendation
Buy - Excellent flagship smartphone with top-tier performance and camera system`,
    aiMetadata: {
      model: "gemini-2.5-flash",
      timestamp: new Date(),
      inputType: "text",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    userId: "dummy-user",
    rawInput: "Samsung Galaxy S24 Ultra",
    sourceUrl: null,
    aiSummary: `# Product Analysis

## Product Information
- **Title**: Samsung Galaxy S24 Ultra
- **Brand**: Samsung
- **Category**: Smartphone
- **Price**: $1,299
- **Rating**: 4.3/5
- **Availability**: In Stock

## Key Features
- Snapdragon 8 Gen 3 processor
- 200MP camera with 10x optical zoom
- S Pen included
- Titanium frame
- AI-powered features

## Pros
- Outstanding camera zoom capabilities
- S Pen functionality
- AI features
- Premium materials

## Cons
- Higher price than competitors
- Large and heavy
- Complex software

## Analysis & Scores
- **Overall Score**: 8.5/10

## Recommendation
Consider - Great for photography enthusiasts and S Pen users`,
    aiMetadata: {
      model: "gemini-2.5-flash",
      timestamp: new Date(),
      inputType: "text",
    },
    createdAt: new Date().toISOString(),
  },
];

export default function ComparisonPage() {
  const [summaries, setSummaries] = useState([]);
  const [activeTab, setActiveTab] = useState("add");
  const [openSheet, setOpenSheet] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const usertoken = localStorage.getItem("token");

  // Fetch summaries on component mount
  useEffect(() => {
    if (usertoken) {
      fetchSummaries();
    }
  }, [usertoken]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchSummaries() {
    if (!usertoken) return;
    setLoading(true);
    try {
      const res = await apiFetch("/summaries", {
        method: "GET",
        token: usertoken,
      });
      if (res && res.data) {
        setSummaries(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch summaries:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (openSheet) {
      (async () => {
        try {
          const res = await apiFetch("/auth/getUser", {
            method: "GET",
            token: usertoken,
          });
          if (res) setUser(res);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      })();
    }
  }, [openSheet, usertoken]);
  console.log(user);

  async function handleDeleteUser() {
    if (!confirm("Are you sure you want to delete your account?")) return;
    try {
      await apiFetch("/auth/delete", { method: "DELETE", token: usertoken });
      alert("User deleted. Logging out...");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    }
  }

  const handleCreated = (newSummary) => {
    setSummaries((prev) => [newSummary, ...prev]);
    setActiveTab("list");
  };

  const handleDeleted = () => {
    fetchSummaries(); // Refresh the list
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar>
          <SidebarBody className="flex flex-col justify-between p-4 mt-14 h-[calc(100vh-64px)]">
            {/* Top links */}
            <div className="flex flex-col gap-2">
              <SidebarLink
                link={{ label: "Add Summary", href: "#", icon: <IconPlus /> }}
                onClick={() => setActiveTab("add")}
              />
              <SidebarLink
                link={{ label: "Summary List", href: "#", icon: <IconList /> }}
                onClick={() => setActiveTab("list")}
              />
              <SidebarLink
                link={{
                  label: "Compare Summaries",
                  href: "#",
                  icon: <IconArrowsRightLeft />,
                }}
                onClick={() => setActiveTab("compare")}
              />
            </div>

            {/* Bottom settings */}
            <div className="mt-auto">
              <SidebarLink
                link={{ label: "Settings", href: "#", icon: <IconSettings /> }}
                onClick={() => setOpenSheet(true)}
              />
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 p-8 mt-16">
          {activeTab === "add" && (
            <SummaryForm
              token={usertoken}
              onCreated={handleCreated}
            />
          )}
          {activeTab === "list" && (
            <div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                    <span className="text-lg font-medium">
                      Loading summaries...
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Fetching your product analyses
                  </p>
                </div>
              ) : (
                <SummaryList
                  summaries={summaries}
                  token={usertoken}
                  onDeleted={handleDeleted}
                />
              )}
            </div>
          )}
          {activeTab === "compare" && (
            <ComparePanel
              summaries={summaries}
              token={usertoken}
            />
          )}
        </main>
      </div>

      {/* Settings Sheet */}
      <Sheet
        open={openSheet}
        onOpenChange={setOpenSheet}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>User Settings</SheetTitle>
            <SheetDescription>
              Manage your account information and preferences.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4 p-5">
            {user ? (
              <>
                <p>
                  <strong>Name:</strong> {user.user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.user.email}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Loading user data...</p>
            )}
          </div>

          <SheetFooter className="mt-8">
            <Button
              variant="destructive"
              onClick={handleDeleteUser}>
              Delete Account
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
