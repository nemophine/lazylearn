"use client";

import * as React from "react";

import { cn } from "./utils";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  className,
  defaultValue,
  value: valueProp,
  onValueChange,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(
    valueProp ?? defaultValue ?? "",
  );

  const value = valueProp ?? internalValue;

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [onValueChange, valueProp],
  );

  const contextValue = React.useMemo(
    () => ({ value, setValue }),
    [value, setValue],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center gap-1 rounded-xl bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  className,
  value,
  children,
  ...props
}: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within <Tabs>");
  }

  const isActive = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => context.setValue(value)}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        isActive
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  className,
  value,
  children,
  ...props
}: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within <Tabs>");
  }

  const isActive = context.value === value;

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn("flex-1", className)}
      {...props}
    >
      {isActive ? children : null}
    </div>
  );
}
