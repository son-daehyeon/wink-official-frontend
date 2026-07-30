import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { useRegisterStore } from '@/features/auth';
import { RegisterRequest, RegisterRequestSchema } from '@/features/auth';
import { useRegisterMutation } from '@/features/auth';
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

interface RegisterModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  token: string;
}

export default function RegisterModal({ open, setOpen, token }: RegisterModalProps) {
  const router = useRouter();

  const { setConfetti } = useRegisterStore();

  const [isApi, startApi] = useApiWithToast();
  const register = useRegisterMutation();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    mode: 'onChange',
    defaultValues: {
      token,
      password: '',
    },
  });

  const onSubmit = useCallback(
    async (values: RegisterRequest) => {
      startApi(
        async () => {
          await register.mutateAsync(values);
          setConfetti(true);
          router.replace('/auth/login');
        },
        {
          loading: 'WINK에 가입하고 있습니다.',
          success: 'WINK에 가입되었습니다.',
        },
      );
    },
    [register, router, setConfetti, startApi],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>회원가입</DialogTitle>
          <DialogDescription>WINK 부원으로 가입합니다.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="비밀번호를 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant="wink" type="submit" disabled={isApi} className="w-full">
              가입하기
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
