"use client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Frame, GraduationCap, LayoutDashboard, Users } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import StudentAdmissionForm from "@/components/dashboard/forms/student-addmintion";
import { data } from "@/components/dashboard/data"

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
          <StudentAdmissionForm />
        </div>
      </SidebarInset>
    </SidebarProvider>

  );
}