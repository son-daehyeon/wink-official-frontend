'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import Wave from '../../about-us/wink/_component/wave';
import Title from '../_component/title';

import { useActivitiesQuery } from '@/features/program';
import { cn } from '@/shared/lib/cn';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';

export default function ProgramActivityClient() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedId, setSelectedId] = useState<string>();
  const { data, isLoading } = useActivitiesQuery();

  const activities = useMemo(
    () =>
      [...(data?.activities ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [data?.activities],
  );

  const selected = activities.find((activity) => activity.id === selectedId) ?? activities[0];

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.scrollTo(0);
  }, [carouselApi, selectedId]);

  return (
    <>
      <Title title="WINK, 우리들의 파도" subtitle="다양한 친목 활동" />

      <div className="flex flex-col sm:flex-row gap-3">
        {!isLoading && activities.length > 0
          ? activities.map((activity) => (
              <div key={activity.id} className="relative">
                <Image
                  src={activity.images[0]}
                  alt={activity.images[0]}
                  width={250}
                  height={250}
                  quality={100}
                  unoptimized
                  onClick={() => setSelectedId(activity.id)}
                  className={cn(
                    'w-[250px] sm:w-full sm:h-[250px] rounded-3xl object-cover cursor-pointer transition-all duration-300',
                    selected?.id === activity.id
                      ? 'h-[150px] sm:w-[250px]'
                      : 'h-[50px] sm:w-[75px] grayscale',
                  )}
                />
              </div>
            ))
          : Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="relative">
                <Skeleton
                  className={cn(
                    'w-[250px] sm:w-full sm:h-[250px] rounded-3xl',
                    idx === 0 ? 'h-[150px] sm:w-[250px]' : 'h-[50px] sm:w-[75px]',
                  )}
                />
              </div>
            ))}
      </div>

      {selected ? (
        <p className="text-xl sm:text-2xl font-semibold">{selected.title}</p>
      ) : (
        <Skeleton className="w-72 h-8" />
      )}

      <Wave>
        <div className="flex flex-col items-center space-y-6">
          <Carousel
            opts={{
              align: 'start',
            }}
            setApi={setCarouselApi}
            className="max-w-[300px] sm:max-w-[400px] min-[930px]:max-w-[800px] min-[1300px]:max-w-[1200px]"
          >
            <CarouselContent>
              {selected ? (
                selected.images.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="min-[900px]:basis-1/2 min-[1300px]:basis-1/3"
                  >
                    <Image
                      src={image}
                      alt={image}
                      width={500}
                      height={300}
                      quality={100}
                      unoptimized
                      className="w-[300px] h-[200px] sm:w-[400px] sm:h-[250px] rounded-xl object-cover"
                    />
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <Skeleton className="w-[300px] h-[200px] sm:w-[400px] sm:h-[250px] rounded-xl" />
                </CarouselItem>
              )}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
          {selected ? (
            <p className="text-sm sm:text-lg">{selected.description}</p>
          ) : (
            <Skeleton className="w-60 h-5" />
          )}
        </div>
      </Wave>
    </>
  );
}
