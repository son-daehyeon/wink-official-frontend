import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function openExternalUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  } catch {
    // Ignore malformed links supplied by stale or externally managed data.
  }
}

export function nowDate() {
  return new Date();
}

export function toDate(date: Date | string): Date {
  if (date instanceof Date) return date;
  return new Date(new Date(date).getTime() + 9 * 60 * 60 * 1000);
}

export function formatDateApi(date: Date | string) {
  const d = toDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date | string, showDayOfWeek = false) {
  const d = toDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];

  return `${year}년 ${month}월 ${day}일${showDayOfWeek ? ` (${dayOfWeek})` : ''}`;
}

export function formatTime(date: Date | string) {
  const d = toDate(date);
  let hour = d.getHours();
  const minute = String(d.getMinutes()).padStart(2, '0');
  const ampm = hour >= 12 ? '오후' : '오전';

  hour = hour % 12;
  hour = hour || 12;

  const hourStr = String(hour).padStart(2, '0');

  return `${ampm} ${hourStr}시 ${minute}분`;
}

export function formatDateApiWithTime(date: Date | string) {
  const d = toDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function formatDateWithTime(date: Date | string, showDayOfWeek = false) {
  const d = toDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');

  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];

  return `${year}년 ${month}월 ${day}일${showDayOfWeek ? ` (${dayOfWeek})` : ''} ${hour}시 ${minute}분`;
}

export async function uploadS3(
  files: FileList,
  getUrl: () => Promise<{ url: string }>,
): Promise<string[]> {
  return Promise.all(
    Array.from(files).map(async (file) => {
      const { url } = await getUrl();

      const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'x-amz-acl': 'public-read',
        },
      });

      if (!response.ok) {
        throw new Error(`사진 업로드에 실패했습니다. (${response.status})`);
      }

      return url.replace(/\?.+$/, '');
    }),
  );
}
