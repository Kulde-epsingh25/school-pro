"use client";
import { SidebarProvider , SidebarInset} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Frame, LayoutDashboard, Users } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
const data = {
  user: {
    name: "John Doe",
    email: "john.doe@school.edu",
    avatar: "/avatars/john.jpg",
  },
  teams: [
    {
      name: "School Pro",
      plan: "Premium",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Analytics", url: "/dashboard/analytics" },
        { title: "Reports", url: "/dashboard/reports" },
      ],
    },
    {
      title: "Students",
      url: "/students",
      icon: Users,
      isActive: true,
      items: [
        { title: "All Students", url: "/students" },
        { title: "Enrollment", url: "/students/enrollment" },
        { title: "Attendance", url: "/students/attendance" },
        { title: "Performance", url: "/students/performance" },
      ],
    },
  ],
  projects: [
    {
      name: "Annual Examination",
      url: "/academics/examinations",
      icon: Frame,
    },
  ],
};

export default function StudentsPage() {
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
        <div > 
          students page content
        </div>
      </SidebarInset>
      </SidebarProvider>
  );
}