import { ReactNode } from 'react';

import AuthShell from '../auth-shell';

interface BrandedAuthLayoutProps {
  children: ReactNode;
}

export default function BrandedAuthLayout({ children }: BrandedAuthLayoutProps) {
  return <AuthShell>{children}</AuthShell>;
}
