"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "./utils";

type TooltipSide = "top" | "bottom" | "left" | "right";

type TimeoutHandle = ReturnType<typeof setTimeout>;

interface TooltipContextValue {
  open: boolean;
  show: () => void;
  hide: () => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export interface TooltipProviderProps {
  children: React.ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>;
}

export interface TooltipProps {
  children: React.ReactNode;
  delayDuration?: number;
}

export function Tooltip({ children, delayDuration = 150 }: TooltipProps) {
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const timeoutRef = React.useRef<TimeoutHandle | null>(null);
  const [open, setOpen] = React.useState(false);

  const show = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), delayDuration);
  }, [delayDuration]);

  const hide = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setOpen(false);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      open,
      show,
      hide,
      triggerRef,
    }),
    [open, show, hide],
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
}

export interface TooltipTriggerProps {
  asChild?: boolean;
  children: React.ReactElement;
}

export function TooltipTrigger({ asChild, children }: TooltipTriggerProps) {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("TooltipTrigger must be used within <Tooltip>");
  }

  const { show, hide, triggerRef } = context;

  const assignRef = (node: HTMLElement | null, childRef?: React.Ref<HTMLElement>) => {
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
      throw new Error("TooltipTrigger with asChild expects a single React element.");
    }
    const child = React.Children.only(children) as React.ReactElement;
    const mergedProps = {
      ...child.props,
      ref: (node: HTMLElement | null) => assignRef(node, child.ref as React.Ref<HTMLElement> | undefined),
      onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
        child.props.onMouseEnter?.(event);
        if (!event.defaultPrevented) show();
      },
      onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
        child.props.onMouseLeave?.(event);
        if (!event.defaultPrevented) hide();
      },
      onFocus: (event: React.FocusEvent<HTMLElement>) => {
        child.props.onFocus?.(event);
        if (!event.defaultPrevented) show();
      },
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        child.props.onBlur?.(event);
        if (!event.defaultPrevented) hide();
      },
      "aria-describedby": child.props["aria-describedby"],
    };
    return React.cloneElement(child, mergedProps);
  }

  return (
    <button
      type="button"
      ref={(node) => assignRef(node)}
      onMouseEnter={() => show()}
      onMouseLeave={() => hide()}
      onFocus={() => show()}
      onBlur={() => hide()}
      aria-describedby={undefined}
      className="inline-flex items-center justify-center"
    >
      {children}
    </button>
  );
}

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: TooltipSide;
}

export function TooltipContent({
  className,
  side = "top",
  children,
  ...props
}: TooltipContentProps) {
  const context = React.useContext(TooltipContext);
  const [position, setPosition] = React.useState<{ top: number; left: number }>(
    { top: 0, left: 0 },
  );
  const [id] = React.useState(() => `tooltip-${Math.random().toString(36).slice(2)}`);

  if (!context) {
    throw new Error("TooltipContent must be used within <Tooltip>");
  }

  const { open, triggerRef, hide } = context;

  React.useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      const offset = 10;
      let top = rect.bottom + scrollY + offset;
      let left = rect.left + scrollX + rect.width / 2;

      if (side === "top") {
        top = rect.top + scrollY - offset;
      } else if (side === "left") {
        top = rect.top + scrollY + rect.height / 2;
        left = rect.left + scrollX - offset;
      } else if (side === "right") {
        top = rect.top + scrollY + rect.height / 2;
        left = rect.right + scrollX + offset;
      }

      setPosition({ top, left });
    }
  }, [open, triggerRef, side]);

  React.useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;
    node.setAttribute("aria-describedby", open ? id : "");
    if (!open) {
      node.removeAttribute("aria-describedby");
    }
  }, [open, triggerRef, id]);

  React.useEffect(() => {
    if (!open) return;
    const handleScroll = () => hide();
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [open, hide]);

  if (typeof document === "undefined" || !open) {
    return null;
  }

  const transform = (() => {
    switch (side) {
      case "top":
        return "translate(-50%, -100%)";
      case "left":
        return "translate(-100%, -50%)";
      case "right":
        return "translate(0, -50%)";
      case "bottom":
      default:
        return "translate(-50%, 0)";
    }
  })();

  return createPortal(
    <div
      id={id}
      role="tooltip"
      className={cn(
        "pointer-events-none z-50 max-w-xs rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-lg",
        className,
      )}
      style={{
        top: position.top,
        left: position.left,
        position: "absolute",
        transform,
      }}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}
