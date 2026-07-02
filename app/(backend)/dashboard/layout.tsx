import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { data } from "@/components/dashboard/data";
import { getServerUser } from '@/actions/auth';

export default async function DashboardLayout({ children }: {
  children: ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  // Override static user data with dynamic user session
  const sessionUser = {
    name: user.name,
    email: user.email,
    avatar: user.image || "",
  };
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Sidebar */}
        <DashboardSidebar 
          user={sessionUser}
          teams={data.teams}
          navMain={data.navMain}
          projects={data.projects}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden flex flex-col">
          <DashboardHeader />
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
