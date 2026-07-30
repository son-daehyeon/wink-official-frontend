'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Title from '../_component/title';
import StudyCard from './_component/study-card';

import { Study } from '@/entities/program';
import { useStudiesQuery, useStudyCategoriesQuery } from '@/features/program';
import { cn } from '@/shared/lib/cn';
import Page from '@/shared/model/page';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';
import _ from 'lodash';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

interface ProgramStudyClientProps {
  initialCategory: string;
  initialQuery: string;
  initialPage: number;
}

export default function ProgramStudyClient({
  initialCategory,
  initialQuery,
  initialPage,
}: ProgramStudyClientProps) {
  const [category, setCategory] = useQueryState(
    'category',
    parseAsString.withDefault(initialCategory),
  );
  const [query, setQuery] = useQueryState('query', parseAsString.withDefault(initialQuery));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(initialPage));
  const [searchValue, setSearchValue] = useState(query);
  const [studyPages, setStudyPages] = useState<Record<number, Page<Study>>>({});
  const isFirstCategoryRender = useRef(true);

  const { data: categoriesData } = useStudyCategoriesQuery();
  const { data, isFetching } = useStudiesQuery(category, page, query);

  const categories = useMemo(
    () => ['전체', ...(categoriesData?.categories ?? [])],
    [categoriesData?.categories],
  );

  const studies = useMemo(() => {
    const pages = Object.entries(studyPages)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, page]) => page);

    if (pages.length === 0) return undefined;

    return {
      page: pages[pages.length - 1].page,
      content: pages.flatMap((page) => page.content),
    } satisfies Page<Study>;
  }, [studyPages]);

  useEffect(() => {
    if (searchValue === query) return;

    const debounce = _.debounce((nextQuery: string) => {
      setStudyPages({});
      void setPage(0);
      void setQuery(nextQuery);
    }, 500);

    debounce(searchValue);

    return () => debounce.cancel();
  }, [query, searchValue, setPage, setQuery]);

  useEffect(() => {
    if (isFirstCategoryRender.current) {
      isFirstCategoryRender.current = false;
      return;
    }

    setStudyPages({});
    void setPage(0);
  }, [category, setPage]);

  useEffect(() => {
    if (data?.studies) {
      setStudyPages((prev) => ({
        ...prev,
        [page]: data.studies,
      }));
    }
  }, [data?.studies, page]);

  return (
    <>
      <Title title="WINK, 우리들의 파도" subtitle="나날이 성장해 가는 우리" />

      <div className="flex flex-col sm:flex-row gap-2 w-[300px] sm:w-full sm:max-w-[900px]">
        <Input
          placeholder="검색어를 입력해주세요."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full"
        />

        <Select
          value={category}
          onValueChange={(value) => {
            setStudyPages({});
            void setPage(0);
            void setCategory(value);
          }}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-6 sm:space-y-4 w-full items-center">
        {isFetching && !studies ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn(
                'w-[300px] sm:w-full sm:max-w-[900px] h-[250px] sm:h-[150px] rounded-xl',
                !isFetching && 'hidden',
              )}
            />
          ))
        ) : studies && studies.content.length > 0 ? (
          studies.content.map((study) => <StudyCard key={study.id} {...study} />)
        ) : (
          <p className="text-neutral-500">검색 결과가 없습니다.</p>
        )}
      </div>

      {studies && studies.page.totalPages - 1 > page && (
        <Button variant="outline" disabled={isFetching} onClick={() => setPage(page + 1)}>
          더보기
        </Button>
      )}
    </>
  );
}
