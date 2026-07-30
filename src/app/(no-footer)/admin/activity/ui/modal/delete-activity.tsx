import { useCallback } from 'react';

import { Activity } from '@/entities/program';
import { deleteAdminActivity } from '@/features/admin';
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

interface DeleteActivityModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activity?: Activity;
  callback: (id: string) => void;
}

export default function DeleteActivityModal({
  open,
  setOpen,
  activity,
  callback,
}: DeleteActivityModalProps) {
  const [isApi, startApi] = useApiWithToast();

  const onSubmit = useCallback(
    async (activity: Activity) =>
      startApi(
        async () => {
          await deleteAdminActivity(activity!.id);
          callback(activity.id);
        },
        {
          loading: '활동을 삭제하고 있습니다.',
          success: '활동을 삭제했습니다.',
          finally: () => setOpen(false),
        },
      ),
    [callback, setOpen, startApi],
  );

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>활동 삭제</DialogTitle>
          <DialogDescription>활동를 삭제합니다.</DialogDescription>
        </DialogHeader>

        <Table>
          <TableBody>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableCell>{activity.title}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Button
          variant="wink"
          type="submit"
          disabled={isApi}
          className="w-full"
          onClick={() => onSubmit(activity)}
        >
          활동 삭제
        </Button>
      </DialogContent>
    </Dialog>
  );
}
