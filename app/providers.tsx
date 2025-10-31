'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import { FocusModeProvider } from './state/focus-mode-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <FocusModeProvider>{children}</FocusModeProvider>
    </SessionProvider>
  );
}
