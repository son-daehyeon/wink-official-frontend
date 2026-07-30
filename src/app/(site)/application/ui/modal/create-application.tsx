import { useCallback, useEffect } from 'react';

import { CreateApplicationRequest, CreateApplicationRequestSchema } from '@/entities/application';
import { useCreateApplicationMutation } from '@/features/application';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface CreateApplicationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateApplicationModal({ open, setOpen }: CreateApplicationModalProps) {
  const [isApi, startApi] = useApiWithToast();
  const createApplication = useCreateApplicationMutation();

  const form = useForm<CreateApplicationRequest>({
    resolver: zodResolver(CreateApplicationRequestSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = useCallback(
    (values: CreateApplicationRequest) => {
      startApi(() => createApplication.mutateAsync(values), {
        loading: '애플리케이션을 추가하고 있습니다.',
        success: '애플리케이션을 추가했습니다.',
        finally: () => {
          form.reset();
          setOpen(false);
        },
      });
    },
    [createApplication, form, setOpen, startApi],
  );

  useEffect(() => {
    if (!open) form.reset();
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>애플리케이션 추가</DialogTitle>
          <DialogDescription>애플리케이션을 추가합니다.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>애플리케이션 이름</FormLabel>
                  <FormControl>
                    <Input placeholder="애플리케이션 이름을 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant="wink" type="submit" disabled={isApi} className="w-full">
              애플리케이션 추가
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
