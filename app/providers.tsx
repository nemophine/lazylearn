'use client';

import type { ReactNode } from 'react';

import { FocusModeProvider } from './state/focus-mode-context';

export function Providers({ children }: { children: ReactNode }) {
  return <FocusModeProvider>{children}</FocusModeProvider>;
}
