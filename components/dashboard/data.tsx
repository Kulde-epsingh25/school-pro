"use client"
import { AudioWaveform, Command, ClipboardList, DollarSign, Frame, GraduationCap, LayoutDashboard, Map, PieChart, Settings2, Users } from "lucide-react";

export const data = {
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
            url: "/dashboard/students",
            icon: Users,
            items: [
                { title: "Student Directory", url: "/dashboard/students" },
                { title: "Fee Management", url: "/dashboard/students/fees" },
                { title: "Attendance", url: "/dashboard/students/attendance" },
                { title: "Student ID ", url: "/dashboard/students/id" },
            ],
        },
        {
            title: "Academics",
            url: "/dashboard/academics",
            icon: GraduationCap,
            items: [
                { title: "Timetable", url: "/dashboard/academics/timetable" },
                { title: "Examinations", url: "/dashboard/academics/examinations" },
                { title: "Assignments", url: "/dashboard/academics/assignments" },
                { title: "Report Cards", url: "/dashboard/academics/report-cards" },
            ],
        },
        {
            title: "Staff",
            url: "/dashboard/staff",
            icon: ClipboardList,
            items: [
                { title: "All Staff", url: "/dashboard/staff" },
                { title: "Attendance", url: "/dashboard/staff/attendance" },
                { title: "Payroll", url: "/dashboard/staff/payroll" },
                { title: "Leave Management", url: "/dashboard/staff/leave" },
            ],
        },
        {
            title: "Finance",
            url: "/finance",
            icon: DollarSign,
            items: [
                { title: "Fee Collection", url: "/finance/fees" },
                { title: "Invoices", url: "/finance/invoices" },
                { title: "Scholarships", url: "/finance/scholarships" },
                { title: "Expense Reports", url: "/finance/expenses" },
            ],
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings2,
            items: [
                { title: "School Profile", url: "/settings/profile" },
                { title: "User Management", url: "/settings/users" },
                { title: "System Settings", url: "/settings/system" },
                { title: "Backup & Security", url: "/settings/security" },
            ],
        },
        {
            title: "Admin Only",
            url: "/dashboard/admin",
            icon: Settings2,
            items: [
                { title: "User Management", url: "/dashboard/admin/users" },
                { title: "Contacts", url: "/dashboard/admin/contacts" },
            ],
        },
    ],
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
