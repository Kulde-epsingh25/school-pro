import { AudioWaveform, Command, ClipboardList, DollarSign, Frame, GraduationCap, LayoutDashboard, Map, PieChart, Settings2, Users, ShieldAlert } from "lucide-react";

export const data = {};
export const getNavData = (roles: string[] = []) => {
    const isSaaSSuperAdmin = roles.includes("saas_super_admin");
    const isTenantSuperAdmin = roles.includes("super_admin");
    const isAdmin = roles.includes("admin") || isTenantSuperAdmin;
    const isTeacher = roles.includes("teacher");
    const isStudent = roles.includes("student");
    const isParent = roles.includes("parent");

    const navMain = [];

    if (isSaaSSuperAdmin) {
        navMain.push({
            title: "Platform Admin",
            url: "/saas-admin",
            icon: ShieldAlert,
            isActive: true,
            items: [
                { title: "Overview", url: "/saas-admin" },
                { title: "Tenants", url: "/saas-admin/tenants" },
                { title: "Platform Settings", url: "/saas-admin/settings" },
                { title: "Analytics", url: "/saas-admin/analytics" },
                { title: "Audit Logs", url: "/saas-admin/audit" },
                { title: "Account & Security", url: "/saas-admin/account" },
            ],
        });
    }

    if (isTenantSuperAdmin) {
        navMain.push({
            title: "Organization Admin",
            url: "/admin",
            icon: ShieldAlert,
            isActive: true,
            items: [
                { title: "Roles & Permissions", url: "/admin/roles" },
                { title: "Users", url: "/admin/users" },
                { title: "Audit Logs", url: "/admin/audit" },
                { title: "Organization Settings", url: "/admin/settings/security" },
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
                { title: "Academic Reports", url: "/dashboard/reports/academic" },
                { title: "Attendance Reports", url: "/dashboard/reports/attendance" },
                { title: "Financial Reports", url: "/dashboard/reports/financial" },
            ],
        });
        navMain.push({
            title: "Students",
            url: "/dashboard/students",
            icon: Users,
            items: [
                { title: "Student Directory", url: "/dashboard/students" },
            ],
        });
        navMain.push({
            title: "Academics",
            url: "/dashboard/academics",
            icon: GraduationCap,
            items: [
                { title: "Classes", url: "/dashboard/academics/classes" },
                { title: "Departments", url: "/dashboard/academics/departments" },
                { title: "Subjects", url: "/dashboard/academics/subjects" },
                { title: "Terms", url: "/dashboard/academics/terms" },
                { title: "Timetable", url: "/dashboard/academics/timetable" },
                { title: "Examinations", url: "/dashboard/academics/exams" },
                { title: "Assignments", url: "/dashboard/academics/assignments" },
                { title: "Report Cards", url: "/dashboard/academics/report-cards" },
            ],
        });
    }

    if (isAdmin) {
        navMain.push({
            title: "Staff",
            url: "/dashboard/teacher",
            icon: ClipboardList,
            items: [
                { title: "All Staff", url: "/dashboard/teacher" },
            ],
        });
        navMain.push({
            title: "Finance",
            url: "/dashboard/finance",
            icon: DollarSign,
            items: [
                { title: "Fee Collection", url: "/dashboard/finance/fees" },
                { title: "Expenses", url: "/dashboard/finance/expenses" },
                { title: "Payroll", url: "/dashboard/finance/payroll" },
            ],
        });
        navMain.push({
            title: "Settings",
            url: "/admin/settings/security",
            icon: Settings2,
            items: [
                { title: "Backup & Security", url: "/admin/settings/security" },
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
