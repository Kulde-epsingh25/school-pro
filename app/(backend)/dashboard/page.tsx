"use client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  AudioWaveform,
  ClipboardList,
  Command,
  DollarSign,
  Frame,
  GraduationCap,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  Users,
} from "lucide-react";

// Import extracted components
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RecentDataTable } from "@/components/dashboard/recent-data-table";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { StatCards } from "@/components/dashboard/stat-cards";

const attendanceData = [
  { name: "Sun", value: 0 },
  { name: "Mon", value: 91 },
  { name: "Tue", value: 87 },
  { name: "Wed", value: 95 },
  { name: "Thu", value: 89 },
  { name: "Fri", value: 92 },
  { name: "Sat", value: 0 },
];

const statsCards = [
  { title: "Total Students", value: "1,284", icon: Users },
  { title: "Total Revenue", value: "₹8,45,200", icon: DollarSign },
  { title: "Staff Members", value: "94", icon: ClipboardList },
  { title: "Active Classes", value: "38", icon: GraduationCap },
];

const feeCollectionData = [
  { name: "Jan", value: 320000 },
  { name: "Feb", value: 280000 },
  { name: "Mar", value: 410000 },
  { name: "Apr", value: 390000 },
  { name: "May", value: 450000 },
  { name: "Jun", value: 370000 },
];

const recentAdmissions = [
  {
    customer: "Aarav Sharma",
    email: "aarav.sharma@school.edu",
    source: "Online",
    status: "ENROLLED",
    date: "2024-10-14",
    amount: "₹45,000",
  },
  {
    customer: "Priya Patel",
    email: "priya.patel@school.edu",
    source: "Walk-in",
    status: "ENROLLED",
    date: "2024-10-13",
    amount: "₹45,000",
  },
  {
    customer: "Rohan Mehta",
    email: "rohan.mehta@school.edu",
    source: "Referral",
    status: "PENDING",
    date: "2024-10-12",
    amount: "₹45,000",
  },
  {
    customer: "Sneha Iyer",
    email: "sneha.iyer@school.edu",
    source: "Online",
    status: "ENROLLED",
    date: "2024-10-11",
    amount: "₹45,000",
  },
  {
    customer: "Karan Singh",
    email: "karan.singh@school.edu",
    source: "Walk-in",
    status: "PROCESSING",
    date: "2024-10-10",
    amount: "₹45,000",
  },
];

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "/dashboard" },
    ],
  },
  {
    title: "Student Management",
    url: "/dashboard/students",
    icon: Users,
    items: [
      { title: "Student Directory", url: "/dashboard/students" },
      { title: "Fees", url: "/dashboard/students/fees" },
      { title: "Student Ids", url: "/dashboard/students/id" },
      { title: "Attendance", url: "/dashboard/students/attendance" },
    ],
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Academics",
    url: "/dashboard/academics",
    icon: GraduationCap,
    items: [
      { title: "Curriculum", url: "/dashboard/academics/curriculum" },
      { title: "Timetable", url: "/dashboard/academics/timetable" },
      { title: "Examinations", url: "/dashboard/academics/examinations" },
      { title: "Assignments", url: "/dashboard/academics/assignments" },
      { title: "Report Cards", url: "/dashboard/academics/report-cards" },
    ],
  },
  {
    title: "Staff Management",
    url: "/dashboard/staff",
    icon: ClipboardList,
  },
  {
    title: "Communication",
    url: "/dashboard/communication",
    icon: AudioWaveform,
  },
  {
    title: "Finance",
    url: "/dashboard/finance",
    icon: DollarSign,
  },
  {
    title: "Transport",
    url: "/dashboard/transport",
    icon: Map,
  },
  {
    title: "Resources",
    url: "/dashboard/resources",
    icon: Command,
  },
  {
    title: "Reports & Analytics",
    url: "/dashboard/reports",
    icon: PieChart,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings2,
  },
];

const data = {
  user: {
    name: "Admin User",
    email: "admin@schoolname.edu",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "School Pro",
      logo: GraduationCap,
      plan: "Premium",
    },
    {
      name: "Sunrise Academy",
      logo: AudioWaveform,
      plan: "Standard",
    },
    {
      name: "Demo School",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: navMain,
  projects: [
    {
      name: "Annual Examination",
      url: "/academics/examinations",
      icon: Frame,
    },
    {
      name: "Fee Collection Drive",
      url: "/finance/fees",
      icon: PieChart,
    },
    {
      name: "Transport Routes",
      url: "/transport/routes",
      icon: Map,
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
        <div className="flex-1 space-y-4 p-4">
          <StatCards cards={statsCards} />
          <div className="grid gap-4 md:grid-cols-2">
            <SalesChart data={attendanceData} />
            <RevenueChart data={feeCollectionData} />
          </div>
          <RecentDataTable data={recentAdmissions} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
