import { useCallback } from 'react';

import { History } from '@/entities/program';
import { useDeleteHistoryMutation } from '@/features/program';
import { formatDate } from '@/shared/lib/cn';
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

interface DeleteHistoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  history?: History;
  callback: (id: string) => void;
}

export default function DeleteHistoryModal({
  open,
  setOpen,
  history,
  callback,
}: DeleteHistoryModalProps) {
  const [isApi, startApi] = useApiWithToast();
  const deleteHistory = useDeleteHistoryMutation();

  const onSubmit = useCallback(
    (history: History) => {
      startApi(
        async () => {
          await deleteHistory.mutateAsync(history.id);
          callback(history!.id);
        },
        {
          loading: '연혁을 삭제하고 있습니다',
          success: '연혁을 삭제했습니다.',
          finally: () => setOpen(false),
        },
      );
    },
    [callback, deleteHistory, setOpen, startApi],
  );

  if (!history) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>연혁 삭제</DialogTitle>
          <DialogDescription>연혁을 삭제합니다.</DialogDescription>
        </DialogHeader>

        <Table>
          <TableBody>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableCell>{history.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableCell>{formatDate(history.date)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Button
          variant="wink"
          type="submit"
          disabled={isApi}
          className="w-full"
          onClick={() => onSubmit(history)}
        >
          연혁 삭제
        </Button>
      </DialogContent>
    </Dialog>
  );
}
