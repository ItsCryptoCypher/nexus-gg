"use client";

import { useState, type ReactNode } from "react";

const tabs = [
  { id: "all", label: "All" },
  { id: "nexus", label: "Nexus Friends" },
  { id: "platform", label: "Platform Contacts" },
] as const;

export type FriendsTabId = (typeof tabs)[number]["id"];

type FriendsTabsProps = {
  children: (activeTab: FriendsTabId) => ReactNode;
};

export function FriendsTabs({ children }: FriendsTabsProps) {
  const [activeTab, setActiveTab] = useState<FriendsTabId>("all");

  return (
    <>
      <div className="mb-6 inline-flex rounded-full border border-border-subtle bg-surface p-1">
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent text-white shadow-[0_0_16px_rgba(124,58,237,0.35)]"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {children(activeTab)}
    </>
  );
}
