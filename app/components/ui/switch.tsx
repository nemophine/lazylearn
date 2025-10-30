"use client";

import * as React from "react";

import { cn } from "./utils";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked,
    );
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const toggle = () => {
      if (disabled) return;
      const next = !isChecked;
      if (!isControlled) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-[1.15rem] w-9 shrink-0 items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
          isChecked ? "bg-primary" : "bg-switch-background",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
            isChecked ? "translate-x-[calc(100%-2px)]" : "translate-x-[2px]",
          )}
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";
