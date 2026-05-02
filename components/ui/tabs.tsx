"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TabsCtx = {
  value: string;
  onValueChange: (v: string) => void;
};

const TabsContext = React.createContext<TabsCtx | null>(null);

function useTabsContext(name: string) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error(`${name} must be used within <Tabs />`);
  return ctx;
}

export function Tabs({
  value,
  onValueChange,
  className,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const store = React.useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange],
  );
  return (
    <TabsContext.Provider value={store}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-11 flex-wrap items-center justify-start gap-1 rounded-lg bg-muted/60 p-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  disabled,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { value: active, onValueChange } = useTabsContext("TabsTrigger");
  const selected = active === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      data-state={selected ? "active" : "inactive"}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        selected && "bg-background text-foreground shadow-sm",
        className,
      )}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { value: active } = useTabsContext("TabsContent");
  if (active !== value) return null;

  return (
    <div role="tabpanel" className={cn("mt-6 outline-none", className)}>
      {children}
    </div>
  );
}
