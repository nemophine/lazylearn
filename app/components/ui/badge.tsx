'use client';

import * as React from "react";

import { cn } from "./utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-primary text-primary-foreground border-transparent hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/90",
  destructive:
    "bg-destructive text-white border-transparent hover:bg-destructive/90",
  outline: "text-foreground hover:bg-accent hover:text-accent-foreground",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
