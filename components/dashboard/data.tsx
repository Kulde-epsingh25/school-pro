"use client"
import { AudioWaveform, Command, ClipboardList, DollarSign, Frame, GraduationCap, LayoutDashboard, Map, PieChart, Settings2, Users, ShieldAlert } from "lucide-react";

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

export const getNavData = (roles: string[] = []) => {
    const isSuperAdmin = roles.includes("super_admin");
    const isAdmin = roles.includes("admin") || isSuperAdmin;
    const isTeacher = roles.includes("teacher");
    const isStudent = roles.includes("student");
    const isParent = roles.includes("parent");

    const navMain = [];

    if (isSuperAdmin) {
        navMain.push({
            title: "Platform Admin",
            url: "/super-admin",
            icon: ShieldAlert,
            isActive: true,
            items: [
                { title: "Overview", url: "/super-admin" },
                { title: "Tenants", url: "/super-admin/tenants" },
                { title: "Users & Roles", url: "/super-admin/users" },
                { title: "System Settings", url: "/super-admin/settings" },
                { title: "Analytics", url: "/super-admin/analytics" },
                { title: "Monitoring", url: "/super-admin/monitoring" },
                { title: "Audit Logs", url: "/super-admin/audit" },
            ],
        });
    }

    if (isAdmin || isTeacher) {
        navMain.push({
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                { title: "Overview", url: "/dashboard" },
                { title: "Analytics", url: "/dashboard/analytics" },
                { title: "Reports", url: "/dashboard/reports" },
            ],
        });
        navMain.push({
            title: "Students",
            url: "/dashboard/students",
            icon: Users,
            items: [
                { title: "Student Directory", url: "/dashboard/students" },
                { title: "Fee Management", url: "/dashboard/students/fees" },
                { title: "Attendance", url: "/dashboard/students/attendance" },
                { title: "Student ID ", url: "/dashboard/students/id" },
            ],
        });
        navMain.push({
            title: "Academics",
            url: "/dashboard/academics",
            icon: GraduationCap,
            items: [
                { title: "Timetable", url: "/dashboard/academics/timetable" },
                { title: "Examinations", url: "/dashboard/academics/examinations" },
                { title: "Assignments", url: "/dashboard/academics/assignments" },
                { title: "Report Cards", url: "/dashboard/academics/report-cards" },
            ],
        });
    }

    if (isAdmin) {
        navMain.push({
            title: "Staff",
            url: "/dashboard/staff",
            icon: ClipboardList,
            items: [
                { title: "All Staff", url: "/dashboard/staff" },
                { title: "Attendance", url: "/dashboard/staff/attendance" },
                { title: "Payroll", url: "/dashboard/staff/payroll" },
                { title: "Leave Management", url: "/dashboard/staff/leave" },
            ],
        });
        navMain.push({
            title: "Finance",
            url: "/finance",
            icon: DollarSign,
            items: [
                { title: "Fee Collection", url: "/finance/fees" },
                { title: "Invoices", url: "/finance/invoices" },
                { title: "Scholarships", url: "/finance/scholarships" },
                { title: "Expense Reports", url: "/finance/expenses" },
            ],
        });
        navMain.push({
            title: "Settings",
            url: "/settings",
            icon: Settings2,
            items: [
                { title: "School Profile", url: "/settings/profile" },
                { title: "User Management", url: "/settings/users" },
                { title: "System Settings", url: "/settings/system" },
                { title: "Backup & Security", url: "/settings/security" },
            ],
        });
        navMain.push({
            title: "Admin Only",
            url: "/dashboard/admin",
            icon: Settings2,
            items: [
                { title: "User Management", url: "/dashboard/admin/users" },
                { title: "Contacts", url: "/dashboard/admin/contacts" },
            ],
        });
    }

    if (isStudent) {
        navMain.push({
            title: "Student Portal",
            url: "/portal/student",
            icon: GraduationCap,
            items: [
                { title: "My Timetable", url: "/portal/student/timetable" },
                { title: "My Assignments", url: "/portal/student/assignments" },
                { title: "My Report Cards", url: "/portal/student/report-cards" },
                { title: "My Attendance", url: "/portal/student/attendance" },
                { title: "My Fees", url: "/portal/student/fees" },
            ],
        });
    }

    if (isParent) {
        navMain.push({
            title: "Parent Portal",
            url: "/portal/parent",
            icon: Users,
            items: [
                { title: "Children Overview", url: "/portal/parent/children" },
                { title: "Fee Payments", url: "/portal/parent/fees" },
                { title: "Attendance Records", url: "/portal/parent/attendance" },
                { title: "Report Cards", url: "/portal/parent/report-cards" },
            ],
        });
    }

    return {
        ...data,
        navMain
    };
};
