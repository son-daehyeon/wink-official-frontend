'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import GeneralSetting from './ui/layout/general-setting';
import LoginSetting from './ui/layout/login-setting';
import DeleteApplicationModal from './ui/modal/delete-application';
import UpdateApplicationModal from './ui/modal/update-application';

import { useApplicationQuery } from '@/features/application';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { PageLoading } from '@/shared/ui/page-loading';
import { Separator } from '@/shared/ui/separator';
import { Pen, Trash2 } from 'lucide-react';

interface ApplicationDetailClientProps {
  id: string;
}

export default function ApplicationDetailClient({ id }: ApplicationDetailClientProps) {
  const router = useRouter();
  const { data, isPending } = useApplicationQuery(id);
  const application = data?.application;
  const [updateApplicationModalOpen, setUpdateApplicationModalOpen] = useState(false);
  const [deleteApplicationModalOpen, setDeleteApplicationModalOpen] = useState(false);

  useEffect(() => {
    if (application && !application.secret) {
      router.replace('/application');
    }
  }, [application, router]);

  if (isPending || !application) return <PageLoading />;

  return (
    <>
      <div className="flex flex-col space-y-8 p-12">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Avatar className="w-20 h-20 rounded">
              <AvatarImage src={application.img} alt="avatar" />
              <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-2xl sm:text-3xl font-bold">{application.name}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="wink" onClick={() => setUpdateApplicationModalOpen(true)}>
              <Pen />
              수정
            </Button>
            <Button variant="destructive" onClick={() => setDeleteApplicationModalOpen(true)}>
              <Trash2 />
              삭제
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col space-y-12 sm:px-8">
          <GeneralSetting application={application} />
          <LoginSetting application={application} />
        </div>
      </div>

      <UpdateApplicationModal
        open={updateApplicationModalOpen}
        setOpen={setUpdateApplicationModalOpen}
        application={application}
      />

      <DeleteApplicationModal
        open={deleteApplicationModalOpen}
        setOpen={setDeleteApplicationModalOpen}
        application={application}
        callback={() => router.replace('/application')}
      />
    </>
  );
}
