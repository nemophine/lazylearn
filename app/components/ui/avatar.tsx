"use client";

import * as React from "react";

import { cn } from "./utils";

interface AvatarContextValue {
  showFallback: boolean;
  setShowFallback: (value: boolean) => void;
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function Avatar({ className, children, ...props }: AvatarProps) {
  const [showFallback, setShowFallback] = React.useState(true);

  const contextValue = React.useMemo(
    () => ({ showFallback, setShowFallback }),
    [showFallback],
  );

  return (
    <AvatarContext.Provider value={contextValue}>
      <div
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted text-sm font-medium",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  );
}

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function AvatarImage({
  className,
  src,
  alt,
  ...props
}: AvatarImageProps) {
  const context = React.useContext(AvatarContext);
  const ref = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (!context) return;
    if (!src) {
      context.setShowFallback(true);
      return;
    }
    const image = ref.current;
    if (!image) return;
    if (image.complete && image.naturalWidth > 0) {
      context.setShowFallback(false);
    }
  }, [context, src]);

  if (!context) {
    return null;
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      onLoad={() => context.setShowFallback(false)}
      onError={() => context.setShowFallback(true)}
      className={cn(
        "h-full w-full object-cover transition-opacity",
        context.showFallback ? "opacity-0" : "opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps) {
  const context = React.useContext(AvatarContext);

  if (!context || !context.showFallback) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
