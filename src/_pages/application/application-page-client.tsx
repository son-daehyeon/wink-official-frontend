'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CreateApplicationModal from './_component/modal/create-application';

import { useApplicationsQuery } from '@/features/application';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { BookText, Plus } from 'lucide-react';

export default function ApplicationPageClient() {
  const router = useRouter();
  const { data, isPending } = useApplicationsQuery();
  const applications = data?.applications ?? [];
  const [createApplicationModalOpen, setCreateApplicationModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col space-y-8 p-12">
        <div className="flex justify-between items-end">
          <p className="text-2xl sm:text-3xl font-medium">내 애플리케이션</p>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => router.push('/application/manual')}>
              <BookText />
              가이드
            </Button>
            <Button variant="wink" onClick={() => setCreateApplicationModalOpen(true)}>
              <Plus />
              추가
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 sm:gap-4">
          {isPending ? (
            Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="w-52 h-52 rounded-xl" />
            ))
          ) : applications.length > 0 ? (
            applications.map((application) => (
              <button
                key={application.id}
                type="button"
                className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-xl text-left"
                onClick={() => router.push(`/application/${application.id}`)}
              >
                <Image
                  src={application.img}
                  alt={application.name}
                  width={208}
                  height={208}
                  quality={100}
                  unoptimized
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                />
                <span className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-all rounded-xl" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-white font-semibold max-w-48 truncate">
                  {application.name}
                </span>
              </button>
            ))
          ) : (
            <div className="flex justify-center w-full mt-10 sm:mt-20">
              <p className="text-neutral-500">애플리케이션이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      <CreateApplicationModal
        open={createApplicationModalOpen}
        setOpen={setCreateApplicationModalOpen}
      />
    </>
  );
}
