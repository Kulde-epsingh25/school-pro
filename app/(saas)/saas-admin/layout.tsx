import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { getServerUser, getAccessToken } from "@/actions/auth";
import { SessionHydrator } from "@/components/auth/session-hydrator";

export default async function SaasAdminLayout({ children }: {
  children: ReactNode;
}) {
  const user = await getServerUser();
  const token = await getAccessToken();

  // Enforce SaaS Super Admin role protection server-side
  if (!user || !user.roles?.includes("saas_super_admin")) {
    redirect("/dashboard");
  }

  const sessionUser = {
    name: user?.name || "Platform SuperAdmin",
    email: user?.email || "",
    avatar: user?.image || "",
    roles: user?.roles || ["saas_super_admin"]
  };

  return (
    <SidebarProvider>
      <SessionHydrator user={user} school={null} token={token} />
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
