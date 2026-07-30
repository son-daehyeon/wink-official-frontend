import { ReactNode } from 'react';

import { AppShell } from '../ui/app-shell';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
