import { ReactNode } from 'react';

import { Footer, Header } from '@/widgets/layout';

interface AppShellProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function AppShell({ children, showFooter = true }: AppShellProps) {
  return (
    <>
      <Header />
      <main className={showFooter ? 'min-h-[calc(100dvh-274px)] pt-14' : 'min-h-[100dvh] pt-14'}>
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}
