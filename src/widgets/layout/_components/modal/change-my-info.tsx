import { useEffect } from 'react';

import { UpdateMyInfoRequest, UpdateMyInfoRequestSchema } from '@/entities/user';
import { useUserStore } from '@/features/user';
import {
  useDeleteMyAvatarMutation,
  useUpdateMyInfoMutation,
  useUploadMyAvatarMutation,
} from '@/features/user';
import { uploadS3 } from '@/shared/lib/cn';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
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
import { Trash2, Upload, UserIcon } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

interface ChangeMyInfoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ChangeMyInfoModal({ open, setOpen }: ChangeMyInfoModalProps) {
  const { user, setUser } = useUserStore();

  const [isUploading, startUpload] = useApiWithToast();
  const [isApi, startApi] = useApiWithToast();
  const updateMyInfo = useUpdateMyInfoMutation();
  const uploadMyAvatar = useUploadMyAvatarMutation();
  const deleteMyAvatar = useDeleteMyAvatarMutation();

  const form = useForm<UpdateMyInfoRequest>({
    resolver: zodResolver(UpdateMyInfoRequestSchema),
    mode: 'onChange',
    defaultValues: {
      avatar: '',
      description: '',
      github: '',
      instagram: '',
      blog: '',
    },
  });

  const onSubmit = (values: UpdateMyInfoRequest) =>
    startApi(
      async () => {
        const { user } = await updateMyInfo.mutateAsync({
          avatar: values.avatar || undefined,
          description: values.description || undefined,
          github: values.github || undefined,
          instagram: values.instagram || undefined,
          blog: values.blog || undefined,
        });

        setUser(user);
      },
      {
        loading: '내 정보를 수정하고 있습니다.',
        success: '내 정보를 수정했습니다.',
        finally: () => setOpen(false),
      },
    );

  const avatar = useWatch({
    control: form.control,
    name: 'avatar',
  });

  useEffect(() => {
    form.reset({
      avatar: user?.avatar || '',
      description: user?.description || '',
      github: user?.social?.github || '',
      instagram: user?.social?.instagram || '',
      blog: user?.social?.blog || '',
    });
  }, [form, user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>내 정보 수정</DialogTitle>
          <DialogDescription>내 정보를 수정합니다.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-4">
            <div
              className="relative w-24 h-24 mx-auto cursor-pointer"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  document.getElementById('avatar-upload')?.click();
                }
              }}
            >
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar} alt="avatar" />
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-full flex items-center justify-center"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <Upload className="w-8 h-8 text-white" />
              </div>
              {user?.avatar && (
                <div
                  className="absolute bottom-0 right-0 p-1 bg-black/50 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (isUploading) return;

                    startApi(
                      async () => {
                        const { user } = await deleteMyAvatar.mutateAsync();
                        setUser(user);
                      },
                      {
                        loading: '프로필 이미지를 삭제하고 있습니다.',
                        success: '프로필 이미지를 삭제했습니다',
                      },
                    );
                  }}
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={async (e) =>
                startUpload(
                  async () =>
                    form.setValue(
                      'avatar',
                      (await uploadS3(e.target.files!, () => uploadMyAvatar.mutateAsync()))[0],
                    ),
                  {
                    loading: '이미지를 업로드하고 있습니다.',
                    success: '이미지를 업로드했습니다.',
                  },
                )
              }
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>한 줄 소개</FormLabel>
                  <FormControl>
                    <Input placeholder="한 줄 소개를 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Github</FormLabel>
                  <FormControl>
                    <Input placeholder="Github 아이디를 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="Instagram 아이디를 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="blog"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>블로그</FormLabel>
                  <FormControl>
                    <Input placeholder="블로그 주소를 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant="wink" type="submit" disabled={isApi} className="w-full">
              내 정보 수정
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
