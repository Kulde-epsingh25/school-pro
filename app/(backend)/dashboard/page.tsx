"use client";
import { SidebarProvider , SidebarInset} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Frame } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { adminSidebar } from "@/config/sidebar-roles";

const data = {
  user: {
    name: "John Doe (Admin)",
    email: "admin@school.edu",
    avatar: "/avatars/john.jpg",
  },
  teams: [
    {
      name: "School Pro Admin",
      plan: "Enterprise",
    },
  ],
  navMain: adminSidebar,
  projects: [
    {
      name: "Annual Examination",
      url: "/academics/examinations",
      icon: Frame,
    },
  ],
};

export default function DashboardPage() {
  return (
     <SidebarProvider>
      <DashboardSidebar
        user={data.user}
        teams={data.teams}
        navMain={data.navMain}
        projects={data.projects}
      />
       <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0"> 
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
      </SidebarProvider>
  );
}