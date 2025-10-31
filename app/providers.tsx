'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import { FocusModeProvider } from './state/focus-mode-context';
import { SidebarProvider } from './contexts/SidebarContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <FocusModeProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </FocusModeProvider>
    </SessionProvider>
  );
}
