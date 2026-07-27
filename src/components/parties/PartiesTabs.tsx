"use client";

import { useState, type ReactNode } from "react";

const tabs = [
  { id: "home", label: "Home" },
  { id: "friends", label: "Friends" },
  { id: "public", label: "Public" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type PartiesTabsProps = {
  children: ReactNode;
};

export function PartiesTabs({ children }: PartiesTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("home");

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

      {activeTab === "home" ? (
        children
      ) : (
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-border-subtle bg-surface px-6 py-16 text-center">
          <div>
            <p className="text-base font-semibold text-foreground">
              {activeTab === "friends" ? "Friends" : "Public"} tab coming soon
            </p>
            <p className="mt-1 text-sm text-muted">
              For now, create and join game parties on the Home tab.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
