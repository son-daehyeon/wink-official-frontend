import { ReactNode } from 'react';

interface ProgramActivityLayoutProps {
  children: ReactNode;
}

export default function ProgramActivityLayout({ children }: ProgramActivityLayoutProps) {
  return <div className="flex flex-col items-center space-y-10 pt-20 sm:pt-28">{children}</div>;
}
