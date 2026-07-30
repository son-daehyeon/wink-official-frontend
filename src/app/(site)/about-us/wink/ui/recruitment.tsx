import Link from 'next/link';

import { ArrowRightIcon } from 'lucide-react';

export default function Recruitment() {
  return (
    <Link href="/recruit" className="flex items-center space-x-2 text-wink-500 font-semibold">
      지원하기 <ArrowRightIcon className="w-4 h-4" />
    </Link>
  );
}
