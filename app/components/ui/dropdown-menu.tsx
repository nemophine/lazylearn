"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "./utils";

type Align = "start" | "center" | "end";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const contextValue = React.useMemo(
    () => ({ open, setOpen, triggerRef }),
    [open],
  );

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactElement;
}

export function DropdownMenuTrigger({
  asChild,
  children,
}: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuTrigger must be used within <DropdownMenu>");
  }

  const { open, setOpen, triggerRef } = context;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    children.props.onClick?.(event);
    if (!event.defaultPrevented) {
      setOpen((prev) => !prev);
    }
  };

  const assignRef = (
    node: HTMLElement | null,
    childRef?: React.Ref<HTMLElement>,
  ) => {
    triggerRef.current = node;
    if (!childRef) return;
    if (typeof childRef === "function") {
      childRef(node);
    } else if (typeof childRef === "object") {
      (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  if (asChild) {
    if (!React.isValidElement(children)) {
      throw new Error(
        "DropdownMenuTrigger with asChild expects a single React element.",
      );
    }
    return React.cloneElement(children, {
      ...children.props,
      onClick: handleClick,
      ref: (node: HTMLElement | null) =>
        assignRef(node, children.ref as React.Ref<HTMLElement> | undefined),
      "aria-haspopup": "menu",
      "aria-expanded": open,
    });
  }

  return (
    <button
      type="button"
      ref={(node) => assignRef(node)}
      onClick={handleClick}
      aria-haspopup="menu"
      aria-expanded={open}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: Align;
}

export function DropdownMenuContent({
  className,
  align = "start",
  children,
  ...props
}: DropdownMenuContentProps) {
  const context = React.useContext(DropdownMenuContext);
  const [position, setPosition] = React.useState<{ top: number; left: number }>(
    { top: 0, left: 0 },
  );

  if (!context) {
    throw new Error("DropdownMenuContent must be used within <DropdownMenu>");
  }

  const { open, setOpen, triggerRef } = context;

  React.useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      const top = rect.bottom + scrollY + 6;
      let left = rect.left + scrollX;
      if (align === "center") {
        left = rect.left + rect.width / 2 + scrollX;
      } else if (align === "end") {
        left = rect.right + scrollX;
      }

      setPosition({ top, left });
    }
  }, [open, triggerRef, align]);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        event.target instanceof Node &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen, triggerRef]);

  if (typeof document === "undefined" || !open) {
    return null;
  }

  const alignmentClass =
    align === "center"
      ? "translate-x-[-50%]"
      : align === "end"
        ? "translate-x-[-100%]"
        : "";

  return createPortal(
    <div
      role="menu"
      className={cn(
        "z-50 min-w-[10rem] rounded-xl border border-border bg-background p-1.5 shadow-xl focus:outline-none",
        alignmentClass,
        className,
      )}
      style={{ position: "absolute", top: position.top, left: position.left }}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

export interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function DropdownMenuItem({
  className,
  inset,
  onClick,
  onSelect,
  children,
  ...props
}: DropdownMenuItemProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuItem must be used within <DropdownMenu>");
  }

  const { setOpen } = context;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    onSelect?.(event);
    if (!event.defaultPrevented) {
      setOpen(false);
    }
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground",
        inset ? "pl-6" : "",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
