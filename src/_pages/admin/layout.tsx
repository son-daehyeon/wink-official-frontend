import { ReactNode } from 'react';

import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { sideItems } from './_constant/side-menus';

import { isAdmin } from '@/entities/user';
import { getServerCurrentUser } from '@/features/user/server';
import { ORIGINAL_REQUEST_TARGET_HEADER, createLoginRedirect } from '@/shared/lib/auth-redirect';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/shared/ui/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const [user, requestHeaders] = await Promise.all([getServerCurrentUser(), headers()]);

  if (!user) {
    redirect(createLoginRedirect(requestHeaders.get(ORIGINAL_REQUEST_TARGET_HEADER), '/admin'));
  }

  if (!isAdmin(user.role)) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="sm:pt-14">
          {sideItems.map(({ group, items }) => (
            <SidebarGroup key={group}>
              <SidebarGroupLabel>{group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map(({ title, url, icon: Icon }) => (
                    <SidebarMenuItem key={title}>
                      <SidebarMenuButton asChild>
                        <Link href={url}>
                          <Icon />
                          <span>{title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
      <main className="flex flex-col w-full p-6 space-y-6">{children}</main>
    </SidebarProvider>
  );
}
