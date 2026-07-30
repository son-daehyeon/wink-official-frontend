'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Title from '../_component/title';
import Carousel from './_component/carousel';
import CreateProjectModal from './_component/modal/create-project';
import DeleteProjectModal from './_component/modal/delete-project';
import UpdateProjectModal from './_component/modal/update-project';
import ProjectCard from './_component/project-card';

import { Project } from '@/entities/program';
import { isAdmin } from '@/entities/user';
import { useProjectsQuery } from '@/features/program';
import { useUserStore } from '@/features/user';
import Page from '@/shared/model/page';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { parseAsInteger, useQueryState } from 'nuqs';

interface ProgramProjectClientProps {
  initialPage: number;
}

export default function ProgramProjectClient({ initialPage }: ProgramProjectClientProps) {
  const { user } = useUserStore();
  const [selected, setSelected] = useState<Project>();

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(initialPage));
  const { data, isFetching } = useProjectsQuery(page);

  const [projectPages, setProjectPages] = useState<Record<number, Page<Project>>>({});

  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [updateProjectModal, setUpdateProjectModal] = useState(false);
  const [deleteProjectModal, setDeleteProjectModal] = useState(false);

  const projects = useMemo(() => {
    const pages = Object.entries(projectPages)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, page]) => page);

    if (pages.length === 0) return undefined;

    return {
      page: pages[pages.length - 1].page,
      content: pages.flatMap((page) => page.content),
    } satisfies Page<Project>;
  }, [projectPages]);

  const onCreateProject = useCallback((project: Project) => {
    setProjectPages((prev) => {
      const firstPage = prev[0];

      if (!firstPage) {
        return prev;
      }

      return {
        ...prev,
        0: {
          page: firstPage.page,
          content: [project, ...firstPage.content],
        },
      };
    });
  }, []);

  const onUpdateProject = useCallback((project: Project) => {
    setProjectPages((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([page, value]) => [
          page,
          {
            page: value.page,
            content: value.content.map((p) => (p.id === project.id ? project : p)),
          },
        ]),
      ),
    );
  }, []);

  const onDeleteProject = useCallback((id: string) => {
    setProjectPages((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([page, value]) => [
          page,
          {
            page: value.page,
            content: value.content.filter((p) => p.id !== id),
          },
        ]),
      ),
    );
  }, []);

  useEffect(() => {
    if (data?.projects) {
      setProjectPages((prev) => ({
        ...prev,
        [page]: data.projects,
      }));
    }
  }, [data?.projects, page]);

  return (
    <>
      <Title title="WINK, 우리들의 파도" subtitle="나날이 성장해 가는 우리" />

      {user && (
        <Button variant="wink" onClick={() => setCreateProjectModal(true)}>
          프로젝트 추가
        </Button>
      )}

      <div className="hidden sm:block py-5">
        <Carousel loading={isFetching} projects={projects?.content.slice(0, 6) || []} />
      </div>

      <div className="flex flex-wrap gap-4 sm:gap-8 items-center justify-center max-w-[1050px]">
        {projects
          ? projects.content.map((project) => (
              <ProjectCard
                key={project.id}
                user={user}
                project={project}
                setSelectedProject={setSelected}
                setUpdateProjectModal={setUpdateProjectModal}
                setDeleteProjectModal={setDeleteProjectModal}
              />
            ))
          : Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="w-[280px] sm:w-[320px] h-[204px] sm:h-[236px] rounded-3xl"
              />
            ))}
      </div>

      {projects && projects.page.totalPages - 1 > page && (
        <Button variant="outline" disabled={isFetching} onClick={() => setPage(page + 1)}>
          더보기
        </Button>
      )}

      <CreateProjectModal
        open={createProjectModal}
        setOpen={setCreateProjectModal}
        callback={onCreateProject}
      />

      <UpdateProjectModal
        open={updateProjectModal}
        setOpen={setUpdateProjectModal}
        project={selected}
        callback={onUpdateProject}
        isAdmin={isAdmin(user?.role)}
      />

      <DeleteProjectModal
        open={deleteProjectModal}
        setOpen={setDeleteProjectModal}
        project={selected}
        callback={onDeleteProject}
        isAdmin={isAdmin(user?.role)}
      />
    </>
  );
}
