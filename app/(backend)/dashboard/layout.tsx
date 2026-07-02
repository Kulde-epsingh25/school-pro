import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { data } from "@/components/dashboard/data";
export default function DashboardLayout({ children }: {
  children: ReactNode;
}) {
  const sessionUser = {
    name: "Loading...",
    email: "",
    avatar: "",
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
