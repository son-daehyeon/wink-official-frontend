import { useCallback } from 'react';

import { Application } from '@/entities/application';
import { useDeleteApplicationMutation } from '@/features/application';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/shared/ui/table';

interface DeleteApplicationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  application: Application;
  callback: () => void;
}

export default function DeleteApplicationModal({
  open,
  setOpen,
  application,
  callback,
}: DeleteApplicationModalProps) {
  const [isApi, startApi] = useApiWithToast();
  const deleteApplication = useDeleteApplicationMutation();

  const onSubmit = useCallback(
    (application: Application) => {
      startApi(
        async () => {
          await deleteApplication.mutateAsync(application.id);
          callback();
        },
        {
          loading: '애플리케이션을 삭제하고 있습니다.',
          success: '애플리케이션을 삭제했습니다.',
          finally: () => setOpen(false),
        },
      );
    },
    [callback, deleteApplication, setOpen, startApi],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>애플리케이션 삭제</DialogTitle>
          <DialogDescription>애플리케이션을 삭제합니다.</DialogDescription>
        </DialogHeader>

        <Table>
          <TableBody>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableCell>{application.name}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Button
          variant="wink"
          disabled={isApi}
          className="w-full"
          onClick={() => onSubmit(application)}
        >
          애플리케이션 삭제
        </Button>
      </DialogContent>
    </Dialog>
  );
}
