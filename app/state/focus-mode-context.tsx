'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface FocusModeContextValue {
  isFocusMode: boolean;
  reason: string | null;
  enterFocusMode: (reason?: string) => void;
  exitFocusMode: () => void;
}

const FocusModeContext = createContext<FocusModeContextValue | undefined>(
  undefined,
);

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  const enterFocusMode = useCallback((nextReason?: string) => {
    setIsFocusMode(true);
    setReason(nextReason ?? null);
  }, []);

  const exitFocusMode = useCallback(() => {
    setIsFocusMode(false);
    setReason(null);
  }, []);

  const value = useMemo(
    () => ({
      isFocusMode,
      reason,
      enterFocusMode,
      exitFocusMode,
    }),
    [enterFocusMode, exitFocusMode, isFocusMode, reason],
  );

  return (
    <FocusModeContext.Provider value={value}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context;
}
