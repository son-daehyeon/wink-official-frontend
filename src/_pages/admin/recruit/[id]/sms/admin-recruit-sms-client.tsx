'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { UpdateRecruitSmsRequest, UpdateRecruitSmsRequestSchema } from '@/entities/recruit';
import { useSendRecruitTestSmsMutation, useUpdateRecruitSmsMutation } from '@/features/admin';
import { adminQueryOptions } from '@/features/admin';
import { useUserStore } from '@/features/user';
import { browserApi } from '@/shared/api/client';
import { useApiWithToast } from '@/shared/lib/hooks/use-api';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/shared/ui/table';
import { Textarea } from '@/shared/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Path, UseFormReturn, useForm } from 'react-hook-form';

interface AdminRecruitSmsClientProps {
  recruitId: string;
}

export default function AdminRecruitSmsClient({ recruitId }: AdminRecruitSmsClientProps) {
  const [isApi, startApi] = useApiWithToast();
  const recruitSmsQuery = useQuery(adminQueryOptions.recruitSms(browserApi, recruitId));
  const updateRecruitSms = useUpdateRecruitSmsMutation(recruitId);

  const form = useForm<UpdateRecruitSmsRequest>({
    resolver: zodResolver(UpdateRecruitSmsRequestSchema),
    defaultValues: {
      paperFail: '',
      paperPass: '',
      finalFail: '',
      finalPass: '',
    },
  });

  const onSubmit = useCallback(
    (values: UpdateRecruitSmsRequest) => {
      startApi(() => updateRecruitSms.mutateAsync(values), {
        loading: '안내 문자를 수정하고 있습니다.',
        success: '안내 문자를 수정했습니다.',
      });
    },
    [startApi, updateRecruitSms],
  );

  useEffect(() => {
    if (recruitSmsQuery.data?.recruitSms) {
      form.reset(recruitSmsQuery.data.recruitSms);
    }
  }, [form, recruitSmsQuery.data?.recruitSms]);

  if (recruitSmsQuery.isPending) return null;

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold">안내 문자 수정</h1>

      <Table className="w-fit">
        <TableBody>
          <TableRow>
            <TableHead className="w-[110px]">이름</TableHead>
            <TableCell className="w-[110px]">{'{NAME}'}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="w-[110px]">학번</TableHead>
            <TableCell className="w-[110px]">{'{STUDENT_ID}'}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="w-[110px]">학부(과)</TableHead>
            <TableCell className="w-[110px]">{'{DEPARTMENT}'}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="w-[110px]">이메일</TableHead>
            <TableCell className="w-[110px]">{'{EMAIL}'}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="w-[110px]">전화번호</TableHead>
            <TableCell className="w-[110px]">{'{PHONE_NUMBER}'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
          <AutoResizeTextarea
            recruitId={recruitId}
            form={form}
            name="서류 탈락"
            raw="paperFail"
            field="PAPER_FAIL"
          />

          <AutoResizeTextarea
            recruitId={recruitId}
            form={form}
            name="서류 합격"
            raw="paperPass"
            field="PAPER_PASS"
          />

          <AutoResizeTextarea
            recruitId={recruitId}
            form={form}
            name="최종 탈락"
            raw="finalFail"
            field="FINAL_FAIL"
          />

          <AutoResizeTextarea
            recruitId={recruitId}
            form={form}
            name="최종 합격"
            raw="finalPass"
            field="FINAL_PASS"
            label="예시: https://wink.kookmin.ac.kr/auth/register#token={TOKEN}"
          />

          <Button variant="wink" type="submit" disabled={isApi} className="w-fit px-10 self-center">
            안내 문자 수정
          </Button>
        </form>
      </Form>
    </div>
  );
}

interface AutoResizeTextareaProps {
  recruitId: string;
  form: UseFormReturn<UpdateRecruitSmsRequest>;
  name: string;
  raw: Path<UpdateRecruitSmsRequest>;
  label?: string;
  field: 'PAPER_FAIL' | 'PAPER_PASS' | 'FINAL_FAIL' | 'FINAL_PASS';
}

function AutoResizeTextarea({ recruitId, form, name, raw, label, field }: AutoResizeTextareaProps) {
  const [isApi, startApi] = useApiWithToast();
  const sendTestSms = useSendRecruitTestSmsMutation(recruitId);

  const { user } = useUserStore();

  const ref = useRef<HTMLTextAreaElement | null>(null);

  const toByteLength = useCallback((str: string) => {
    const encoder = new TextEncoder();
    const encodedStr = encoder.encode(str);
    return encodedStr.length;
  }, []);

  const value = form.watch(raw);

  useEffect(() => {
    const textarea = ref.current;
    if (textarea) {
      textarea.style.height = '100px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="flex flex-col space-y-1">
      <FormField
        control={form.control}
        name={raw}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {name} ({toByteLength(form.getValues(raw)).toLocaleString()}/2,000 바이트)
            </FormLabel>
            <FormControl>
              <Textarea
                className="overflow-hidden resize-none min-h-[100px]"
                placeholder={`${name} 문구를 입력해주세요.`}
                {...field}
                ref={(e) => {
                  field.ref(e);
                  ref.current = e;
                }}
              />
            </FormControl>
            <FormMessage />
            {label && <FormLabel>{label}</FormLabel>}
          </FormItem>
        )}
      />
      <Button
        variant="outline"
        className="w-fit"
        disabled={isApi}
        onClick={(e) => {
          e.preventDefault();

          startApi(
            async () => {
              await sendTestSms.mutateAsync({
                field,
                phoneNumber: user!.phoneNumber,
              });
            },
            {
              loading: '테스트 문자를 전송하고 있습니다.',
              success: '테스트 문자를 전송했습니다.',
            },
          );
        }}
      >
        테스트 문자 전송
      </Button>
    </div>
  );
}
