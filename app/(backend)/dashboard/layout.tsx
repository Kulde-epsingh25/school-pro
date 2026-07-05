import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { getServerUser } from "@/actions/auth";

export default async function DashboardLayout({ children }: {
  children: ReactNode;
}) {
  const user = await getServerUser();

  const sessionUser = {
    name: user?.name || "Loading...",
    email: user?.email || "",
    avatar: user?.image || "",
    roles: user?.roles || ["teacher"] // Default role during load or if missing
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Sidebar */}
        <DashboardSidebar 
          user={sessionUser}
          roles={sessionUser.roles}
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
