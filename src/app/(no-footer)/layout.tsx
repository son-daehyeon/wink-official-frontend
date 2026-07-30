import { ReactNode } from 'react';

import { AppShell } from '../ui/app-shell';

interface NoFooterLayoutProps {
  children: ReactNode;
}

export default function NoFooterLayout({ children }: NoFooterLayoutProps) {
  return <AppShell showFooter={false}>{children}</AppShell>;
}
