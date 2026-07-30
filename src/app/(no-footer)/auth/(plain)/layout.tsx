import { ReactNode } from 'react';

import AuthShell from '../auth-shell';

interface PlainAuthLayoutProps {
  children: ReactNode;
}

export default function PlainAuthLayout({ children }: PlainAuthLayoutProps) {
  return <AuthShell showBranding={false}>{children}</AuthShell>;
}
