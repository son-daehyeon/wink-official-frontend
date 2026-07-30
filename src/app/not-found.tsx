'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AppShell } from './ui/app-shell';

import { cn } from '@/shared/lib/cn';

const FOOTERLESS_PATH_PREFIXES = ['/auth', '/recruit/form', '/admin'];

export default function NotFound() {
  const pathname = usePathname();
  const showFooter = !FOOTERLESS_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return (
    <AppShell showFooter={showFooter}>
      <div
        className={cn(
          'flex flex-col items-center justify-center space-y-4',
          showFooter ? 'min-h-[calc(100dvh-274px-56px)]' : 'min-h-[calc(100dvh-56px)]',
        )}
      >
        <h1 className="text-3xl font-bold md:text-4xl">페이지를 찾을 수 없습니다</h1>
        <p className="text-sm text-neutral-600 md:text-base">
          요청하신 페이지가 존재하지 않습니다.
        </p>
        <Link
          href="/"
          className="rounded-md bg-wink-500 px-4 py-2 text-sm font-medium text-white hover:bg-wink-600"
        >
          홈으로 가기
        </Link>
      </div>
    </AppShell>
  );
}
