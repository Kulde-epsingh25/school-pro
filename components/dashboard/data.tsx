import {
    ClipboardList,
    DollarSign,
    GraduationCap,
    LayoutDashboard,
    Settings2,
    Users,
    ShieldAlert,
    BookOpen,
    Bus,
    Building2,
    HeartPulse,
    Brain,
    UserCheck,
    Truck,
    Gift,
    FileText,
    Calendar,
    Briefcase,
    Sliders,
    Layers,
    KeyRound,
    Navigation,
    Activity,
    Fingerprint,
    Send,
    Palette
} from "lucide-react";

export interface DynamicNavContext {
    roles?: string[];
    permissions?: string[];
    tenantModules?: Record<string, boolean>; // e.g. { MODULE_HOSTEL: true, MODULE_TRANSPORT: true }
}

export interface NavSubItem {
    title: string;
    url: string;
    requiredPermission?: string;
    requiredModule?: string;
}

export interface NavMainSection {
    title: string;
    url: string;
    icon: any;
    isActive?: boolean;
    requiredPermission?: string;
    requiredModule?: string;
    items?: NavSubItem[];
}

export const data = {};

/**
 * Pure Dynamic Permission & Feature-Flag Driven Navigation Engine
 * Evaluates access based on atomic permissions, active roles, and enabled tenant modules.
 */
export const getNavData = (contextOrRoles: string[] | DynamicNavContext = []) => {
    // Normalize input (supports legacy string[] of roles or rich DynamicNavContext)
    const context: DynamicNavContext = Array.isArray(contextOrRoles)
        ? { roles: contextOrRoles, permissions: [], tenantModules: {} }
        : contextOrRoles;

    const roles = context.roles || [];
    const permissions = new Set(context.permissions || []);
    const tenantModules = context.tenantModules || {};

    const isSaaSSuperAdmin = roles.includes("saas_super_admin") || roles.includes("SAAS_SUPER_ADMIN");
    const isTenantSuperAdmin = roles.includes("super_admin") || roles.includes("SUPER_ADMIN");
    const isAdmin = roles.includes("admin") || isTenantSuperAdmin;
    const isTeacher = roles.includes("teacher") || roles.includes("substitute");
    const isStudent = roles.includes("student");
    const isParent = roles.includes("parent");
    const isAlumni = roles.includes("alumni");
    const isVendor = roles.includes("vendor");

    // Dynamic Permission Checker Helper
    const hasPermission = (permCode?: string): boolean => {
        if (!permCode) return true;
        if (isSaaSSuperAdmin || isTenantSuperAdmin) return true; // Super admins bypass granular checks
        if (permissions.has("*") || permissions.has("ALL")) return true;
        return permissions.has(permCode);
    };

    // Tenant Module Feature Flag Helper (Defaults to true if unspecified unless strictly gated)
    const isModuleEnabled = (moduleKey?: string): boolean => {
        if (!moduleKey) return true;
        if (tenantModules[moduleKey] === false) return false;
        return true;
    };

    const navMain: NavMainSection[] = [];

    // -------------------------------------------------------------
    // 1. SaaS Platform Global Admin
    // -------------------------------------------------------------
    if (isSaaSSuperAdmin || hasPermission("SAAS:READ_DASHBOARD")) {
        const saasItems: NavSubItem[] = [
            { title: "Overview", url: "/saas-admin" },
            { title: "Tenants Directory", url: "/saas-admin/tenants" },
            { title: "Feature Flags Manager", url: "/saas-admin/feature-flags" },
            { title: "Billing & Subscriptions", url: "/saas-admin/billing" },
            { title: "Support Impersonation", url: "/saas-admin/support" },
            { title: "Platform Settings", url: "/saas-admin/settings" },
            { title: "Analytics & Usage", url: "/saas-admin/analytics" },
            { title: "Audit Logs", url: "/saas-admin/audit" },
            { title: "Account & Security", url: "/saas-admin/account" },
        ];

        navMain.push({
            title: "Platform Admin",
            url: "/saas-admin",
            icon: ShieldAlert,
            isActive: true,
            items: saasItems,
        });
    }

    // -------------------------------------------------------------
    // 2. Tenant Organization Super Admin
    // -------------------------------------------------------------
    if (isTenantSuperAdmin || hasPermission("TENANT_RBAC:MANAGE")) {
        const orgItems: NavSubItem[] = [
            { title: "Roles & Permissions", url: "/admin/roles" },
            { title: "Delegated Access", url: "/admin/roles/delegations" },
            { title: "Users Directory", url: "/admin/users" },
            { title: "Feature Modules", url: "/admin/settings/modules" },
            { title: "Branding & i18n", url: "/admin/settings/branding" },
            { title: "Data Privacy (GDPR)", url: "/admin/settings/data-requests" },
            { title: "Audit Logs", url: "/admin/audit" },
            { title: "Security Settings", url: "/admin/settings/security" },
        ];

        navMain.push({
            title: "Organization Admin",
            url: "/admin",
            icon: ShieldAlert,
            isActive: true,
            items: orgItems,
        });
    }

    // -------------------------------------------------------------
    // 3. Core Dashboard & Intelligence
    // -------------------------------------------------------------
    if (isAdmin || isTeacher || hasPermission("DASHBOARD:READ")) {
        const dashItems: NavSubItem[] = [
            { title: "Overview", url: "/dashboard" },
            { title: "Analytics", url: "/dashboard/analytics" },
            { title: "Academic Reports", url: "/dashboard/reports/academic" },
            { title: "Attendance Reports", url: "/dashboard/reports/attendance" },
            { title: "Financial Reports", url: "/dashboard/reports/financial" },
        ];

        if (hasPermission("AI_PREDICTIONS:READ") || isAdmin || isTeacher) {
            dashItems.push({ title: "AI Early Warning", url: "/dashboard/analytics/ai-predictions" });
        }

        navMain.push({
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: dashItems,
        });
    }

    // -------------------------------------------------------------
    // 4. Students, Admissions & Specialized Care
    // -------------------------------------------------------------
    if (isAdmin || isTeacher || hasPermission("STUDENTS:READ")) {
        const studentItems: NavSubItem[] = [
            { title: "Student Directory", url: "/dashboard/students" },
        ];

        if ((isAdmin || hasPermission("ADMISSIONS:MANAGE")) && isModuleEnabled("MODULE_ADMISSIONS")) {
            studentItems.push({ title: "Admissions Pipeline", url: "/dashboard/students/admissions" });
        }

        if ((isAdmin || roles.includes("health_officer") || hasPermission("HEALTH_RECORDS:READ")) && isModuleEnabled("MODULE_HEALTH")) {
            studentItems.push({ title: "Health Records", url: "/dashboard/students/health" });
        }

        if ((isAdmin || roles.includes("counselor") || hasPermission("COUNSELING:READ")) && isModuleEnabled("MODULE_COUNSELING")) {
            studentItems.push({ title: "Counseling Notes", url: "/dashboard/students/counseling" });
        }

        navMain.push({
            title: "Students & Care",
            url: "/dashboard/students",
            icon: Users,
            items: studentItems,
        });
    }

    // -------------------------------------------------------------
    // 5. Academics, Curriculum & LMS
    // -------------------------------------------------------------
    if (isAdmin || isTeacher || hasPermission("CLASSES:READ") || roles.includes("exam_coordinator")) {
        const academicItems: NavSubItem[] = [
            { title: "Classes & Sections", url: "/dashboard/academics/classes" },
            { title: "Departments", url: "/dashboard/academics/departments" },
            { title: "Subjects", url: "/dashboard/academics/subjects" },
            { title: "Academic Terms", url: "/dashboard/academics/terms" },
            { title: "Timetable", url: "/dashboard/academics/timetable" },
            { title: "Examinations", url: "/dashboard/academics/exams" },
            { title: "Assignments", url: "/dashboard/academics/assignments" },
            { title: "Lesson Plans", url: "/dashboard/academics/lesson-plans" },
            { title: "Learning Resources (LMS)", url: "/dashboard/academics/resources" },
            { title: "Gradebook Analytics", url: "/dashboard/academics/gradebook" },
            { title: "Report Cards", url: "/dashboard/academics/report-cards" },
        ];

        navMain.push({
            title: "Academics & LMS",
            url: "/dashboard/academics",
            icon: GraduationCap,
            items: academicItems,
        });
    }

    // -------------------------------------------------------------
    // 6. Staff & HR Management
    // -------------------------------------------------------------
    if (isAdmin || hasPermission("STAFF:READ")) {
        const staffItems: NavSubItem[] = [
            { title: "All Staff", url: "/dashboard/teacher" },
            { title: "Recruitment (ATS)", url: "/dashboard/staff/recruitment" },
            { title: "Leave Management", url: "/dashboard/staff/leave" },
            { title: "360 Appraisals", url: "/dashboard/staff/reviews" },
        ];

        navMain.push({
            title: "Staff & HR",
            url: "/dashboard/teacher",
            icon: Briefcase,
            items: staffItems,
        });
    }

    // -------------------------------------------------------------
    // 7. Enterprise Finance & Supply Chain
    // -------------------------------------------------------------
    if (isAdmin || roles.includes("finance_officer") || hasPermission("FEES:READ")) {
        const financeItems: NavSubItem[] = [
            { title: "Fee Collection", url: "/dashboard/finance/fees" },
            { title: "Fee Structures", url: "/dashboard/finance/fee-structures" },
            { title: "Expenses & Bills", url: "/dashboard/finance/expenses" },
            { title: "Procurement & POs", url: "/dashboard/finance/procurement" },
            { title: "Fixed Assets & Inventory", url: "/dashboard/finance/inventory" },
            { title: "Payroll Engine", url: "/dashboard/finance/payroll" },
            { title: "Gateway Reconciliation", url: "/dashboard/finance/reconciliation" },
        ];

        navMain.push({
            title: "Finance & Procurement",
            url: "/dashboard/finance",
            icon: DollarSign,
            items: financeItems,
        });
    }

    // -------------------------------------------------------------
    // 8. Campus Operations & IoT Telemetry
    // -------------------------------------------------------------
    if (
        isAdmin ||
        roles.includes("librarian") ||
        roles.includes("transport_coordinator") ||
        roles.includes("hostel_warden") ||
        hasPermission("CAMPUS_OPERATIONS:READ")
    ) {
        const opItems: NavSubItem[] = [];

        if (isModuleEnabled("MODULE_LIBRARY")) {
            opItems.push({ title: "Library Catalog", url: "/dashboard/library" });
        }
        if (isModuleEnabled("MODULE_TRANSPORT")) {
            opItems.push({ title: "Transport Fleet", url: "/dashboard/transport" });
            opItems.push({ title: "Live GPS Telemetry", url: "/dashboard/transport/live-gps" });
        }
        if (isModuleEnabled("MODULE_BIOMETRICS") || isAdmin) {
            opItems.push({ title: "Biometric & Face Sync", url: "/dashboard/attendance/biometrics" });
        }
        if (isModuleEnabled("MODULE_HOSTEL")) {
            opItems.push({ title: "Hostel Management", url: "/dashboard/hostel" });
        }
        if (isModuleEnabled("MODULE_BROADCAST") || isAdmin) {
            opItems.push({ title: "Omnichannel Broadcast", url: "/dashboard/communication/broadcast" });
        }

        if (opItems.length > 0) {
            navMain.push({
                title: "Campus Operations",
                url: "/dashboard/operations",
                icon: Building2,
                items: opItems,
            });
        }
    }

    // -------------------------------------------------------------
    // 9. Dedicated End-User Portals
    // -------------------------------------------------------------
    if (isStudent) {
        navMain.push({
            title: "Student Portal",
            url: "/portal/student",
            icon: GraduationCap,
            isActive: true,
            items: [
                { title: "My Timetable", url: "/portal/student/timetable" },
                { title: "My Assignments", url: "/portal/student/assignments" },
                { title: "Learning Resources", url: "/portal/student/resources" },
                { title: "My Report Cards", url: "/portal/student/report-cards" },
                { title: "My Attendance", url: "/portal/student/attendance" },
                { title: "My Fees", url: "/portal/student/fees" },
                { title: "Noticeboard", url: "/portal/student/noticeboard" },
            ],
        });
    }

    if (isParent) {
        navMain.push({
            title: "Parent Portal",
            url: "/portal/parent",
            icon: Users,
            isActive: true,
            items: [
                { title: "Children Overview", url: "/portal/parent/children" },
                { title: "Fee Payments", url: "/portal/parent/fees" },
                { title: "Attendance Records", url: "/portal/parent/attendance" },
                { title: "Report Cards", url: "/portal/parent/report-cards" },
                { title: "Messages & Direct Contact", url: "/portal/parent/messages" },
            ],
        });
    }

    if (isAlumni && isModuleEnabled("MODULE_ALUMNI")) {
        navMain.push({
            title: "Alumni Network",
            url: "/portal/alumni",
            icon: Gift,
            isActive: true,
            items: [
                { title: "Alumni Directory", url: "/portal/alumni" },
                { title: "Reunions & Chapters", url: "/portal/alumni" },
                { title: "Scholarship Endowment", url: "/portal/alumni" },
            ],
        });
    }

    if (isVendor) {
        navMain.push({
            title: "Vendor Portal",
            url: "/portal/vendor",
            icon: Truck,
            isActive: true,
            items: [
                { title: "Purchase Orders", url: "/portal/vendor" },
                { title: "Invoice Submission", url: "/portal/vendor" },
            ],
        });
    }

    return {
        ...data,
        navMain,
    };
};
