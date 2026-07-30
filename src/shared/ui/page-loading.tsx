import { cn } from '@/shared/lib/cn';

interface PageLoadingProps {
  className?: string;
}

export function PageLoading({ className }: PageLoadingProps) {
  return (
    <div className={cn('flex min-h-[50dvh] w-full items-center justify-center', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-wink-600 border-e-white" />
    </div>
  );
}
