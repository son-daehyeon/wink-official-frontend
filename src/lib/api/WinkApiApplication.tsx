'use client';

import { useEffect } from 'react';

import { WinkApi } from '@/lib/api/WinkApi';
import { useGlobalState } from '@/lib/store/global.store';

interface WinkApiApplicationProps {
  children: React.ReactNode;
}

export const WinkApiApplication: React.FC<WinkApiApplicationProps> = ({
  children,
}: WinkApiApplicationProps) => {
  const { loaded } = useGlobalState();

  useEffect(() => {
    WinkApi.init();
  }, []);

  if (!loaded) {
    return <Loading />;
  }

  return <>{children}</>;
};
