'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import logo from '@/public/logo.png';

import MobileMenu from './_components/mobile-menu';
import ChangeMyInfoModal from './_components/modal/change-my-info';
import ChangeMyPasswordModal from './_components/modal/change-my-password';
import NavItem from './_components/nav-item';
import { getMenuItems } from './_constant/header-item';

import { useLogoutMutation } from '@/features/auth';
import { useUserStore } from '@/features/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Skeleton } from '@/shared/ui/skeleton';
import { FolderCode, KeyRound, LogOut, UserIcon, UserPen } from 'lucide-react';
import { toast } from 'sonner';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user, isInit } = useUserStore();
  const logout = useLogoutMutation();
  const loading = !isInit;

  const [changeMyPasswordModalOpen, setChangeMyPasswordModalOpen] = useState(false);
  const [changeMyInfoModalOpen, setChangeMyInfoModalOpen] = useState(false);

  const menuItems = getMenuItems(user);
  const currentPath = `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;

  return (
    <>
      <header className="fixed top-0 flex w-full h-14 bg-white items-center justify-between px-4 sm:px-8 shadow z-50">
        <Link href="/">
          <Image
            src={logo}
            alt={logo.src}
            width={200}
            height={80}
            quality={100}
            priority
            className="w-[48px] h-[19.5px] sm:w-[64px] sm:h-[26px]"
          />
        </Link>

        <nav className="hidden sm:flex items-center space-x-4">
          {menuItems.map((item) => (
            <NavItem key={item.title} item={item} />
          ))}

          {loading ? (
            <Button variant="ghost" className="rounded-lg">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-[36.3px] h-4" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} alt="avatar" />
                    <AvatarFallback>
                      <UserIcon />
                    </AvatarFallback>
                  </Avatar>

                  <p>{user.name}</p>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setChangeMyInfoModalOpen(true)}>
                    <UserPen />내 정보 수정
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChangeMyPasswordModalOpen(true)}>
                    <KeyRound />내 비밀번호 변경
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/application')}>
                    <FolderCode />내 애플리케이션
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      logout.mutate(undefined, {
                        onSettled: () => toast.success('로그아웃되었습니다.'),
                      });
                    }}
                  >
                    <LogOut />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavItem
              item={{ title: 'Login', href: `/auth/login?next=${encodeURIComponent(currentPath)}` }}
            />
          )}
        </nav>

        <nav className="block sm:hidden">
          <MobileMenu
            loading={loading}
            user={user}
            menuItems={menuItems}
            setChangeMyInfoModalOpen={setChangeMyInfoModalOpen}
            setChangeMyPasswordModalOpen={setChangeMyPasswordModalOpen}
          />
        </nav>
      </header>

      <ChangeMyInfoModal open={changeMyInfoModalOpen} setOpen={setChangeMyInfoModalOpen} />
      <ChangeMyPasswordModal
        open={changeMyPasswordModalOpen}
        setOpen={setChangeMyPasswordModalOpen}
      />
    </>
  );
}
