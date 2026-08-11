import { useCallback, useEffect } from 'react';

import Image from 'next/image';

import { CreateProjectRequest, CreateProjectRequestSchema } from '@/entities/program';
import { Project } from '@/entities/program';
import { getProgramUploadUrl, useUpdateProjectMutation } from '@/features/program';
import { uploadS3 } from '@/shared/lib/cn';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import { Button } from '@/shared/ui/button';
import { DialogHeader } from '@/shared/ui/dialog';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface UpdateProjectModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  project?: Project;
  callback: (project: Project) => void;
  isAdmin: boolean;
}

export default function UpdateProjectModal({
  open,
  setOpen,
  project,
  callback,
  isAdmin,
}: UpdateProjectModalProps) {
  const [isUploading, startUpload] = useApiWithToast();
  const [isApi, startApi] = useApiWithToast();
  const updateProject = useUpdateProjectMutation(isAdmin);

  const form = useForm<CreateProjectRequest>({
    resolver: zodResolver(CreateProjectRequestSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      image: '',
      link: '',
    },
  });

  const onSubmit = useCallback(
    (values: CreateProjectRequest) => {
      startApi(
        async () => {
          const { project: _project } = await updateProject.mutateAsync({
            id: project!.id,
            body: values,
          });
          callback(_project);
        },
        {
          loading: '프로젝트를 수정하고 있습니다',
          success: '프로젝트를 수정했습니다.',
          finally: () => {
            setOpen(false);
            form.reset();
          },
        },
      );
    },
    [callback, form, project, setOpen, startApi, updateProject],
  );

  useEffect(() => {
    if (!project) return;
    form.reset(project);
  }, [form, project]);

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로젝트 수정</DialogTitle>
          <DialogDescription>프로젝트를 수정합니다.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="제목을 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Input placeholder="설명을 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>프로젝트 주소</FormLabel>
                  <FormControl>
                    <Input placeholder="프로젝트 주소를 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>사진</FormLabel>
                  <FormControl>
                    <>
                      <div className="relative sm:min-w-[375px] h-[150px] cursor-pointer">
                        {field.value ? (
                          <>
                            <Image
                              src={field.value}
                              alt={field.value}
                              width={375}
                              height={200}
                              className="w-full h-full rounded-md object-cover"
                            />
                            <div
                              className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex rounded-md items-center justify-center"
                              onClick={() => document.getElementById('image-upload')?.click()}
                            >
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                          </>
                        ) : (
                          <div
                            className="flex items-center justify-center w-full h-full rounded-md border text-neutral-500 hover:text-black"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            <Upload className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          startUpload(
                            async () =>
                              field.onChange(
                                (await uploadS3(e.target.files!, getProgramUploadUrl))[0],
                              ),
                            {
                              loading: '이미지를 업로드하고 있습니다.',
                              success: '이미지를 업로드했습니다.',
                            },
                          );
                        }}
                        disabled={isUploading}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant="wink" type="submit" disabled={isUploading || isApi} className="w-full">
              프로젝트 수정
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
