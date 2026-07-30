import { ReactNode } from 'react';

interface PaddedProgramLayoutProps {
  children: ReactNode;
}

export default function PaddedProgramLayout({ children }: PaddedProgramLayoutProps) {
  return (
    <div className="flex flex-col items-center space-y-10 px-6 pt-20 sm:pt-28">{children}</div>
  );
}
